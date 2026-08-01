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
# Slide và web đọc hình từ đây. Next.js chỉ phục vụ file tĩnh nằm trong `public/`,
# mà `ket-qua/` thì nằm ngoài cây frontend — nên hình phải có mặt ở cả hai chỗ.
# Chép ngay lúc vẽ thay vì thêm một bước thủ công: bước thủ công sẽ bị quên, và
# hình cũ trên slide trông y hệt hình mới nên không ai phát hiện ra.
THU_MUC_HINH_WEB = cf.GOC_REPO / "web" / "frontend" / "public" / "hinh"
CAM = ["y", "yn", "pg_hau", "pn_hau"]      # cột cấm dùng trong chương này


def _luu(fig, ten):
    THU_MUC_HINH.mkdir(exist_ok=True)
    fig.tight_layout()
    fig.savefig(THU_MUC_HINH / ten, dpi=140)
    THU_MUC_HINH_WEB.mkdir(parents=True, exist_ok=True)
    fig.savefig(THU_MUC_HINH_WEB / ten, dpi=140)
    plt.close(fig)
    print(f"     → hinh/{ten}")


def do_thi_nhan_qua():
    """Vẽ đồ thị nhân quả (DAG) của đồ án ra hình.

    Vì sao cần: bản duy nhất trước đây là khối `mermaid` trong markdown — GitHub
    render được, nhưng slide, PDF và web thì không. Đề bài yêu cầu trình bày chi
    tiết lý thuyết, nên đồ thị phải là hình thật, xuất được kèm báo cáo.

    Toạ độ đặt tay: DAG này có một biến gây nhiễu (đặc tính SKU) toả cạnh đi
    khắp nơi, nên thuật toán tự động xếp sẽ cho ra đống chỉ rối. Đặt tay để ba
    cạnh dài của nó vòng ra ngoài, không cắt qua trục chính.

    Không phụ thuộc dữ liệu — đây là sơ đồ thiết kế, không phải kết quả.
    """
    # (x, y, nhãn, loại): loại quyết định màu và nét viền
    #   'luat'      — do luật định, ngoại sinh
    #   'an'        — KHÔNG quan sát được (nét đứt, đây là chỗ thiết kế yếu)
    #   'nguy'      — quan sát được nhưng là biến hậu can thiệp / vận hành
    #   'thuong'    — biến quan sát được, dùng bình thường
    nut = {
        "NQ":  (1.4, 9.4, "Nghị quyết\n204/2025/QH15", "luat"),
        "DT":  (6.9, 9.4, "Đặc tính SKU / cầu nền\n(loại hàng, độ bán chạy)", "an"),
        "Z":   (1.4, 7.7, "Z\nđủ điều kiện theo luật", "luat"),
        "PRE": (9.4, 7.7, "pre_p, pre_q, pre_w\nchỉ báo quan sát được", "thuong"),
        "CN":  (1.4, 6.0, "Cửa hàng có\ncập nhật thuế suất?", "nguy"),
        "D":   (1.4, 4.3, "D\nthuế suất thực áp", "nguy"),
        "G":   (0.5, 2.6, "G\nnhóm quan sát", "nguy"),
        "MC":  (3.3, 2.6, "Chi phí thực đơn\nlàm tròn giá", "thuong"),
        "CP":  (7.6, 4.3, "Chi phí đầu vào", "an"),
        "DD":  (9.6, 4.3, "Thay đổi\nđịa điểm 06/2025", "thuong"),
        "Y":   (5.0, 1.5, "Y\ngiá gồm thuế", "thuong"),
        "S":   (5.0, 0.2, "S\nquan sát ở cả hai kỳ", "nguy"),
    }
    # Cạnh của biến gây nhiễu vẽ riêng để không lẫn vào trục chính
    canh_chinh = [("NQ", "Z"), ("Z", "CN"), ("CN", "D"), ("D", "G"), ("D", "MC"),
                  ("MC", "Y"), ("CP", "Y"), ("DD", "Y"), ("Y", "S"), ("DT", "PRE")]
    # Độ cong riêng cho từng cạnh nhiễu. Dùng chung một `rad` thì DT→Y và DT→S
    # chạy sát khít nhau, hai mũi tên đổ về cùng một chỗ và không đọc được cạnh
    # nào đi đâu.
    canh_nhieu = [("DT", "Z", 0.24), ("DT", "CN", 0.40),
                  ("DT", "Y", 0.30), ("DT", "S", -0.34)]

    mau = {"luat":   ("#e8f0fb", "#1f4e79"),
           "an":     ("#fbeaea", "#a33333"),
           "nguy":   ("#fdf3e0", "#b5651d"),
           "thuong": ("#f2f2f2", "#555555")}

    fig, ax = plt.subplots(figsize=(12.5, 8.2))
    ax.set_xlim(-0.6, 11.6)
    ax.set_ylim(-0.7, 10.4)
    ax.axis("off")

    def ve_canh(a, b, rad=0.0, nhieu=False):
        x1, y1 = nut[a][0], nut[a][1]
        x2, y2 = nut[b][0], nut[b][1]
        ax.annotate(
            "", xy=(x2, y2), xytext=(x1, y1),
            arrowprops=dict(
                arrowstyle="-|>", mutation_scale=15,
                color="#a33333" if nhieu else "#444444",
                linestyle=(0, (5, 3)) if nhieu else "solid",
                linewidth=1.1 if nhieu else 1.4,
                connectionstyle=f"arc3,rad={rad}",
                shrinkA=26, shrinkB=26,
            ),
        )

    for a, b in canh_chinh:
        ve_canh(a, b)
    for a, b, rad in canh_nhieu:
        ve_canh(a, b, rad=rad, nhieu=True)

    for x, y, nhan, loai in nut.values():
        nen, vien = mau[loai]
        ax.text(x, y, nhan, ha="center", va="center", fontsize=8.5,
                linespacing=1.35, color="#111111", zorder=3,
                bbox=dict(boxstyle="round,pad=0.42", facecolor=nen,
                          edgecolor=vien, linewidth=1.3,
                          linestyle="--" if loai == "an" else "-"))

    from matplotlib.lines import Line2D
    from matplotlib.patches import Patch
    ax.legend(
        handles=[
            Patch(facecolor=mau["luat"][0], edgecolor=mau["luat"][1], label="Do luật định — ngoại sinh"),
            Patch(facecolor=mau["an"][0], edgecolor=mau["an"][1], linestyle="--",
                  label="KHÔNG quan sát được"),
            Patch(facecolor=mau["nguy"][0], edgecolor=mau["nguy"][1],
                  label="Biến hậu can thiệp / quyết định vận hành"),
            Line2D([0], [0], color="#a33333", linestyle=(0, (5, 3)),
                   label="Cạnh từ biến gây nhiễu không quan sát được"),
        ],
        loc="lower left", bbox_to_anchor=(0.0, 0.0), fontsize=8, frameon=False,
    )
    ax.set_title("Đồ thị nhân quả của đồ án — mũi tên đỏ là các đường cần chặn",
                 fontsize=11, pad=14)
    _luu(fig, "do-thi-nhan-qua.png")


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
    nhan = lambda v: cf.NHAN_VAT_HOA if v == -1 else f"{int(v)}%"
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


