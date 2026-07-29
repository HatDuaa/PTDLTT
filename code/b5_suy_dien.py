"""Bước 5 — Suy diễn & phân tích phụ.

Trả lời: dữ liệu này có ĐỦ SỨC phát hiện tác động không, và cơ chế nào giải
thích kết quả. Thi hành kế hoạch phase-04.

🔴 Toàn bộ nhánh sản lượng và cơ chế là KHÁM PHÁ (đặc tả §13 bậc 4).
🔴 CẤM sức mạnh hậu kiểm — nó chỉ là phép biến đổi đơn điệu của p-value.
"""
import math
import sys
import numpy as np
import pandas as pd
from scipy import stats
import config_du_an as cf
import b4_uoc_luong as b4

CSV_MDE = cf.THU_MUC_KET_QUA / "kq-mde-va-suc-manh.csv"
CSV_LAM_TRON = cf.THU_MUC_KET_QUA / "kq-mo-phong-lam-tron.csv"
CSV_SAN_LUONG = cf.THU_MUC_KET_QUA / "kq-san-luong.csv"
CSV_BAM_CHUAN = cf.THU_MUC_KET_QUA / "kq-bam-chuan-co-hoc.csv"
CSV_BAM_CHUAN_CT = cf.THU_MUC_KET_QUA / "kq-bam-chuan-co-hoc-chi-tiet.csv"

Z_A = stats.norm.ppf(0.975)      # 1,960
Z_B = stats.norm.ppf(0.80)       # 0,842


# ───────────────────────── MDE & sức mạnh ─────────────────────────

def mde_giai_tich(se):
    return (Z_A + Z_B) * se


def bien_tost_du_suc_manh(se, suc_manh=0.80):
    """Biên tương đương nhỏ nhất để TOST đạt `suc_manh` khi tác động thật = 0.

    Với tác động thật đúng bằng 0, sức mạnh TOST = 2·Φ(δ/SE − z₀,₉₅) − 1.
    Đặt bằng `suc_manh` ⇒ Φ(·) = (1 + suc_manh)/2, KHÔNG phải `suc_manh`.

    🔴 Bản trước dùng z(suc_manh) — cho ra biên chỉ đạt 60% sức mạnh, không
    phải 80%. Đã kiểm chứng bằng mô phỏng 400.000 lần: biên 2,487·SE cho
    0,601; biên 2,926·SE cho 0,800.
    """
    return (stats.norm.ppf(0.95) + stats.norm.ppf((1 + suc_manh) / 2)) * se


def suc_manh_tost(se, bien):
    """Sức mạnh của TOST tại tác động thật = 0."""
    return max(0.0, 2 * stats.norm.cdf(bien / se - stats.norm.ppf(0.95)) - 1)


def duong_cong_suc_manh(d, can_thiep, luoi, so_lan=2000):
    """Mô phỏng: TÁI ĐỊNH TÂM về H₀ rồi cộng hiệu ứng giả định.

    Cộng thẳng δ vào dữ liệu hiện tại sẽ cho hiệu ứng thật = ATT quan sát + δ,
    không phải δ (phase-04 §1).
    """
    quan_sat = b4.pp1_cach_a(d, can_thiep)["hiep_bien"]["uoc_luong"]
    nen = d.copy()
    nen.loc[nen[can_thiep] == 1, "y"] -= quan_sat        # tái định tâm về H₀
    rng = np.random.default_rng(cf.SEED)
    ra = []
    for delta in luoi:
        bac_bo = 0
        for _ in range(so_lan):
            s = nen.iloc[rng.integers(0, len(nen), len(nen))].copy()
            s.loc[s[can_thiep] == 1, "y"] += delta
            if s[can_thiep].nunique() < 2:
                continue
            r = b4.pp1_cach_a(s, can_thiep)["hiep_bien"]
            bac_bo += int(r["p"] < cf.ALPHA)
        ra.append({"delta": delta, "suc_manh": bac_bo / so_lan})
        print(f"      δ={delta:+.2f}  sức mạnh={bac_bo/so_lan:.3f}")
    return pd.DataFrame(ra)


# ───────────────────────── mô phỏng làm tròn ─────────────────────────

