"""Bước 3 — Thống kê mô tả (chương 3). Chỉ đọc đầu ra chuẩn của bước 1–2.

🔴 QUY TẮC CHỐNG RÒ RỈ — đây là chương MÔ TẢ, không phải chương kết quả:
  - CẤM dùng `y`, `yn`, Δlog giá, ATT, pass-through, kiểm định tiền–hậu
  - CẤM vẽ chuỗi giá nhóm T/C xuyên qua 01/07 (đó là kết quả chưa điều chỉnh)
  - Doanh thu và sản lượng là biến HẬU can thiệp: chỉ dùng tổng toàn cửa hàng
    để mô tả độ phủ dữ liệu, không dùng để so sánh T/C hay chọn mẫu

Mọi bảng ghi ra ket-qua/ dạng CSV; mọi biểu đồ ghi ra ket-qua/hinh/.
"""
import sys
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import config_du_an as cf

THU_MUC_HINH = cf.THU_MUC_KET_QUA / "hinh"
CAM = ["y", "yn", "pg_hau", "pn_hau"]      # cột cấm dùng trong chương này


def _luu(fig, ten):
    THU_MUC_HINH.mkdir(exist_ok=True)
    fig.tight_layout()
    fig.savefig(THU_MUC_HINH / ten, dpi=140)
    plt.close(fig)
    print(f"     → hinh/{ten}")


def _ghi(df, ten, mo_ta):
    df.to_csv(cf.THU_MUC_KET_QUA / ten, index=False, encoding="utf-8")
    print(f"     → {ten:<34} {mo_ta}")


def do_phu_du_lieu(goc, chitiet):
    """Bảng + hình: ngày nào có dữ liệu, mã vạch điền từ khi nào.

    Dùng TOÀN BỘ file (12/2024–08/2025), không phải mẫu đã lọc — mục đích là
    chứng minh chế độ thu thập dữ liệu bị gãy. Biểu đồ doanh thu đơn thuần
    không chứng minh được điều đó.
    """
    print("  [1] Độ phủ dữ liệu theo thời gian")
    g = goc[goc["ma_ncc_hddt"] == "THUE_BANRA"].copy()
    c = chitiet.merge(g[["soid", "dg"]], on="soid", how="inner")
    c["thang"] = c["dg"].dt.to_period("M").astype(str)
    c["co_ma"] = c["ma_hh_ct"].notna() & (c["ma_hh_ct"] != "")

    theo_thang = c.groupby("thang").agg(
        so_ngay_co_du_lieu=("dg", lambda s: s.dt.date.nunique()),
        so_hoa_don=("soid", "nunique"),
        so_dong_hang=("soid", "size"),
        ti_le_co_ma_vach=("co_ma", "mean"),
    ).reset_index()
    theo_thang["so_sku"] = c[c["co_ma"]].groupby("thang")["ma_hh_ct"].nunique().reindex(
        theo_thang["thang"]).values
    theo_thang["ti_le_co_ma_vach"] = (theo_thang["ti_le_co_ma_vach"] * 100).round(1)
    _ghi(theo_thang, "eda-do-phu-theo-thang.csv", "ngày có dữ liệu, hóa đơn, mã vạch")

    theo_ngay = c.groupby(c["dg"].dt.date).agg(
        so_dong=("soid", "size"), ti_le_ma=("co_ma", "mean")).reset_index()
    theo_ngay.columns = ["ngay", "so_dong", "ti_le_ma"]
    theo_ngay["ngay"] = pd.to_datetime(theo_ngay["ngay"])
    lich = pd.DataFrame({"ngay": pd.date_range(theo_ngay["ngay"].min(),
                                              theo_ngay["ngay"].max())})
    lich = lich.merge(theo_ngay, on="ngay", how="left").fillna({"so_dong": 0})
    trong = int((lich["so_dong"] == 0).sum())
    print(f"      {len(theo_ngay)}/{len(lich)} ngày có dữ liệu — {trong} ngày TRỐNG")

    fig, ax = plt.subplots(2, 1, figsize=(13, 6.5), sharex=True)
    ax[0].fill_between(lich["ngay"], lich["so_dong"], step="mid", alpha=.75,
                       color="#3b6ea5", linewidth=0)
    ax[0].set_ylabel("Số dòng hàng / ngày")
    ax[0].set_title("Độ phủ dữ liệu — khoảng trắng là ngày KHÔNG có giao dịch nào")
    ax[1].plot(lich["ngay"], lich["ti_le_ma"] * 100, color="#b5651d", linewidth=1.4)
    ax[1].set_ylabel("% dòng có mã vạch")
    ax[1].set_ylim(-5, 105)
    moc = [("2025-03-13", "Bắt đầu lỗ hổng 39 ngày", "#c0392b"),
           ("2025-04-21", "Mã vạch bắt đầu được điền", "#b5651d"),
           # Dữ liệu cho HAI mốc khác nhau, đừng gộp làm một:
           #   02–10/06 — 9 ngày không có hóa đơn nào, hợp với việc đóng cửa dọn
           #   24/06    — `diachi_ban` đổi hẳn sang địa chỉ mới (trước đó 12–23/06
           #              vẫn ghi địa chỉ cũ, kể cả sau lỗ hổng)
           # Không suy được ngày dời VẬT LÝ: địa chỉ trên hóa đơn có thể được cập
           # nhật trễ so với lúc chuyển thật. Chỉ ghi thứ quan sát được.
           ("2025-06-24", "Địa chỉ trên hóa đơn đổi", "#7d3c98"),
           ("2025-07-01", "Chính sách giảm VAT", "#1e8449")]
    for i, (ng, nhan, mau) in enumerate(moc):
        for a in ax:
            a.axvline(pd.Timestamp(ng), color=mau, linestyle="--", linewidth=1.3)
        ax[0].annotate(nhan, xy=(pd.Timestamp(ng), ax[0].get_ylim()[1] * (.94 - i * .13)),
                       xytext=(6, 0), textcoords="offset points",
                       fontsize=8.5, color=mau, weight="bold")
    _luu(fig, "eda-do-phu-du-lieu.png")
    return theo_thang