def mo_ta_nen_theo_nhom(mau):
    """Ba biến nền theo nhóm Z, ở THANG GỐC — cho slide "vì sao chưa so thẳng được".

    Vì sao không dùng lại `eda-can-bang-tien-ky.csv`: bảng đó báo trung vị và IQR
    ở thang log vì nó phục vụ SMD và biểu đồ chồng lấn. Người nghe thuyết trình
    cần "72.319đ so với 108.913đ" và "6,2 so với 33,3" — con số đọc lên hiểu ngay,
    không phải 10,985 so với 10,82.

    Nhóm theo `Z` (đủ điều kiện theo LUẬT) chứ không theo `grp` (nhóm quan sát
    được từ thuế suất cửa hàng thực áp). Hai cái KHÔNG trùng nhau: 20 SKU luật
    cho giảm nhưng cửa hàng vẫn xuất 10% nên rơi vào C10 — chúng vẫn là Z=1.
    Dùng nhầm `grp` thì bảng này lệch với mọi bảng ước lượng phía sau.

    Chỉ đụng cột tiền can thiệp, đúng quy tắc chống rò rỉ ở đầu file.
    """
    print("  [4] Mô tả biến nền theo nhóm Z (thang gốc)")
    d = mau[mau["Z"].isin([0, 1])]
    hang = [{"Z": int(z), "n": len(s),
             "pre_p_tb": round(s.pre_p.mean(), 0),
             "pre_p_trung_vi": round(s.pre_p.median(), 0),
             "pre_q_tb": round(s.pre_q.mean(), 2),
             "pre_w_tb": round(s.pre_w.mean(), 2)}
            for z, s in d.groupby("Z")]
    bang = pd.DataFrame(hang).sort_values("Z", ascending=False)
    _ghi(bang, "eda-mo-ta-nen-theo-nhom.csv", "giá/sức bán/tần suất nền theo Z")
    z1, z0 = bang[bang.Z == 1].iloc[0], bang[bang.Z == 0].iloc[0]
    print(f"      sức bán nền: Z=1 {z1.pre_q_tb:.1f} vs Z=0 {z0.pre_q_tb:.1f} "
          f"→ gấp {z0.pre_q_tb / z1.pre_q_tb:.1f} lần")
    return bang


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

    do_thi_nhan_qua()          # sơ đồ thiết kế, không phụ thuộc dữ liệu
    do_phu_du_lieu(goc, chitiet)
    doanh_thu_theo_lich(goc)
    ma_tran_chuyen_thue(dong)
    can_bang_tien_ky(mau)
    mo_ta_nen_theo_nhom(mau)
    ho_tro_phan_tang(mau)
    luoi_survivorship(mau)
    print("  Chương 3 xong. Không bảng/hình nào dùng biến kết quả.")
    return True


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