def mo_phong_lam_tron(gia_tien_ky, luoi=(1000, 500, 100)):
    """Chuẩn CƠ HỌC, không phải phản thực Y(0).

    Câu hỏi duy nhất: nếu chuyển hoàn toàn phần giảm thuế VÀ làm tròn theo
    quy tắc R, giá niêm yết có đổi mức không?
    """
    ti_le = 1.08 / 1.10
    ra = []
    for buoc in luoi:
        # làm tròn về mức gần nhất; điểm hòa làm tròn LÊN
        cu = np.floor(gia_tien_ky / buoc + 0.5) * buoc
        moi = np.floor(gia_tien_ky * ti_le / buoc + 0.5) * buoc
        doi = cu != moi
        ra.append({"buoc_lam_tron": buoc, "so_sku": len(gia_tien_ky),
                   "so_doi_muc": int(doi.sum()), "ti_le_doi_muc": float(doi.mean())})
        print(f"      lưới {buoc:>5,}đ: {int(doi.sum()):>3}/{len(gia_tien_ky)} SKU"
              f" ({doi.mean()*100:>5.1f}%) sẽ đổi mức giá")
    return pd.DataFrame(ra)


# ──────────────────── giá thực tế có bám chuẩn không ────────────────────

def _lam_tron(x, buoc=1000):
    """Làm tròn về mức gần nhất; điểm hòa làm tròn LÊN."""
    return np.floor(x / buoc + 0.5) * buoc


def _ktc_wilson(k, n, z=1.96):
    """Khoảng Wilson — vẫn dùng được khi tử số bằng 0 hoặc 1.

    Wald (p ± z·√(p(1−p)/n)) sụp về [0;0] khi k=0 và cho cận dưới âm khi k=1,
    tức là bảo cả hai đầu đều chắc chắn trong khi n chỉ hơn trăm.
    """
    if n == 0:
        return float("nan"), float("nan")
    p = k / n
    d = 1 + z * z / n
    tam = (p + z * z / (2 * n)) / d
    nua = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return max(0.0, tam - nua), min(1.0, tam + nua)


def bam_chuan_co_hoc(mau, buoc=1000, nguong_dong=1.0):
    """Giá hậu kỳ có rơi đúng mức mà chuyển hoàn toàn đòi hỏi không?

    `mo_phong_lam_tron` ở trên mới trả lời "bao nhiêu SKU LẼ RA phải đổi mức
    giá" — một câu hỏi thuần giả định, không hề đụng tới giá hậu kỳ thật. Hàm
    này làm nốt vế còn lại: đối chiếu giá thật với mức đó.

    Nhóm Z=0 chạy cùng phép tính làm GIẢ DƯỢC. Chúng không được giảm thuế nên
    mức chuẩn với chúng vô nghĩa về mặt pháp lý — đó chính là điều làm nó thành
    giả dược tốt: tỉ lệ bám chuẩn ở đây là mức trùng hợp ngẫu nhiên nền.

    Chỉ báo cáo tỉ lệ kèm khoảng Wilson, KHÔNG kiểm định giữa hai nhóm: đây là
    một cửa hàng, không có phân phối ngẫu nhiên hóa nào để dựa vào, và một
    p-value ở đây sẽ bị đọc nhầm thành kiểm định tác động chính sách.
    """
    d = mau[mau["Z"].isin([0, 1])].copy()
    d["gia_chuan"] = _lam_tron(d["pre_p"] * (1.08 / 1.10), buoc)
    d["gia_tien_lam_tron"] = _lam_tron(d["pre_p"], buoc)
    d["du_bao_doi_muc"] = d["gia_chuan"] != d["gia_tien_lam_tron"]
    d["sai_lech_voi_chuan"] = (d["pg_hau"] - d["gia_chuan"]).abs()
    d["bam_chuan"] = d["sai_lech_voi_chuan"] < nguong_dong

    tong = []
    for z, vai in [(1, "nhóm được giảm thuế"), (0, "giả dược")]:
        s = d[d.Z == z]
        c = s[s.du_bao_doi_muc]
        k, n = int(c.bam_chuan.sum()), len(c)
        duoi, tren = _ktc_wilson(k, n)
        tong.append({"vai_tro": vai, "Z": z, "n_sku_toan_nhom": len(s),
                     "n_du_bao_doi_muc": n, "n_bam_chuan": k,
                     "ti_le_bam_chuan": k / n if n else float("nan"),
                     "ktc95_wilson_duoi": duoi, "ktc95_wilson_tren": tren,
                     "n_giu_nguyen_gia": int((c["pg_hau"] - c["pre_p"]).abs().lt(nguong_dong).sum()),
                     "buoc_lam_tron": buoc, "nguong_bam_chuan_dong": nguong_dong})
        print(f"      {vai:<22} {k:>3}/{n:<4} bám chuẩn ({k/n*100 if n else 0:>4.1f}%)"
              f"  KTC95 [{duoi*100:.1f}%; {tren*100:.1f}%]"
              f"  · giữ nguyên giá {tong[-1]['n_giu_nguyen_gia']}/{n}")

    cot = ["sku", "ten_hang", "Z", "pre_p", "pg_hau", "gia_tien_lam_tron",
           "gia_chuan", "du_bao_doi_muc", "sai_lech_voi_chuan", "bam_chuan"]
    return pd.DataFrame(tong), d[[c for c in cot if c in d.columns]]