def doanh_thu_theo_lich(goc):
    """Mô tả doanh thu toàn cửa hàng theo lịch, không so sánh nhóm T/C.

    Chỉ lọc hóa đơn bán ra chưa bị xóa, đúng theo yêu cầu của khảo sát mô tả.
    Các hàng được gộp theo thứ trong tuần và nhóm ngày trong tháng vào cùng một
    CSV; cột `truc` cho biết mỗi hàng thuộc bảng nào.
    """
    print("  [2] Doanh thu theo thứ trong tuần và ngày trong tháng")
    g = goc[
        (goc["daxoa"] == "0") & (goc["ma_ncc_hddt"] == "THUE_BANRA")
    ].copy()
    cf.khang_dinh(g["soid"].is_unique,
                  "goc.soid không duy nhất — số hóa đơn theo lịch sẽ bị đếm sai")
    g["ngay"] = pd.to_datetime(g["ngayct"], errors="raise")
    g["doanh_thu"] = pd.to_numeric(g["sotien_sauvat"], errors="raise")
    cf.khang_dinh(g["doanh_thu"].notna().all(),
                  "sotien_sauvat bị thiếu sau khi lọc hóa đơn bán ra")

    nhan_thu = {
        0: "Thứ Hai",
        1: "Thứ Ba",
        2: "Thứ Tư",
        3: "Thứ Năm",
        4: "Thứ Sáu",
        5: "Thứ Bảy",
        6: "Chủ nhật",
    }
    g["ma_nhom"] = g["ngay"].dt.dayofweek
    theo_thu = g.groupby("ma_nhom", sort=True).agg(
        so_hoa_don=("soid", "nunique"),
        tong_doanh_thu=("doanh_thu", "sum"),
    ).reset_index()
    theo_thu.insert(0, "truc", "thứ trong tuần")
    theo_thu["nhan"] = theo_thu["ma_nhom"].map(nhan_thu)

    nhom_ngay = ["1-5", "6-10", "11-15", "16-20", "21-25", "26-31"]
    g["ma_nhom_ngay"] = pd.cut(
        g["ngay"].dt.day,
        bins=[0, 5, 10, 15, 20, 25, 31],
        labels=nhom_ngay,
    )
    theo_ngay = g.groupby("ma_nhom_ngay", observed=True, sort=True).agg(
        so_hoa_don=("soid", "nunique"),
        tong_doanh_thu=("doanh_thu", "sum"),
    ).reset_index().rename(columns={"ma_nhom_ngay": "ma_nhom"})
    theo_ngay.insert(0, "truc", "ngày trong tháng")
    theo_ngay["nhan"] = "Ngày " + theo_ngay["ma_nhom"].astype(str)

    ket_qua = pd.concat([theo_thu, theo_ngay], ignore_index=True)
    ket_qua["trung_binh_moi_hoa_don"] = (
        ket_qua["tong_doanh_thu"] / ket_qua["so_hoa_don"]
    ).round().astype("int64")
    ket_qua["tong_doanh_thu"] = ket_qua["tong_doanh_thu"].round().astype("int64")
    ket_qua = ket_qua[
        ["truc", "ma_nhom", "nhan", "so_hoa_don",
         "tong_doanh_thu", "trung_binh_moi_hoa_don"]
    ]
    _ghi(ket_qua, "eda-doanh-thu-theo-lich.csv",
         f"{len(g):,} hóa đơn bán ra chưa bị xóa")

    for truc, bang in [("thứ", theo_thu), ("nhóm ngày", theo_ngay)]:
        tb = bang["tong_doanh_thu"] / bang["so_hoa_don"]
        cao, thap = bang.loc[tb.idxmax()], bang.loc[tb.idxmin()]
        print(f"      {truc}: cao nhất {cao['nhan']}, thấp nhất {thap['nhan']}")
    return ket_qua


