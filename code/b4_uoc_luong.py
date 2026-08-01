"""Bước 4 — Hai phương pháp ước lượng.

Thi hành đặc tả khóa §8–§10 và kế hoạch phase-03. KHÔNG quyết định gì mới.

🔴 Cổng chẩn đoán 1 đã trượt (đặc tả §9): cả hai phương pháp là SO SÁNH CÓ
ĐIỀU CHỈNH, không phải ước lượng nhân quả sạch. Nhãn đó phải đi kèm mọi bảng.

Ước lượng chính là ITT theo Z (đủ điều kiện theo LUẬT), không phải theo D
(thuế suất cửa hàng thực áp) — xem đặc tả §5.
"""
import sys
import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
from scipy import stats
import config_du_an as cf

HIEP_BIEN = ["log_pre_p", "log1p_pre_q", "pre_w"]   # KHÓA — không thêm không bớt

TEN_HIEN_THI_PP1A = cf.TEN_HIEN_THI_PP1A   # nguồn duy nhất, xem config_du_an
CSV_KQ = cf.THU_MUC_KET_QUA / "kq-uoc-luong-chinh.csv"
CSV_TANG = cf.THU_MUC_KET_QUA / "kq-theo-tang.csv"
CSV_NHAY = cf.THU_MUC_KET_QUA / "kq-do-nhay.csv"
CSV_CONG = cf.THU_MUC_KET_QUA / "kq-cong-chan-doan.csv"
CSV_SMD_TANG = cf.THU_MUC_KET_QUA / "kq-smd-sau-phan-tang.csv"
CSV_MO_TA_Y = cf.THU_MUC_KET_QUA / "kq-mo-ta-y-theo-nhom.csv"
CSV_HE_SO = cf.THU_MUC_KET_QUA / "kq-he-so-mo-hinh.csv"
CSV_CHAN_DOAN_HB = cf.THU_MUC_KET_QUA / "kq-chan-doan-hiep-bien.csv"


def them_hiep_bien(d):
    d = d.copy()
    d["log_pre_p"] = np.log(d["pre_p"])
    d["log1p_pre_q"] = np.log1p(d["pre_q"])
    return d


# ─────────────────────────── PP1 ───────────────────────────

def pp1_cach_a(d, can_thiep, bien_kq="y"):
    """Chênh lệch tuyến tính có điều chỉnh — KHÔNG gọi là ATT (§3 phase-03)."""
    ra = {}
    for nhan, ct in [("tho", f"{bien_kq} ~ {can_thiep}"),
                     ("hiep_bien", f"{bien_kq} ~ {can_thiep} + " + " + ".join(HIEP_BIEN))]:
        r = smf.ols(ct, d).fit(cov_type="HC3")
        e, se = r.params[can_thiep], r.bse[can_thiep]
        ra[nhan] = {"uoc_luong": e, "se": se, "p": r.pvalues[can_thiep],
                    "ktc_duoi": e - 1.96 * se, "ktc_tren": e + 1.96 * se}
    return ra


def _tom_tat_boot(est, boot):
    """Tóm tắt bootstrap. p-value từ phân phối TÁI ĐỊNH TÂM dưới H₀,
    hiệu chỉnh (số cực đoan + 1)/(B + 1) để không bao giờ ra p = 0."""
    cuc_doan = int(np.sum(np.abs(boot - est) >= abs(est)))
    return {"uoc_luong": est, "se": float(boot.std(ddof=1)),
            "ktc_duoi": float(np.percentile(boot, 2.5)),
            "ktc_tren": float(np.percentile(boot, 97.5)),
            "p": (cuc_doan + 1) / (len(boot) + 1),
            "boot": boot}


def _thiet_ke(d):
    """Ma trận thiết kế [1, X] — dùng numpy để bootstrap 5.000 lần chạy được."""
    return np.column_stack([np.ones(len(d))] + [d[b].to_numpy() for b in HIEP_BIEN])


def _att_g_comp(d1, d0, bien_kq="y"):
    """ATT = trung bình{ y_i − m̂₀(X_i) } trên nhóm Z=1, với m̂₀ khớp CHỈ trên Z=0."""
    beta, *_ = np.linalg.lstsq(_thiet_ke(d0), d0[bien_kq].to_numpy(), rcond=None)
    return float((d1[bien_kq].to_numpy() - _thiet_ke(d1) @ beta).mean())