# ───────────────────────── nhánh sản lượng ─────────────────────────

def dung_san_luong(dong, mau):
    """Sản lượng chuẩn hóa theo PHƠI NHIỄM — số ngày cửa hàng có giao dịch.

    Tổng thô sai vì hai kỳ có số ngày hoạt động khác nhau (phase-04 §2).
    """
    d = dong.copy()
    d["post"] = d["dg"] >= pd.Timestamp(cf.NGAY_CHINH_SACH)
    E = d.groupby("post")["dg"].apply(lambda s: s.dt.date.nunique())
    print(f"      ngày cửa hàng có giao dịch: tiền kỳ E={E[False]}  hậu kỳ E={E[True]}")
    Q = d.pivot_table(index="sku", columns="post", values="soluong_ct",
                      aggfunc="sum").dropna()
    Q.columns = ["q_tien", "q_hau"]
    s = mau.merge(Q.reset_index(), on="sku")
    s["y"] = 100 * np.log((s["q_hau"] / E[True]) / (s["q_tien"] / E[False]))
    return s[np.isfinite(s["y"])], E


def bien_do_mo_rong(dong_sach, mau):
    """Biên độ mở rộng: SKU tiền kỳ có còn xuất hiện ở hậu kỳ không?

    🔴 Z phải xác định HOÀN TOÀN từ thông tin trước 01/07 — chính SKU biến mất
    là SKU không có thuế suất hậu kỳ, gán Z từ đó là vòng lặp logic.
    """
    d = dong_sach.copy()
    d["post"] = d["dg"] >= pd.Timestamp(cf.NGAY_CHINH_SACH)
    TIEN = d[~d["post"]]
    if TIEN.empty:
        return None
    # Z chỉ từ tiền kỳ: thuế suất tiền kỳ + định danh sản phẩm
    vat_tien = TIEN.groupby("sku")["tyle_vat_ct"].agg(
        lambda s: s.mode().iloc[0] if len(s.mode()) == 1 else np.nan).dropna()
    ten = TIEN.sort_values("dg").groupby("sku")["ten_hh_ct"].first()
    coh = pd.DataFrame({"vat_tien": vat_tien}).join(ten.rename("ten_hang"))
    coh["loai_sp"] = coh["ten_hang"].map(cf.phan_loai_san_pham)
    coh["Z"] = np.where((coh.vat_tien == 10) & (coh.loai_sp == "hoa_chat"), 1,
                np.where((coh.vat_tien == 10) & (coh.loai_sp == "ruou_bia_thuoc"), 0, -1))
    coh = coh[coh["Z"] >= 0].copy()
    con_ban = set(d[d["post"]]["sku"])
    coh["con_o_hau_ky"] = coh.index.isin(con_ban).astype(int)
    return coh