def ma_tran_chuyen_thue(dong):
    print("  [3] Ma trận chuyển thuế tiền kỳ → hậu kỳ")
    mode_h = lambda x: (x.mode().iloc[0] if len(x.mode()) == 1 else -1)
    vat = dong.groupby(["sku", "post"])["tyle_vat_ct"].agg(mode_h).unstack()
    vat.columns = ["vat_tien", "vat_hau"]
    nhan = lambda v: "hòa 8/10" if v == -1 else f"{int(v)}%"
    mt = (vat.assign(tien=vat["vat_tien"].map(nhan), hau=vat["vat_hau"].map(nhan))
          .groupby(["tien", "hau"]).size().rename("so_sku").reset_index())
    _ghi(mt, "eda-ma-tran-chuyen-thue.csv", f"{len(mt)} đường chuyển thuế")
    print("      " + " | ".join(f"{r.tien}→{r.hau}: {r.so_sku}"
                                for r in mt.itertuples() if r.so_sku >= 9))
    return mt


def can_bang_tien_ky(mau):
    """Bảng cân bằng — CHỈ biến tiền can thiệp. Xem quy tắc chống rò rỉ ở đầu file."""
    print("  [4] Cân bằng tiền can thiệp (chỉ biến tiền kỳ)")
    mau = mau.copy()
    mau["log_pre_p"] = np.log(mau["pre_p"])
    mau["log1p_pre_q"] = np.log1p(mau["pre_q"])
    bien = ["log_pre_p", "log1p_pre_q", "pre_w"]

    dc = {"DC-A": (mau["grp"] == "C10") & (mau["loai_sp"] == "ruou_bia_thuoc"),
          "DC-B": (mau["grp"] == "C10") & (mau["loai_sp"] != "hoa_chat"),
          "DC-C": (mau["grp"] == "C10"),
          "DC-8%": (mau["grp"] == "C8")}
    T = mau[mau["grp"] == "T"]
    hang = []
    for ten, mask in dc.items():
        C = mau[mask]
        for b in bien:
            a, c = T[b], C[b]
            smd = (a.mean() - c.mean()) / np.sqrt((a.var() + c.var()) / 2)
            hang.append({"doi_chung": ten, "n_C": len(C), "bien": b,
                         "T_trung_vi": round(a.median(), 3),
                         "C_trung_vi": round(c.median(), 3),
                         "T_IQR": round(a.quantile(.75) - a.quantile(.25), 3),
                         "C_IQR": round(c.quantile(.75) - c.quantile(.25), 3),
                         "SMD": round(smd, 3)})
    cb = pd.DataFrame(hang)
    _ghi(cb, "eda-can-bang-tien-ky.csv", "trung vị, IQR, SMD")
    xau = cb[cb["SMD"].abs() > 0.25]
    print(f"      {len(xau)}/{len(cb)} cặp có |SMD| > 0,25 (mất cân bằng đáng kể)")
    for r in xau.itertuples():
        print(f"        {r.doi_chung} × {r.bien}: SMD={r.SMD:+.3f}")

    cc = (mau.groupby(["grp", "loai_sp"]).size().rename("so_sku")
          .reset_index().pivot(index="loai_sp", columns="grp", values="so_sku")
          .fillna(0).astype(int).reset_index())
    _ghi(cc, "eda-co-cau-loai-san-pham.csv", "định danh sản phẩm × nhóm")

    fig, ax = plt.subplots(1, 3, figsize=(13, 3.8))
    for i, (b, nhan) in enumerate(zip(bien, ["log(giá nền)", "log(1+sản lượng tiền kỳ)",
                                             "số tuần xuất hiện tiền kỳ"])):
        for ten, mask, mau_ve in [("T", mau["grp"] == "T", "#c0392b"),
                                  ("ĐC-A", dc["DC-A"], "#1e8449"),
                                  ("ĐC-C", dc["DC-C"], "#3b6ea5")]:
            v = np.sort(mau.loc[mask, b].values)
            ax[i].plot(v, np.linspace(0, 1, len(v)), label=ten, color=mau_ve, linewidth=1.6)
        ax[i].set_xlabel(nhan); ax[i].set_ylabel("ECDF" if i == 0 else "")
        if i == 0:
            ax[i].legend(fontsize=8.5, title="Nhóm", title_fontsize=8.5)
    fig.suptitle("Chồng lấn TIỀN can thiệp — không dùng biến kết quả", fontsize=10.5)
    _luu(fig, "eda-chong-lan-tien-ky.png")
    return cb


