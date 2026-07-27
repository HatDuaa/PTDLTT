"""Bước 0 — Đọc 60.xlsx, ghi ra CSV trung gian.

Giữ nguyên nội dung, chỉ đổi định dạng. Điểm quan trọng duy nhất:
chuẩn hóa mã vạch mà KHÔNG đi qua float (xem đặc tả khóa §2 Schema).
"""
import sys
import pandas as pd
import config_du_an as cf


def chuan_hoa_ma_vach(gia_tri):
    """Ô Excel lưu mã vạch có thể là số hoặc chuỗi. Đưa về chuỗi chữ số.

    Không dùng astype(int64) trên cả cột: cách đó ép NaN thành lỗi và
    làm mất số 0 đầu nếu mã được lưu dạng chuỗi.
    """
    if gia_tri is None or (isinstance(gia_tri, float) and pd.isna(gia_tri)):
        return None
    if isinstance(gia_tri, str):
        s = gia_tri.strip()
        return s if s else None
    if isinstance(gia_tri, float):
        if not gia_tri.is_integer():
            return None          # mã vạch không thể có phần thập phân
        return str(int(gia_tri))
    return str(gia_tri)


def chay():
    cf.tao_thu_muc()
    cf.khang_dinh(cf.FILE_XLSX.exists(), f"không thấy {cf.FILE_XLSX}")

    print(f"Đọc {cf.FILE_XLSX.name} ...")
    goc = pd.read_excel(cf.FILE_XLSX, sheet_name="goc")
    chitiet = pd.read_excel(cf.FILE_XLSX, sheet_name="chitiet")

    print(f"  goc     : {len(goc):>7,} dòng × {goc.shape[1]} cột")
    print(f"  chitiet : {len(chitiet):>7,} dòng × {chitiet.shape[1]} cột")

    cf.khang_dinh(len(goc) == cf.KIEM_CHUNG["hoa_don_tho"],
                  f"goc có {len(goc)} dòng, chờ đợi {cf.KIEM_CHUNG['hoa_don_tho']}")
    cf.khang_dinh(len(chitiet) == cf.KIEM_CHUNG["dong_chitiet_tho"],
                  f"chitiet có {len(chitiet)} dòng, chờ đợi {cf.KIEM_CHUNG['dong_chitiet_tho']}")

    # --- Schema: ép kiểu tường minh, không để pandas đoán ---
    chitiet["ma_hh_ct"] = chitiet["ma_hh_ct"].map(chuan_hoa_ma_vach)
    for cot in ("soid",):
        goc[cot] = goc[cot].astype(str).str.strip()
        chitiet[cot] = chitiet[cot].astype(str).str.strip()

    # Kiểm tra mã vạch không bị hỏng khi chuyển đổi
    co_ma = chitiet["ma_hh_ct"].dropna()
    do_dai = co_ma.str.len()
    cf.khang_dinh(co_ma.str.match(r"^\d+$").all(),
                  "có mã vạch chứa ký tự không phải chữ số sau chuẩn hóa")
    print(f"  mã vạch : {len(co_ma):,}/{len(chitiet):,} dòng có mã "
          f"({len(co_ma)/len(chitiet)*100:.1f}%), "
          f"độ dài {do_dai.min()}–{do_dai.max()}, {co_ma.nunique():,} mã khác nhau")

    goc.to_csv(cf.CSV_GOC, index=False, encoding="utf-8")
    chitiet.to_csv(cf.CSV_CHITIET, index=False, encoding="utf-8")
    print(f"→ {cf.CSV_GOC.relative_to(cf.GOC_REPO)}")
    print(f"→ {cf.CSV_CHITIET.relative_to(cf.GOC_REPO)}")


if __name__ == "__main__":
    sys.exit(chay())
