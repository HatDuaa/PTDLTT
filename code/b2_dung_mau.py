"""Bước 2 — Áp cửa sổ, gán nhóm thuế, dựng roster và bảng mẫu phân tích.

Tách khỏi bước 1 có chủ đích: quy tắc §3.7 cũ che HAI thao tác khác nhau —
(a) SKU phải có mặt ở cả hai kỳ, (b) đường chuyển thuế phải thuộc T/C10/C8.
Gộp chung thì khi số cuối lệch sẽ không biết lệch vì chọn lọc sống sót hay
vì phân loại thuế.

Bước 1 giữ cả tháng 4 nên hàm này nhận tham số cửa sổ — mọi cửa sổ độ nhạy
ở đặc tả khóa §6 đều chạy được từ cùng một dữ liệu chuẩn.

Đầu ra roster-sku.csv là DANH SÁCH SKU CHÍNH THỨC. Phase 3 và 4 đọc từ đây,
không được tự tính lại nhóm.
"""
import sys
import pandas as pd
import numpy as np
import config_du_an as cf

HOA = -1   # đánh dấu mode hòa, xử lý tường minh ở phan_nhom()


def mode_hoac_hoa(chuoi):
    """Mode; trả HOA khi hòa — đặc tả khóa §5.

    KHÔNG dùng mode().iloc[0]: pandas trả mode theo thứ tự tăng dần nên
    .iloc[0] âm thầm chọn giá trị nhỏ nhất. Đó là một bậc tự do không ai
    kiểm soát, phải xử lý tường minh.
    """
    m = chuoi.mode()
    return m.iloc[0] if len(m) == 1 else HOA


def phan_nhom(row):
    truoc, sau = row[False], row[True]
    # Hậu kỳ hòa 8/10 với tiền kỳ = 10 → T. Hàng bị loại trừ khỏi diện giảm
    # thuế không thể xuất hóa đơn ở 8%, nên phần giao dịch 8% chứng tỏ SKU
    # thuộc diện được giảm; phần còn ở 10% là cập nhật quầy chưa dứt điểm.
    # Loại chúng sẽ là chọn lọc theo biến hậu can thiệp.
    if truoc == 10 and sau == HOA:
        return "T"
    if truoc == HOA or sau == HOA:
        return "HOA"
    if truoc == 10 and sau == 8:
        return "T"
    if truoc == 10 and sau == 10:
        return "C10"
    if truoc == 8 and sau == 8:
        return "C8"
    return "X"


def chan_doan_type(PRE, roster):
    """Bằng chứng cho §9: `type` không phải thuộc tính hàng hóa."""
    sn = PRE.groupby("sku")["type"].nunique().rename("so_nhan_type")
    cd = roster.merge(sn, left_on="sku", right_index=True, how="left")
    cd["ma_noi_bo"] = cd["sku"].str.startswith("2010")
    bang = (cd.groupby(["grp", "so_nhan_type"]).size()
            .rename("so_sku").reset_index())
    tm = cd[~cd["ma_noi_bo"]]
    print(f"     chẩn đoán `type`: {(tm.so_nhan_type > 1).sum():,}/{len(tm):,} "
          f"({(tm.so_nhan_type > 1).mean()*100:.0f}%) SKU mã thương mại có >1 nhãn"
          f"  |  nhóm T có 1 nhãn: {((cd.grp=='T')&(cd.so_nhan_type==1)).sum()}/153"
          f"  → §9 KHÔNG dùng `type` chia tầng")
    bang.to_csv(cf.CSV_CHAN_DOAN_TYPE, index=False, encoding="utf-8")
    return cd