def pp1_cach_b(d, can_thiep, bien_kq="y", so_lan=None):
    """g-computation cho ATT + bootstrap SKU.

    Khớp mô hình phản thực chỉ trên nhóm đối chứng. Khớp trên TOÀN mẫu với
    dạng tuyến tính không tương tác sẽ cho ra đúng hệ số OLS — không tạo
    thêm thông tin gì (xem phase-03 §3).
    """
    so_lan = so_lan or cf.SO_LAN_BOOTSTRAP
    d1, d0 = d[d[can_thiep] == 1], d[d[can_thiep] == 0]
    est = _att_g_comp(d1, d0, bien_kq)

    rng = np.random.default_rng(cf.SEED)
    boot = np.empty(so_lan)
    for b in range(so_lan):
        b1 = d1.iloc[rng.integers(0, len(d1), len(d1))]
        b0 = d0.iloc[rng.integers(0, len(d0), len(d0))]
        boot[b] = _att_g_comp(b1, b0, bien_kq)
    return _tom_tat_boot(est, boot)


def mo_ta_y_theo_nhom(d):
    """Mô tả biến kết quả theo nhóm Z — con số THÔ trước mọi phép điều chỉnh.

    Vì sao cần thành đầu ra chuẩn thay vì để người viết slide tự tính: hai con số
    `+0,624` và `+1,022` là chỗ chống hiểu nhầm quan trọng nhất của cả đồ án —
    chúng cho thấy giá CẢ HAI nhóm đều TĂNG, nên `−0,398` là chênh lệch giữa hai
    mức tăng chứ không phải mức giảm. Gõ tay hai số đó vào slide là để chúng trôi
    tự do khỏi pipeline.

    Độ lệch chuẩn đi kèm cũng không thừa: nó giải thích vì sao mọi khoảng tin cậy
    về sau đều rộng — nhiễu gấp khoảng 15 lần thứ cần đo.

    Đặt ở b4 chứ không b3: `y` nằm trong danh sách cột CẤM của chương mô tả.
    """
    hang = []
    for z, s in d[d["Z"].isin([0, 1])].groupby("Z"):
        giu_nguyen = int(((s["pg_hau"] - s["pg_tien"]).abs() < 1).sum())
        hang.append({"Z": int(z), "n": len(s),
                     "y_tb": round(s.y.mean(), 4),
                     "y_trung_vi": round(s.y.median(), 4),
                     "y_do_lech_chuan": round(s.y.std(), 3),
                     "n_giu_nguyen_gia": giu_nguyen})
    bang = pd.DataFrame(hang).sort_values("Z", ascending=False)
    bang.to_csv(CSV_MO_TA_Y, index=False, encoding="utf-8")
    z1, z0 = bang[bang.Z == 1].iloc[0], bang[bang.Z == 0].iloc[0]
    print(f"\n  Mô tả thô: y trung bình Z=1 {z1.y_tb:+.4f} | Z=0 {z0.y_tb:+.4f}"
          f"  → cả hai nhóm đều {'TĂNG' if min(z1.y_tb, z0.y_tb) > 0 else 'lẫn hướng'}")
    print(f"    độ lệch chuẩn {z1.y_do_lech_chuan:.2f} và {z0.y_do_lech_chuan:.2f}"
          f" — nhiễu lớn hơn nhiều so với chênh lệch cần đo")
    return bang


def he_so_mo_hinh(d, can_thiep="Z", bien_kq="y"):
    """Toàn bộ hệ số của ba mô hình, kèm chênh lệch hiệp biến giữa hai nhóm.

    Vì sao phải ghi ra file thay vì chỉ in: slide và báo cáo cần cả bảng hệ số
    chứ không riêng `β₁`. Chính ba hệ số hiệp biến mới cho thấy mô hình đang trừ
    cái gì — và chính chênh lệch giữa hệ số của hai mô hình mới giải thích được
    vì sao PP1-A và PP1-B ra hai con số khác nhau.

    Cột `chenh_lech_x` cho phép tái dựng phép phân rã mà không cần đọc lại mẫu:

        dự báo phản thực = trung bình y(Z=0) + Σ hệ_số × chênh_lệch_x

    Ba mô hình:
      tho        — y ~ Z, khớp trên cả hai nhóm
      hiep_bien  — y ~ Z + X, khớp trên cả hai nhóm (dùng CHUNG một dốc)
      g_comp_z0  — y ~ X, khớp CHỈ trên nhóm đối chứng
    """
    d1, d0 = d[d[can_thiep] == 1], d[d[can_thiep] == 0]
    lech = {b: d1[b].mean() - d0[b].mean() for b in HIEP_BIEN}
    hang = []

    def them(mo_hinh, ten_bien, gia_tri):
        hang.append({"mo_hinh": mo_hinh, "bien": ten_bien,
                     "he_so": round(float(gia_tri), 4),
                     "chenh_lech_x": (round(lech[ten_bien], 4)
                                      if ten_bien in lech else None)})

    for nhan, ct in [("tho", f"{bien_kq} ~ {can_thiep}"),
                     ("hiep_bien", f"{bien_kq} ~ {can_thiep} + " + " + ".join(HIEP_BIEN))]:
        r = smf.ols(ct, d).fit(cov_type="HC3")
        for ten_bien, gt in r.params.items():
            them(nhan, "chan" if ten_bien == "Intercept" else ten_bien, gt)

    beta, *_ = np.linalg.lstsq(_thiet_ke(d0), d0[bien_kq].to_numpy(), rcond=None)
    for ten_bien, gt in zip(["chan"] + HIEP_BIEN, beta):
        them("g_comp_z0", ten_bien, gt)

    bang = pd.DataFrame(hang)
    bang.to_csv(CSV_HE_SO, index=False, encoding="utf-8")
    print(f"\n  Hệ số ba mô hình → {CSV_HE_SO.name}")
    return bang