def ho_tro_phan_tang(mau):
    """Bảng hỗ trợ 5 tầng cho từng định nghĩa đối chứng — §9."""
    print("  [5] Hỗ trợ phân tầng PP2 (5 phân vị giá nền)")
    dc = {"DC-A": (mau["grp"] == "C10") & (mau["loai_sp"] == "ruou_bia_thuoc"),
          "DC-B": (mau["grp"] == "C10") & (mau["loai_sp"] != "hoa_chat"),
          "DC-C": (mau["grp"] == "C10"),
          "DC-8%": (mau["grp"] == "C8")}
    hang = []
    for ten, mask in dc.items():
        s = mau[(mau["grp"] == "T") | mask].copy()
        s["tang"] = pd.qcut(s["pre_p"], cf.SO_PHAN_VI_GIA, labels=False, duplicates="drop")
        for tg, g in s.groupby("tang"):
            nT, nC = int((g["grp"] == "T").sum()), int((g["grp"] != "T").sum())
            hang.append({"doi_chung": ten, "tang": int(tg),
                         "gia_nen_min": round(g["pre_p"].min()),
                         "gia_nen_max": round(g["pre_p"].max()),
                         "n_T": nT, "n_C": nC,
                         "mong": nT < cf.TOI_THIEU_SKU_MOI_TANG or nC < cf.TOI_THIEU_SKU_MOI_TANG})
    ht = pd.DataFrame(hang)
    _ghi(ht, "eda-ho-tro-phan-tang.csv", f"{len(ht)} tầng, mỏng: {int(ht['mong'].sum())}")
    cf.khang_dinh(not ht["mong"].any(),
                  "có tầng mỏng — §9 nói quy tắc gộp không kích hoạt, phải kiểm tra lại")
    return ht


def luoi_survivorship(mau):
    """Không chỉ đếm SKU: so sánh SKU giữ vs bị loại trên biến tiền kỳ."""
    print("  [6] Lưới survivorship + so sánh SKU giữ/bị loại")
    hang = []
    for k in cf.LUOI_NGUONG_TUAN:
        giu = mau["pre_w"] >= k
        for nhom in ["T", "C10", "C8"]:
            m = mau["grp"] == nhom
            g, b = mau[m & giu], mau[m & ~giu]
            hang.append({
                "nguong_tuan": k, "nhom": nhom, "so_giu": len(g), "so_loai": len(b),
                "gia_nen_giu": round(g["pre_p"].median()) if len(g) else None,
                "gia_nen_loai": round(b["pre_p"].median()) if len(b) else None,
                "sl_giu": round(g["pre_q"].median(), 1) if len(g) else None,
                "sl_loai": round(b["pre_q"].median(), 1) if len(b) else None,
            })
    lu = pd.DataFrame(hang)
    _ghi(lu, "eda-luoi-survivorship.csv", "kèm so sánh giữ/loại")
    t = lu[(lu["nhom"] == "T")]
    print("      nhóm T: " + "  ".join(f"≥{r.nguong_tuan}t={r.so_giu}" for r in t.itertuples()))
    return lu


def chay():
    print("Đọc đầu ra chuẩn ...")
    goc = pd.read_csv(cf.CSV_GOC, low_memory=False, dtype=str)
    goc["dg"] = pd.to_datetime(goc["ngayct"])
    chitiet = pd.read_csv(cf.CSV_CHITIET, low_memory=False,
                          dtype={"soid": str, "ma_hh_ct": str})
    dong = pd.read_csv(cf.CSV_DONG_PHAN_TICH, low_memory=False, dtype={"sku": str})
    dong["dg"] = pd.to_datetime(dong["dg"])
    dong["post"] = dong["dg"] >= pd.Timestamp(cf.NGAY_CHINH_SACH)
    mau = pd.read_csv(cf.CSV_MAU_PHAN_TICH, dtype={"sku": str})

    do_phu_du_lieu(goc, chitiet)
    doanh_thu_theo_lich(goc)
    ma_tran_chuyen_thue(dong)
    can_bang_tien_ky(mau)
    ho_tro_phan_tang(mau)
    luoi_survivorship(mau)
    print("  Chương 3 xong. Không bảng/hình nào dùng biến kết quả.")
    return True


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