def chay(luong_mau=None, cua_so="chinh", ghi=True):
    bat_dau, ngay_cat = cf.CUA_SO_DO_NHAY[cua_so]
    luong_mau = list(luong_mau or [])

    def ghi_buoc(ten, truoc, sau, ghi_chu=""):
        luong_mau.append({
            "buoc": len(luong_mau), "quy_tac": ten, "dong_vao": truoc,
            "dong_ra": sau, "mat": truoc - sau, "ghi_chu": ghi_chu,
        })
        print(f"  {len(luong_mau)-1}. {ten:<44} {truoc:>7,} → {sau:>7,}"
              f"  (mất {truoc-sau:>6,})")

    print(f"Đọc dòng hàng đã lọc  |  cửa sổ '{cua_so}': từ {bat_dau}, cắt {ngay_cat}")
    d = pd.read_csv(cf.CSV_DONG_SACH, low_memory=False,
                    dtype={"sku": str, "soid": str})
    d["dg"] = pd.to_datetime(d["dg"])

    truoc = len(d)
    d = d[d["dg"] >= pd.Timestamp(bat_dau)]
    ghi_buoc(f"§6 Cửa sổ '{cua_so}' từ {bat_dau}", truoc, len(d),
             "loại tháng 4 — xem §11" if cua_so == "chinh" else "")
    d["post"] = d["dg"] >= pd.Timestamp(ngay_cat)

    # --- 2a. SKU phải có mặt ở CẢ hai kỳ (§7, ngưỡng chính) ---
    ca_hai = d.groupby("sku")["post"].nunique() == 2
    truoc = len(d)
    d = d[d["sku"].isin(set(ca_hai[ca_hai].index))]
    ghi_buoc("§7 SKU có mặt ở cả tiền kỳ và hậu kỳ", truoc, len(d),
             f"{int(ca_hai.sum()):,} SKU")

    # --- 2b. Gán nhóm theo đường chuyển thuế (§5) ---
    vat = d.groupby(["sku", "post"])["tyle_vat_ct"].agg(mode_hoac_hoa).unstack()
    ky_hoa = [gg["tyle_vat_ct"].mode().tolist()
              for _, g in d.groupby("sku") for _, gg in g.groupby("post")
              if len(gg["tyle_vat_ct"].mode()) > 1]
    tap_hoa = sorted({v for m in ky_hoa for v in m})
    cf.khang_dinh(set(tap_hoa) <= {8, 10},
                  f"có kỳ hòa giữa thuế suất ngoài {{8,10}}: {tap_hoa} — "
                  "quy tắc §5 chỉ định nghĩa cho hòa 8/10")

    grp = vat.apply(phan_nhom, axis=1).rename("grp")
    n_hoa = int((vat == HOA).any(axis=1).sum())
    n_thanh_T = int(((vat[False] == 10) & (vat[True] == HOA)).sum())
    print(f"     mode thuế suất hòa: {n_hoa} SKU  |  gán T theo §5: {n_thanh_T}"
          f"  |  loại: {n_hoa - n_thanh_T}  |  tập giá trị hòa: {tap_hoa}")

    truoc = len(d)
    d = d.merge(grp, left_on="sku", right_index=True, how="inner")
    d = d[d["grp"].isin(["T", "C10", "C8"])]
    ghi_buoc("§5 Đường chuyển thuế thuộc T/C10/C8", truoc, len(d))

    if cua_so == "chinh":
        cf.khang_dinh(len(d) == cf.KIEM_CHUNG["dong_sau_loc"],
                      f"còn {len(d):,} dòng, §3 ghi {cf.KIEM_CHUNG['dong_sau_loc']:,}")

    # --- Hiệp biến: CHỈ từ tiền kỳ (§8) ---
    PRE = d[~d["post"]]
    cf.khang_dinh(not PRE["post"].any(),
                  "khung tính hiệp biến chứa dòng hậu kỳ — lỗi rò rỉ đã từng mắc")

    hb = (PRE.groupby("sku")
          .apply(lambda g: pd.Series({
              "pre_p": g["pg"].median(),
              "pre_q": g["soluong_ct"].sum(),
              "pre_w": g["dg"].dt.to_period("W").nunique(),
          }), include_groups=False)
          .reset_index())

    # Định danh sản phẩm — cơ sở cho ba định nghĩa đối chứng (§5)
    ten = PRE.sort_values("dg").groupby("sku")["ten_hh_ct"].first().rename("ten_hang")
    roster = (d.groupby("sku")["grp"].first().reset_index()
              .merge(hb, on="sku").merge(ten, left_on="sku", right_index=True))
    roster["loai_sp"] = roster["ten_hang"].map(cf.phan_loai_san_pham)
    # Cờ SKU có mode thuế suất hòa 8/10 ở hậu kỳ: D của chúng KHÔNG xác định
    # duy nhất. Phase 3/4 cần cờ này để chạy biến thể loại chúng (T=144).
    sku_hoa = set(vat[(vat == HOA).any(axis=1)].index)
    roster["vat_hoa"] = roster["sku"].isin(sku_hoa).astype(int)

    dem = roster["grp"].value_counts()
    print(f"\n  Roster: {len(roster):,} SKU  |  "
          f"T={dem.get('T',0)}  C10={dem.get('C10',0)}  C8={dem.get('C8',0)}")
    c10 = roster[roster["grp"] == "C10"]["loai_sp"].value_counts()
    print(f"  Cơ cấu C10: rượu/bia/thuốc={c10.get('ruou_bia_thuoc',0)}  "
          f"hóa chất={c10.get('hoa_chat',0)}  không rõ={c10.get('khong_ro',0)}")

    if cua_so == "chinh":
        for nhom, khoa in [("T", "so_sku_T"), ("C10", "so_sku_C10"), ("C8", "so_sku_C8")]:
            cf.khang_dinh(dem.get(nhom, 0) == cf.KIEM_CHUNG[khoa],
                          f"{nhom}={dem.get(nhom,0)}, §5 ghi {cf.KIEM_CHUNG[khoa]}")
        cf.khang_dinh(len(roster) == cf.KIEM_CHUNG["so_sku_roster"],
                      f"roster {len(roster)} dòng, chờ {cf.KIEM_CHUNG['so_sku_roster']}")
        cf.khang_dinh(c10.get("ruou_bia_thuoc", 0) == cf.KIEM_CHUNG["so_sku_C10_ruou_bia_thuoc"],
                      f"ĐC-A có {c10.get('ruou_bia_thuoc',0)} SKU, §5 ghi "
                      f"{cf.KIEM_CHUNG['so_sku_C10_ruou_bia_thuoc']}")
    cf.khang_dinh(roster["sku"].is_unique, "roster có SKU trùng")

    chan_doan_type(PRE, roster)

    # --- Bảng mẫu phân tích: một dòng mỗi SKU (§4) ---
    gia = d.pivot_table(index="sku", columns="post", values=["pg", "pn"],
                        aggfunc="median").dropna()
    gia.columns = ["pg_tien", "pg_hau", "pn_tien", "pn_hau"]
    mau = roster.merge(gia.reset_index(), on="sku", how="inner")
    mau["y"] = np.log(mau["pg_hau"] / mau["pg_tien"]) * 100
    mau["yn"] = np.log(mau["pn_hau"] / mau["pn_tien"]) * 100
    mau["T"] = (mau["grp"] == "T").astype(int)

    # --- Khung không tuân thủ: tách Z (luật) khỏi D (cửa hàng thực áp) ---
    # Z=1: hàng hóa chất ở 10% tiền kỳ → NQ 204/2025 cho giảm về 8%
    # Z=0: hàng chịu thuế TTĐB → bị loại trừ ở CẢ HAI nghị quyết
    # Z=-1: chưa phân loại được từ tên hàng → phải làm độ nhạy, không tự chọn
    # D  : thuế suất cửa hàng THỰC áp ở hậu kỳ
    o_10 = mau["grp"].isin(["T", "C10"])
    mau["Z"] = np.where(o_10 & (mau["loai_sp"] == "hoa_chat"), 1,
                np.where(o_10 & (mau["loai_sp"] == "ruou_bia_thuoc"), 0, -1))
    mau["D"] = (mau["grp"] == "T").astype(int)
    zc = mau[mau["Z"] >= 0]
    z1 = zc[zc["Z"] == 1]
    tuan_thu = z1["D"].mean() if len(z1) else float("nan")
    print(f"  Khung Z/D: Z=1 → {len(z1)} SKU (cửa hàng cập nhật {int(z1['D'].sum())},"
          f" KHÔNG cập nhật {int((1-z1['D']).sum())}, tuân thủ {tuan_thu*100:.1f}%)"
          f"  |  Z=0 → {int((zc['Z']==0).sum())} SKU"
          f"  |  chưa phân loại trong T/C10: {int((o_10 & (mau['Z']==-1)).sum())}")
    cf.khang_dinh(int(((mau["Z"] == 0) & (mau["D"] == 1)).sum()) == 0,
                  "có SKU chịu thuế TTĐB bị áp 8% — trái luật, phải điều tra")
    # Tầng = phân vị 5 của giá nền (§9). KHÔNG dùng `type` — xem chẩn đoán trên.
    mau["tang_gia"] = pd.qcut(mau["pre_p"], cf.SO_PHAN_VI_GIA,
                              labels=False, duplicates="drop")

    cf.khang_dinh(np.isfinite(mau[["y", "yn"]].to_numpy()).all(),
                  "có giá trị y hoặc yn không hữu hạn")
    cf.khang_dinh(len(mau) == len(roster), "bảng mẫu lệch số dòng so với roster")

    if not ghi:
        return mau

    d.to_csv(cf.CSV_DONG_PHAN_TICH, index=False, encoding="utf-8")
    roster.to_csv(cf.CSV_ROSTER, index=False, encoding="utf-8")
    mau.to_csv(cf.CSV_MAU_PHAN_TICH, index=False, encoding="utf-8")
    pd.DataFrame(luong_mau).to_csv(cf.CSV_LUONG_MAU, index=False, encoding="utf-8")
    print(f"\n→ {cf.CSV_DONG_PHAN_TICH.relative_to(cf.GOC_REPO)}  ({len(d):,} dòng)")
    print(f"→ {cf.CSV_ROSTER.relative_to(cf.GOC_REPO)}       ({len(roster):,} SKU)")
    print(f"→ {cf.CSV_MAU_PHAN_TICH.relative_to(cf.GOC_REPO)} ({len(mau):,} SKU)")
    print(f"→ {cf.CSV_LUONG_MAU.relative_to(cf.GOC_REPO)}  ({len(luong_mau)} bước, "
          f"kết thúc ở {luong_mau[-1]['dong_ra']:,} dòng)")
    print("  Mọi kiểm chứng ĐẠT.")
    return True


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