def chay():
    m = b4.them_hiep_bien(pd.read_csv(cf.CSV_MAU_PHAN_TICH, dtype={"sku": str}))
    itt = m[m["Z"] >= 0].copy()
    kq = pd.read_csv(cf.THU_MUC_KET_QUA / "kq-uoc-luong-chinh.csv")
    chinh = kq[kq["vai_tro"] == "chính"]

    print("=" * 78)
    print("1. MDE — bốn đặc tả, bốn con số (KHÔNG có MDE chung)")
    print("=" * 78)
    hang = []
    for r in chinh.itertuples():
        se = r.se
        hang.append({"dac_ta": r.pp, "se": se, "mde": mde_giai_tich(se),
                     "suc_manh_tai_moc_chuyen_hoan_toan": float(
                         stats.norm.cdf(abs(cf.TAU_CHUYEN_HOAN_TOAN) / se - Z_A)),
                     "bien_tost_du_80": bien_tost_du_suc_manh(se),
                     "suc_manh_tost_bien_dang_dung": suc_manh_tost(
                         se, cf.BIEN_TOST["rong"] * abs(cf.TAU_CHUYEN_HOAN_TOAN))})
        h = hang[-1]
        print(f"    {r.pp:<28} SE={se:.3f}  MDE={h['mde']:.2f}"
              f"  sức mạnh tại {abs(cf.TAU_CHUYEN_HOAN_TOAN):.3f}"
              f" = {h['suc_manh_tai_moc_chuyen_hoan_toan']*100:.0f}%")
    bang_mde = pd.DataFrame(hang)
    print(f"\n    ⇒ Khoảng MDE: {bang_mde.mde.min():.2f} – {bang_mde.mde.max():.2f}."
          f"  Nếu buộc một số, dùng {bang_mde.mde.max():.2f} (bảo thủ nhất).")

    print("\n" + "=" * 78)
    print("2. SỨC MẠNH CỦA TOST — biên đã chọn có khả thi không?")
    print("=" * 78)
    bien_dung = cf.BIEN_TOST["rong"] * abs(cf.TAU_CHUYEN_HOAN_TOAN)
    print(f"    Biên đang dùng: ±{bien_dung:.3f}")
    for r in bang_mde.itertuples():
        sm = suc_manh_tost(r.se, bien_dung)
        kha_thi = bien_dung >= r.bien_tost_du_80
        print(f"    {r.dac_ta:<28} biên cần cho 80% = ±{r.bien_tost_du_80:.3f}"
              f"  |  sức mạnh ở biên đang dùng = {sm*100:.1f}%"
              f"  → {'khả thi' if kha_thi else '🔴 BIÊN QUÁ HẸP'}")
    print(f"\n    🔴 Biên ±{bien_dung:.3f} nhỏ hơn mức cần ở MỌI đặc tả.")
    print("    ⇒ 'TOST thất bại' KHÔNG phải bằng chứng chống tương đương —")
    print("      nó phản ánh thiết kế không đủ chính xác cho biên đã chọn.")

    print("\n" + "=" * 78)
    print("3. ĐƯỜNG CONG SỨC MẠNH (mô phỏng, tái định tâm về H₀)")
    print("=" * 78)
    luoi = [0.0, -0.5, -1.0, -1.835, -2.5, -3.0]
    dc = duong_cong_suc_manh(itt, "Z", luoi, so_lan=2000)
    mde_mp = np.interp(0.80, dc.suc_manh, -dc.delta)
    print(f"\n    MDE từ mô phỏng ≈ {mde_mp:.2f}"
          f"  |  MDE giải tích (đặc tả hiệp biến) = "
          # Lọc theo hằng số, không theo chuỗi cứng: `dac_ta` chính là nhãn
          # hiển thị của b4, nên gõ lại "hiep_bien" ở đây sẽ âm thầm rỗng ngay
          # lần đổi nhãn kế tiếp — đã hỏng đúng như vậy một lần.
          f"{bang_mde[bang_mde.dac_ta == b4.TEN_HIEN_THI_PP1A['hiep_bien']].mde.iloc[0]:.2f}")

    print("\n" + "=" * 78)
    print("4. MÔ PHỎNG LÀM TRÒN — chuẩn CƠ HỌC, không phải phản thực")
    print("=" * 78)
    bang_lt = mo_phong_lam_tron(itt[itt.Z == 1]["pre_p"].to_numpy())

    print("\n    Giá THẬT có rơi đúng mức đó không (giả dược = nhóm không được giảm):")
    bang_bc, ct_bc = bam_chuan_co_hoc(m)
    _z1 = bang_bc[bang_bc.Z == 1].iloc[0]
    _z0 = bang_bc[bang_bc.Z == 0].iloc[0]
    cf.khang_dinh(int(_z1.n_du_bao_doi_muc) == 135 and int(_z1.n_bam_chuan) == 1,
                  f"bám chuẩn Z=1 lệch: {int(_z1.n_du_bao_doi_muc)}/{int(_z1.n_bam_chuan)}"
                  " — kỳ vọng 135 dự báo đổi mức, 1 bám chuẩn")
    cf.khang_dinh(int(_z0.n_du_bao_doi_muc) == 92 and int(_z0.n_bam_chuan) == 1,
                  f"giả dược Z=0 lệch: {int(_z0.n_du_bao_doi_muc)}/{int(_z0.n_bam_chuan)}"
                  " — kỳ vọng 92 dự báo đổi mức, 1 bám chuẩn")

    print("\n" + "=" * 78)
    print("5. NHÁNH SẢN LƯỢNG — khám phá, chuẩn hóa theo phơi nhiễm")
    print("=" * 78)
    dong = pd.read_csv(cf.CSV_DONG_PHAN_TICH, low_memory=False, dtype={"sku": str})
    dong["dg"] = pd.to_datetime(dong["dg"])
    sl, E = dung_san_luong(dong, itt)
    r_sl = b4.pp1_cach_a(sl, "Z")["hiep_bien"]
    mde_sl = mde_giai_tich(r_sl["se"])
    print(f"      ITT sản lượng = {r_sl['uoc_luong']:+.3f} điểm log ×100"
          f"  se={r_sl['se']:.3f}  p={r_sl['p']:.3f}"
          f"  KTC=[{r_sl['ktc_duoi']:+.2f},{r_sl['ktc_tren']:+.2f}]")
    print(f"      🔴 MDE = {mde_sl:.2f} điểm log ×100 — phải ghi kèm MỌI lần nhắc")
    bang_sl = pd.DataFrame([{"nhanh": "biên độ tăng cường", "n": len(sl),
                             **{k: v for k, v in r_sl.items()}, "mde": mde_sl}])

    print("\n    Biên độ mở rộng (cohort tiền kỳ, Z chỉ từ thông tin trước 01/07):")
    dong_sach = pd.read_csv(cf.CSV_DONG_SACH, low_memory=False, dtype={"sku": str})
    dong_sach["dg"] = pd.to_datetime(dong_sach["dg"])
    dong_sach = dong_sach[dong_sach["dg"] >= pd.Timestamp(cf.CUA_SO_CHINH_BAT_DAU)]
    coh = bien_do_mo_rong(dong_sach, itt)
    if coh is not None:
        tl = coh.groupby("Z")["con_o_hau_ky"].agg(["mean", "size"])
        print(f"      Z=1: {tl.loc[1,'mean']*100:.1f}% còn bán ở hậu kỳ (n={int(tl.loc[1,'size'])})")
        print(f"      Z=0: {tl.loc[0,'mean']*100:.1f}% còn bán ở hậu kỳ (n={int(tl.loc[0,'size'])})")
        d_ext = tl.loc[1, "mean"] - tl.loc[0, "mean"]
        se_ext = np.sqrt(sum(tl.loc[z, "mean"] * (1 - tl.loc[z, "mean"]) / tl.loc[z, "size"]
                             for z in (0, 1)))
        print(f"      chênh lệch = {d_ext*100:+.1f} điểm %  se={se_ext*100:.1f}"
              f"  KTC=[{(d_ext-1.96*se_ext)*100:+.1f},{(d_ext+1.96*se_ext)*100:+.1f}]")
        bang_sl = pd.concat([bang_sl, pd.DataFrame([{
            "nhanh": "biên độ mở rộng", "n": int(tl["size"].sum()),
            "uoc_luong": d_ext * 100, "se": se_ext * 100,
            "ktc_duoi": (d_ext - 1.96 * se_ext) * 100,
            "ktc_tren": (d_ext + 1.96 * se_ext) * 100,
            "p": float(2 * (1 - stats.norm.cdf(abs(d_ext) / se_ext))),
            "mde": mde_giai_tich(se_ext * 100)}])], ignore_index=True)

    pd.concat([bang_mde, dc.assign(dac_ta="đường cong mô phỏng")]).to_csv(
        CSV_MDE, index=False, encoding="utf-8")
    bang_lt.to_csv(CSV_LAM_TRON, index=False, encoding="utf-8")
    bang_bc.to_csv(CSV_BAM_CHUAN, index=False, encoding="utf-8")
    ct_bc.to_csv(CSV_BAM_CHUAN_CT, index=False, encoding="utf-8")
    bang_sl.drop(columns=["boot"], errors="ignore").to_csv(
        CSV_SAN_LUONG, index=False, encoding="utf-8")
    for p in (CSV_MDE, CSV_LAM_TRON, CSV_BAM_CHUAN, CSV_BAM_CHUAN_CT, CSV_SAN_LUONG):
        print(f"\n→ {p.relative_to(cf.GOC_REPO)}")
    return True


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
