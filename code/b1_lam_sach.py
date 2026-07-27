"""Bước 1 — Nối hai sheet, áp 6 quy tắc lọc cấp dòng, xuất bảng luồng mẫu.

Quy tắc lấy nguyên từ đặc tả khóa §3. THỨ TỰ CÓ Ý NGHĨA: các bộ lọc là
phép giao nên mẫu cuối không đổi khi hoán vị, nhưng SỐ MẤT Ở TỪNG BƯỚC thì đổi.
Bảng luồng mẫu chỉ khớp khi giữ đúng thứ tự này.

Việc gán nhóm thuế và điều kiện SKU có mặt ở cả hai kỳ nằm ở bước 2 —
cố ý tách ra, để khi số cuối lệch còn biết lệch vì lọc hay vì phân nhóm.
"""
import sys
import pandas as pd
import config_du_an as cf

def chay():
    """Trả về danh sách bước của bảng luồng mẫu; bước 2 sẽ nối tiếp vào."""
    luong_mau = []          # cục bộ, không toàn cục: gọi hai lần không nối thêm

    def ghi_buoc(ten, truoc, sau, ghi_chu=""):
        luong_mau.append({
            "buoc": len(luong_mau), "quy_tac": ten, "dong_vao": truoc,
            "dong_ra": sau, "mat": truoc - sau, "ghi_chu": ghi_chu,
        })
        print(f"  {len(luong_mau)-1}. {ten:<44} {truoc:>7,} → {sau:>7,}"
              f"  (mất {truoc-sau:>6,})")

    cf.tao_thu_muc()
    print("Đọc CSV trung gian ...")
    goc = pd.read_csv(cf.CSV_GOC, low_memory=False, dtype=str)
    chitiet = pd.read_csv(cf.CSV_CHITIET, low_memory=False,
                          dtype={"soid": str, "ma_hh_ct": str})

    # --- Nối: chitiet nhiều → goc một (đặc tả khóa §2) ---
    cf.khang_dinh(goc["soid"].is_unique, "goc.soid không duy nhất — không nối m:1 được")
    goc["dg"] = pd.to_datetime(goc["ngayct"], errors="raise")

    n0 = len(chitiet)
    print(f"\nBảng luồng mẫu (đơn vị: DÒNG HÀNG, không phải hóa đơn)")
    ghi_buoc("Dữ liệu thô sheet chitiet", n0, n0)

    # Đặt tiền tố tường minh: CẢ HAI sheet đều có cột `daxoa`. Nếu để pandas
    # tự thêm hậu tố _x/_y thì việc lọc sẽ phụ thuộc thứ tự cột — âm thầm sai.
    tu_goc = (goc[["soid", "dg", "ma_ncc_hddt", "daxoa"]]
              .rename(columns={"ma_ncc_hddt": "goc_ma_ncc_hddt", "daxoa": "goc_daxoa"}))
    cf.khang_dinh("daxoa" in chitiet.columns,
                  "sheet chitiet không còn cột daxoa — kiểm tra lại giả định trùng tên")
    d = chitiet.merge(tu_goc, on="soid", how="inner", validate="m:1")
    ghi_buoc("Nối với sheet goc theo soid (m:1)", n0, len(d),
             f"nối {len(d)/n0*100:.1f}%")
    cf.khang_dinh(len(d) == n0, f"nối làm rớt {n0-len(d)} dòng — phải nối 100%")

    # --- 6 quy tắc lọc cấp dòng, ĐÚNG THỨ TỰ đặc tả khóa §3 ---
    truoc = len(d)
    d = d[d["goc_ma_ncc_hddt"] == "THUE_BANRA"]
    ghi_buoc("§3.1 Chỉ hóa đơn bán ra", truoc, len(d), "loại hóa đơn mua vào")

    truoc = len(d)
    d = d[d["goc_daxoa"] == "0"]
    ghi_buoc("§3.2 Bỏ bản ghi có cờ xóa (goc.daxoa)", truoc, len(d))

    # GIỮ tháng 4 ở đây. Cửa sổ chính áp ở bước 2 — nếu lọc ngay tại đây thì
    # cửa sổ độ nhạy `co_thang_4` không thể chạy từ dữ liệu chuẩn.
    truoc = len(d)
    d = d[d["dg"] >= pd.Timestamp(cf.NGAY_SOM_NHAT_GIU_LAI)]
    ghi_buoc(f"§3.3a Giữ từ {cf.NGAY_SOM_NHAT_GIU_LAI} (mọi cửa sổ)", truoc, len(d),
             "cửa sổ cụ thể áp ở bước 2")

    for cot in cf.COT_SO_CHITIET:
        d[cot] = pd.to_numeric(d[cot], errors="raise")

    truoc = len(d)
    d = d[d["soluong_ct"] > 0]
    ghi_buoc("§3.4 Số lượng dương", truoc, len(d), "loại trả hàng")

    truoc = len(d)
    d = d[d["sotien_sauvat_ct"] > 0]
    ghi_buoc("§3.5 Thành tiền dương", truoc, len(d), "cần để lấy log")

    truoc = len(d)
    d = d[d["ma_hh_ct"].notna() & (d["ma_hh_ct"] != "")]
    ghi_buoc("§3.6 Có mã vạch", truoc, len(d), "mã vạch chỉ điền từ 21/04/2025")

    # --- Biến giá (đặc tả khóa §4) ---
    d = d.rename(columns={"ma_hh_ct": "sku"}).copy()
    d["post"] = d["dg"] >= pd.Timestamp(cf.NGAY_CHINH_SACH)
    d["pg"] = d["sotien_sauvat_ct"] / d["soluong_ct"]   # giá gồm thuế
    d["pn"] = d["sotien_ct"] / d["soluong_ct"]          # giá chưa thuế
    cf.khang_dinh(d["pg"].gt(0).all(), "có giá gồm thuế không dương")

    # Đặc tả khóa §2 yêu cầu kiểm tra ngayct_ct dù không dùng để phân kỳ
    ct_ngay = pd.to_datetime(d["ngayct_ct"], errors="coerce")
    lech = (ct_ngay.dt.normalize() != d["dg"].dt.normalize()).sum()
    cf.khang_dinh(ct_ngay.notna().all(), "có ngayct_ct không phân tích được")
    print(f"     kiểm tra ngày: {lech:,} dòng có ngayct_ct lệch goc.ngayct"
          f" ({lech/len(d)*100:.2f}%) — dùng goc.ngayct theo §2")

    d.to_csv(cf.CSV_DONG_SACH, index=False, encoding="utf-8")
    print(f"\n→ {cf.CSV_DONG_SACH.relative_to(cf.GOC_REPO)}  ({len(d):,} dòng)")
    return luong_mau


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