def chan_doan_hiep_bien(d, can_thiep="Z", bien_kq="y"):
    """Vì sao thêm hiệp biến lại làm sai số của `Z` TĂNG chứ không giảm.

    Nghịch lý này có thật và đo được, nên phải thành đầu ra chứ không phải một
    câu giải thích gõ tay trên slide. Hai nguyên nhân tách bạch:

      · hiệp biến hầu như KHÔNG giải thích được `y` (phần dư gần như không đổi)
        → không có phần lợi nào để bù
      · nhưng `Z` lại đoán được khá tốt từ `X` (hai nhóm hàng vốn khác nhau ở
        đúng ba biến đó) → phương sai của `β₁` bị phóng đại theo hệ số VIF

    Kiểm nhanh: se_tho × √VIF ≈ se_hiep_bien.
    """
    r_tho = smf.ols(f"{bien_kq} ~ {can_thiep}", d).fit(cov_type="HC3")
    r_hb = smf.ols(f"{bien_kq} ~ {can_thiep} + " + " + ".join(HIEP_BIEN),
                   d).fit(cov_type="HC3")
    r_z = smf.ols(f"{can_thiep} ~ " + " + ".join(HIEP_BIEN), d).fit()
    vif = 1 / (1 - r_z.rsquared)
    muc = [
        ("se_z_tho", r_tho.bse[can_thiep]),
        ("se_z_hiep_bien", r_hb.bse[can_thiep]),
        ("sd_phan_du_tho", r_tho.resid.std(ddof=2)),
        ("sd_phan_du_hiep_bien", r_hb.resid.std(ddof=1 + len(HIEP_BIEN) + 1)),
        ("r2_tho", r_tho.rsquared),
        ("r2_hiep_bien", r_hb.rsquared),
        ("r2_can_thiep_theo_x", r_z.rsquared),
        ("vif_can_thiep", vif),
    ]
    bang = pd.DataFrame([{"chi_so": k, "gia_tri": round(float(v), 4)} for k, v in muc])
    bang.to_csv(CSV_CHAN_DOAN_HB, index=False, encoding="utf-8")
    print(f"  Chẩn đoán hiệp biến: SE {r_tho.bse[can_thiep]:.3f} → "
          f"{r_hb.bse[can_thiep]:.3f} dù phần dư gần như không đổi "
          f"({r_tho.resid.std(ddof=2):.3f} → {r_hb.resid.std(ddof=5):.3f}); "
          f"VIF={vif:.3f}")
    return bang


def chong_lan_hiep_bien(d, can_thiep):
    """Tỉ lệ SKU nhóm can thiệp nằm NGOÀI khoảng hiệp biến của nhóm đối chứng.

    Bắt buộc báo cáo: g-computation phải ngoại suy ở đúng những SKU này.
    """
    d1, d0 = d[d[can_thiep] == 1], d[d[can_thiep] == 0]
    ngoai = pd.Series(False, index=d1.index)
    chi_tiet = {}
    for b in HIEP_BIEN:
        lo, hi = d0[b].min(), d0[b].max()
        v = (d1[b] < lo) | (d1[b] > hi)
        chi_tiet[b] = float(v.mean())
        ngoai |= v
    return float(ngoai.mean()), chi_tiet


# ─────────────────────────── PP2 ───────────────────────────

def _gop_tang_mong(g, can_thiep):
    """Gộp tầng mỏng về phía giá thấp hơn; tầng thấp nhất gộp lên (§9)."""
    while True:
        dem = g.groupby("tang")[can_thiep].agg(["sum", "count"])
        dem["n1"], dem["n0"] = dem["sum"], dem["count"] - dem["sum"]
        mong = dem[(dem.n1 < cf.TOI_THIEU_SKU_MOI_TANG) |
                   (dem.n0 < cf.TOI_THIEU_SKU_MOI_TANG)]
        if mong.empty or g["tang"].nunique() <= 1:
            return g
        t = mong.index[0]
        ds = sorted(g["tang"].unique())
        i = ds.index(t)
        dich = ds[i - 1] if i > 0 else ds[1]
        g = g.assign(tang=g["tang"].replace({t: dich}))


def tu_kiem_gop_tang_mong():
    """5.000/5.000 lần hợp lệ chỉ chứng minh nhánh lỗi CHƯA được kích hoạt.
    Phải dựng một mẫu cố ý có tầng mỏng để chứng minh quy tắc gộp chạy đúng."""
    rng = np.random.default_rng(0)
    n = 60
    d = pd.DataFrame({"pre_p": np.arange(1, n + 1) * 1000.0,
                      "y": rng.normal(size=n)})
    # Nhóm can thiệp chỉ có 1 SKU ở vùng giá thấp nhất → tầng 0 chắc chắn mỏng
    d["Z"] = 0
    d.loc[0, "Z"] = 1
    d.loc[n // 3:, "Z"] = rng.integers(0, 2, len(d) - n // 3)
    est, bang = pp2_phan_tang(d, "Z", "y", so_tang=5)
    cf.khang_dinh(est is not None, "quy tắc gộp tầng mỏng không trả về ước lượng")
    cf.khang_dinh((bang["n1"] >= cf.TOI_THIEU_SKU_MOI_TANG).all()
                  and (bang["n0"] >= cf.TOI_THIEU_SKU_MOI_TANG).all(),
                  f"sau khi gộp vẫn còn tầng mỏng: {bang[['n1','n0']].to_dict('records')}")
    print(f"     tự kiểm quy tắc gộp tầng mỏng: ĐẠT "
          f"({len(bang)} tầng sau gộp, min n₁={int(bang.n1.min())}, "
          f"min n₀={int(bang.n0.min())})")


def pp2_phan_tang(d, can_thiep, bien_kq="y", so_tang=None):
    so_tang = so_tang or cf.SO_PHAN_VI_GIA
    g = d.copy()
    g["tang"] = pd.qcut(g["pre_p"], so_tang, labels=False, duplicates="drop")
    g = _gop_tang_mong(g, can_thiep)
    hang = []
    for tg, s in g.groupby("tang"):
        a, c = s[s[can_thiep] == 1], s[s[can_thiep] == 0]
        if len(a) == 0 or len(c) == 0:
            return None, None
        hang.append({"tang": int(tg), "n1": len(a), "n0": len(c),
                     "gia_min": s.pre_p.min(), "gia_max": s.pre_p.max(),
                     "tau_s": a[bien_kq].mean() - c[bien_kq].mean()})
    bang = pd.DataFrame(hang)
    bang["w_s"] = bang["n1"] / bang["n1"].sum()      # trọng số ATT
    return float((bang["w_s"] * bang["tau_s"]).sum()), bang


def smd_sau_phan_tang(d, can_thiep, so_tang=None):
    """Cổng chẩn đoán 1: SMD của từng hiệp biến TRONG từng tầng.

    Đây là bằng chứng cho việc cổng 1 trượt. Bản trước chỉ in ra màn hình
    nên web không kiểm chứng được — phải thành đầu ra chuẩn.
    """
    so_tang = so_tang or cf.SO_PHAN_VI_GIA
    g = d.copy()
    g["tang"] = pd.qcut(g["pre_p"], so_tang, labels=False, duplicates="drop")
    g = _gop_tang_mong(g, can_thiep)
    hang = []
    for tg, s in g.groupby("tang"):
        a, c = s[s[can_thiep] == 1], s[s[can_thiep] == 0]
        for b in HIEP_BIEN:
            sd = np.sqrt((a[b].var() + c[b].var()) / 2)
            smd = 0.0 if sd == 0 else (a[b].mean() - c[b].mean()) / sd
            hang.append({"tang": int(tg), "bien": b, "n1": len(a), "n0": len(c),
                         "smd": smd, "vuot_nguong": bool(abs(smd) > 0.25)})
    return pd.DataFrame(hang)


def pp2_bootstrap(d, can_thiep, bien_kq="y", so_lan=None, so_tang=None):
    """Bootstrap TOÀN BỘ estimator: lấy mẫu SKU từ mẫu CHƯA chia tầng,
    rồi tính lại phân vị, gộp tầng, trọng số (phase-03 §5)."""
    so_lan = so_lan or cf.SO_LAN_BOOTSTRAP
    est, bang = pp2_phan_tang(d, can_thiep, bien_kq, so_tang)
    d1, d0 = d[d[can_thiep] == 1], d[d[can_thiep] == 0]
    rng = np.random.default_rng(cf.SEED)
    boot, that_bai = [], 0
    for _ in range(so_lan):
        bd = pd.concat([d1.iloc[rng.integers(0, len(d1), len(d1))],
                        d0.iloc[rng.integers(0, len(d0), len(d0))]])
        v, _ = pp2_phan_tang(bd, can_thiep, bien_kq, so_tang)
        if v is None or not np.isfinite(v):
            that_bai += 1
        else:
            boot.append(v)
    boot = np.array(boot)
    hop_le = len(boot)
    cf.khang_dinh(hop_le >= 0.95 * so_lan,
                  f"bootstrap PP2 chỉ {hop_le}/{so_lan} lần hợp lệ — dưới ngưỡng 95%")
    return dict(_tom_tat_boot(est, boot),
                so_lan_hop_le=hop_le, so_lan_that_bai=that_bai), bang


# ─────────────────── cổng chẩn đoán 2 & 3 ───────────────────

def gia_duoc_tien_ky(dong, roster):
    """Giả dược trong tiền kỳ: 05 → 06. Không được chạm hậu kỳ thật.

    🔴 Hiệp biến phải tính LẠI chỉ trên tháng 05. Dùng `pre_*` của đặc tả
    chính là RÒ RỈ: chúng tính trên 05+06, mà 06 chính là kỳ "hậu" của
    giả dược này.
    """
    d = dong[dong["dg"] < pd.Timestamp("2025-07-01")].copy()
    d["gia_post"] = d["dg"] >= pd.Timestamp("2025-06-01")
    ca_hai = d.groupby("sku")["gia_post"].nunique() == 2
    d = d[d["sku"].isin(set(ca_hai[ca_hai].index))]
    gia = d.pivot_table(index="sku", columns="gia_post", values="pg",
                        aggfunc="median").dropna()
    gia.columns = ["p_tr", "p_sa"]

    TR = d[~d["gia_post"]]                       # CHỈ tháng 05
    cf.khang_dinh(TR["dg"].max() < pd.Timestamp("2025-06-01"),
                  "khung hiệp biến giả dược chứa dữ liệu tháng 06 — rò rỉ")
    hb = (TR.groupby("sku")
          .apply(lambda g: pd.Series({
              "pre_p": g["pg"].median(),
              "pre_q": g["soluong_ct"].sum(),
              "pre_w": g["dg"].dt.to_period("W").nunique(),
          }), include_groups=False).reset_index())

    m = (roster.drop(columns=["pre_p", "pre_q", "pre_w"], errors="ignore")
         .merge(hb, on="sku").merge(gia.reset_index(), on="sku"))
    m["y"] = np.log(m["p_sa"] / m["p_tr"]) * 100
    return them_hiep_bien(m)


def tost(est, se, bien):
    """TOST xấp xỉ chuẩn — dùng cho ước lượng có SE giải tích (HC3)."""
    p_lo = 1 - stats.norm.cdf((est + bien) / se)
    p_hi = stats.norm.cdf((est - bien) / se)
    return max(p_lo, p_hi)


def tost_boot(est, boot, bien):
    """TOST từ chính phân phối bootstrap, không xấp xỉ chuẩn.

    Dịch phân phối bootstrap về tâm giá trị H₀ rồi lấy đuôi một phía.
    """
    p_lo = (np.sum(boot >= 2 * est + bien) + 1) / (len(boot) + 1)   # H₀: θ ≤ −biên
    p_hi = (np.sum(boot <= 2 * est - bien) + 1) / (len(boot) + 1)   # H₀: θ ≥ +biên
    return float(max(p_lo, p_hi))


# ─────────────────────────── chạy ───────────────────────────

def _mo_ta(nhan, r, extra=""):
    print(f"    {nhan:<34} {r['uoc_luong']:+7.3f}  se={r['se']:.3f}"
          f"  p={r['p']:.3f}  KTC=[{r['ktc_duoi']:+6.2f},{r['ktc_tren']:+6.2f}] {extra}")


def chay():
    tu_kiem_gop_tang_mong()
    m = them_hiep_bien(pd.read_csv(cf.CSV_MAU_PHAN_TICH, dtype={"sku": str}))
    NGUONG = cf.BIEN_TOST["rong"] * abs(cf.TAU_CHUYEN_HOAN_TOAN)   # 0,918
    ket, tangs = [], []

    print("=" * 78)
    print("KẾT QUẢ CHÍNH — ITT theo Z (nhận dạng bằng LUẬT)")
    print("⚠️  Cổng cân bằng đã trượt: đây là SO SÁNH CÓ ĐIỀU CHỈNH")
    print("=" * 78)
    itt = m[m["Z"] >= 0].copy()
    print(f"  Mẫu: Z=1 → {int((itt.Z==1).sum())} SKU  |  Z=0 → {int((itt.Z==0).sum())} SKU")

    mo_ta_y_theo_nhom(itt)
    he_so_mo_hinh(itt)
    chan_doan_hiep_bien(itt)

    ngoai, chi_tiet = chong_lan_hiep_bien(itt, "Z")
    print(f"\n  Chồng lấn hiệp biến: {ngoai*100:.1f}% SKU Z=1 nằm NGOÀI khoảng của Z=0")
    print("    " + "  ".join(f"{k}={v*100:.1f}%" for k, v in chi_tiet.items()))

    print("\n  PP1 cách A — chênh lệch tuyến tính có điều chỉnh:")
    a = pp1_cach_a(itt, "Z")
    _mo_ta("(1a) thô", a["tho"])
    _mo_ta("(1b) có hiệp biến", a["hiep_bien"])
    for k, v in a.items():
        # `k` là khóa dict nội bộ ("tho"/"hiep_bien"). Ghép thẳng vào nhãn hiển
        # thị làm web và slide hiện "PP1-A tho" trong khi báo cáo viết "PP1-A
        # thô" — cùng một ước lượng mà hai nơi gọi hai tên.
        ket.append({"vai_tro": "chính", "uoc_luong": "ITT",
                    "pp": TEN_HIEN_THI_PP1A[k], **v})

    print("\n  PP1 cách B — g-computation cho ATT (bootstrap):")
    b = pp1_cach_b(itt, "Z")
    _mo_ta("ATT chuẩn hóa", b)
    ket.append({"vai_tro": "chính", "uoc_luong": "ITT",
                "pp": "PP1-B g-computation", **b})

    print("\n  PP2 — phân tầng 5 phân vị giá nền (bootstrap toàn bộ estimator):")
    p2, bang = pp2_bootstrap(itt, "Z")
    _mo_ta("ATT phân tầng", p2,
           f"[{p2['so_lan_hop_le']} lần hợp lệ, {p2['so_lan_that_bai']} thất bại]")
    ket.append({"vai_tro": "chính", "uoc_luong": "ITT", "pp": "PP2 phân tầng", **p2})
    print("\n    Theo tầng:")
    for r in bang.itertuples():
        print(f"      tầng {r.tang}: {r.gia_min:>8,.0f}–{r.gia_max:>9,.0f}đ"
              f"  n₁={r.n1:>3} n₀={r.n0:>3}  w={r.w_s:.3f}  τ_s={r.tau_s:+7.3f}")
    # 🔴 Nhãn này là HỢP ĐỒNG với frontend (lib/hang-so-chinh-sach.ts).
    # Đổi nó mà không đổi bên kia thì biểu đồ rỗng mà KHÔNG báo lỗi — đã xảy ra
    # một lần. Nếu phải đổi, sửa cả hai nơi và chạy lại kiểm chứng ở cuối file.
    bang.insert(0, "mau", cf.NHAN_MAU_SO_SANH_CHINH)
    tangs.append(bang)

    smd = smd_sau_phan_tang(itt, "Z")
    vuot = int(smd["vuot_nguong"].sum())
    print(f"\n    Cổng 1 — SMD sau phân tầng: {vuot}/{len(smd)} cặp"
          f" vượt ngưỡng ±0,25"
          f"  → {'🔴 TRƯỢT' if vuot > len(smd) / 3 else 'đạt'}")
    smd.to_csv(CSV_SMD_TANG, index=False, encoding="utf-8")

    print("\n" + "=" * 78)
    print(f"HAI GIẢ THUYẾT (§10) — mốc chuyển hoàn toàn = {cf.TAU_CHUYEN_HOAN_TOAN:.3f}")
    print("=" * 78)
    print("    ước lượng                      pass-through   H₀:ATT=0   H₀:chuyển hoàn toàn")
    for r in ket:
        if r["vai_tro"] != "chính":
            continue
        e, se = r["uoc_luong"], r["se"]
        pt = e / cf.TAU_CHUYEN_HOAN_TOAN
        t = (e - cf.TAU_CHUYEN_HOAN_TOAN) / se
        p_ht = 2 * min(stats.norm.cdf(t), 1 - stats.norm.cdf(t))
        r["pass_through"] = pt
        r["p_chuyen_hoan_toan"] = p_ht
        hep = cf.BIEN_TOST["hep"] * abs(cf.TAU_CHUYEN_HOAN_TOAN)
        if r.get("boot") is not None:
            r["tost_hep"] = tost_boot(e, r["boot"], hep)
            r["tost_rong"] = tost_boot(e, r["boot"], NGUONG)
        else:
            r["tost_hep"] = tost(e, se, hep)
            r["tost_rong"] = tost(e, se, NGUONG)
        print(f"    {r['pp']:<28} {pt:+7.3f}      p={r['p']:.3f}"
              f"     p={p_ht:.4f} → {'BÁC BỎ' if p_ht < cf.ALPHA else '🔴 KHÔNG bác bỏ'}")
    print("    TOST (không kết luận được nếu p ≥ 0,05):")
    for r in ket:
        if r["vai_tro"] == "chính":
            print(f"      {r['pp']:<28} biên ±0,459: p={r['tost_hep']:.3f}"
                  f"   biên ±0,918: p={r['tost_rong']:.3f}")

    print("\n" + "=" * 78)
    print("KẾT QUẢ PHỤ — per-protocol theo D (cần thêm giả định, xem §5)")
    print("=" * 78)
    dcs = {
        "ĐC-A rượu/bia/thuốc": (m.grp == "C10") & (m.loai_sp == "ruou_bia_thuoc"),
        "ĐC-B bỏ hóa chất": (m.grp == "C10") & (m.loai_sp != "hoa_chat"),
        "ĐC-C đầy đủ": (m.grp == "C10"),
        "ĐC-8% (độ nhạy)": (m.grp == "C8"),
    }
    for ten, msk in dcs.items():
        s = m[(m.grp == "T") | msk]
        a = pp1_cach_a(s, "D")
        _mo_ta(f"{ten} (n₀={int(msk.sum())})", a["hiep_bien"])
        ket.append({"vai_tro": "phụ", "uoc_luong": "per-protocol",
                    "pp": f"PP1-A hiệp biến · {ten}", **a["hiep_bien"]})

    print("\n" + "=" * 78)
    print("CỔNG CHẨN ĐOÁN 2 & 3 — giả dược tiền kỳ 05→06")
    print(f"Tiêu chí khóa trước: |ước lượng| > {NGUONG:.3f} ⇒ TRƯỢT")
    print("=" * 78)
    dong = pd.read_csv(cf.CSV_DONG_PHAN_TICH, low_memory=False, dtype={"sku": str})
    dong["dg"] = pd.to_datetime(dong["dg"])
    ros = pd.read_csv(cf.CSV_ROSTER, dtype={"sku": str}).merge(
        m[["sku", "Z", "D"]], on="sku")
    gd = gia_duoc_tien_ky(dong, ros)
    cong = []
    for ten, s, ct in [("Z (so sánh chính)", gd[gd.Z >= 0], "Z"),
                       ("ĐC-A", gd[(gd.grp == "T") | ((gd.grp == "C10") &
                                                      (gd.loai_sp == "ruou_bia_thuoc"))], "D"),
                       ("ĐC-C", gd[gd.grp.isin(["T", "C10"])], "D"),
                       ("ĐC-8%", gd[gd.grp.isin(["T", "C8"])], "D")]:
        a = pp1_cach_a(s, ct)
        for k in ["tho", "hiep_bien"]:
            r = a[k]
            trươt = abs(r["uoc_luong"]) > NGUONG
            pt = tost(r["uoc_luong"], r["se"], NGUONG)
            print(f"    {ten:<20} {k:<10} {r['uoc_luong']:+7.3f}  p={r['p']:.3f}"
                  f"  TOST(±{NGUONG:.2f}) p={pt:.3f}"
                  f"  → {'🔴 TRƯỢT' if trươt else 'đạt'}"
                  f" · {'tương đương' if pt < 0.05 else 'KHÔNG chứng minh được song song'}")
            cong.append({"mau": ten, "dac_ta": k, "n": len(s),
                         "uoc_luong": r["uoc_luong"], "se": r["se"], "p": r["p"],
                         "tost_p": pt, "truot_cong2": bool(trươt),
                         "tuong_duong_cong3": bool(pt < 0.05)})

    print("\n" + "=" * 78)
    print("LƯỚI ĐỘ NHẠY — chạy từng trục một, báo cáo HẾT")
    print("=" * 78)
    nhay = []

    def ghi(truc, muc, s, ct, pp="PP1-A hiệp biến"):
        if len(s) < 20 or s[ct].nunique() < 2:
            return
        r = pp1_cach_a(s, ct)["hiep_bien"]
        nhay.append({"truc": truc, "muc": muc, "n": len(s), "pp": pp, **r})
        print(f"    {truc:<22} {muc:<24} n={len(s):>4}  {r['uoc_luong']:+7.3f}"
              f"  p={r['p']:.3f}  KTC=[{r['ktc_duoi']:+6.2f},{r['ktc_tren']:+6.2f}]")

    # --- Trục cửa sổ: dựng lại mẫu cho từng cửa sổ, KHÔNG ghi đè file chuẩn ---
    import b2_dung_mau
    for w in cf.CUA_SO_DO_NHAY:
        try:
            mw = them_hiep_bien(b2_dung_mau.chay(cua_so=w, ghi=False))
        except AssertionError as e:
            print(f"    {'Cửa sổ':<22} {w:<24} BỎ QUA — {e}")
            continue
        ghi("Cửa sổ [ITT]", w, mw[mw.Z >= 0], "Z")
        ghi("Cửa sổ [per-protocol]", w,
            mw[(mw.grp == "T") | ((mw.grp == "C10") & (mw.loai_sp == "ruou_bia_thuoc"))], "D")

    # --- PP2 cho per-protocol ĐC-A (kế hoạch §1 yêu cầu PP2 ở cả hai) ---
    s_a = m[(m.grp == "T") | ((m.grp == "C10") & (m.loai_sp == "ruou_bia_thuoc"))]
    p2a, bang_a = pp2_bootstrap(s_a, "D")
    nhay.append({"truc": "PP2 [per-protocol]", "muc": "ĐC-A phân tầng",
                 "n": len(s_a), "pp": "PP2",
                 **{k: v for k, v in p2a.items() if k != "boot"}})
    print(f"    {'PP2 [per-protocol]':<22} {'ĐC-A phân tầng':<24} n={len(s_a):>4}"
          f"  {p2a['uoc_luong']:+7.3f}  p={p2a['p']:.3f}"
          f"  KTC=[{p2a['ktc_duoi']:+6.2f},{p2a['ktc_tren']:+6.2f}]")
    bang_a.insert(0, "mau", "per-protocol ĐC-A")
    tangs.append(bang_a)

    chua_ro = m["grp"].isin(["T", "C10"]) & (m["loai_sp"] == "khong_ro")
    cf.khang_dinh(int(chua_ro.sum()) == cf.SO_SKU_CHUA_RO,
                  f"nhãn lưới độ nhạy ghi {cf.SO_SKU_CHUA_RO} SKU chưa rõ "
                  f"nhưng bộ lọc cho {int(chua_ro.sum())} — nhãn đang nói dối")
    nd = cf.NHAN_DO_NHAY
    for muc, Zv in [(nd["chua_ro_co_so"], m["Z"]),
                    (nd["chua_ro_z1"], np.where(chua_ro, 1, m["Z"])),
                    (nd["chua_ro_z0"], np.where(chua_ro, 0, m["Z"]))]:
        s = m.assign(Zv=Zv)
        ghi(nd["chua_ro_truc"], muc, s[s.Zv >= 0].rename(columns={"Zv": "Zx"}), "Zx")

    for nhan, base, ct in [("[ITT]", itt, "Z"), ("[per-protocol]", s_a, "D")]:
        for k in cf.LUOI_NGUONG_TUAN:
            ghi(f"Survivorship {nhan}", f"≥{k} tuần", base[base.pre_w >= k], ct)
        for muc, s in [("giữ 9 SKU hòa", base), ("loại 9 SKU hòa", base[base.vat_hoa == 0])]:
            ghi(f"9 SKU hòa VAT {nhan}", muc, s, ct)

    for nhan, base, ct in [("[ITT]", itt, "Z"), ("[per-protocol]", s_a, "D")]:
        for muc, kq in [("giá gồm thuế", "y"), ("giá chưa thuế", "yn")]:
            r = pp1_cach_a(base, ct, kq)["hiep_bien"]
            truc = f"Biến kết quả {nhan}"
            nhay.append({"truc": truc, "muc": muc, "n": len(base),
                         "pp": "PP1-A hiệp biến", **r})
            print(f"    {truc:<22} {muc:<24} n={len(base):>4}  {r['uoc_luong']:+7.3f}"
                  f"  p={r['p']:.3f}  KTC=[{r['ktc_duoi']:+6.2f},{r['ktc_tren']:+6.2f}]")

    pd.DataFrame(ket).drop(columns=["boot"], errors="ignore").to_csv(
        CSV_KQ, index=False, encoding="utf-8")
    pd.concat(tangs).to_csv(CSV_TANG, index=False, encoding="utf-8")
    pd.DataFrame(cong).to_csv(CSV_CONG, index=False, encoding="utf-8")
    pd.DataFrame(nhay).to_csv(CSV_NHAY, index=False, encoding="utf-8")
    for p in (CSV_KQ, CSV_TANG, CSV_CONG, CSV_NHAY, CSV_SMD_TANG):
        print(f"\n→ {p.relative_to(cf.GOC_REPO)}")
    return True


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
