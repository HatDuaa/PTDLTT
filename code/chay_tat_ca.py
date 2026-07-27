"""Điểm vào duy nhất của pipeline.

    python code/chay_tat_ca.py            chạy đủ, bỏ qua bước 0 nếu CSV đã có
    python code/chay_tat_ca.py --sach     xóa du-lieu-tam/ rồi chạy lại từ đầu

Dừng ngay khi một bước sai. Không bao giờ chạy tiếp bằng đầu ra cũ.
"""
import sys
import json
import shutil
import hashlib
import platform
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config_du_an as cf


def bam_file(duong_dan, so_byte=1 << 20):
    h = hashlib.sha256()
    with open(duong_dan, "rb") as f:
        while chunk := f.read(so_byte):
            h.update(chunk)
    return h.hexdigest()[:16]


def ghi_manifest():
    import pandas as pd
    import numpy as np
    dau_ra = {}
    # Hash MỌI đầu ra, không chỉ dữ liệu trung gian. Bản trước chỉ hash 5 file
    # nên phép thử "chạy hai lần ra hash giống nhau" không hề kiểm chứng
    # được các bảng KẾT QUẢ — đúng thứ cần kiểm chứng nhất.
    nguon = [cf.CSV_DONG_SACH, cf.CSV_DONG_PHAN_TICH, cf.CSV_ROSTER,
             cf.CSV_MAU_PHAN_TICH]
    nguon += sorted(cf.THU_MUC_KET_QUA.glob("*.csv"))
    nguon += sorted(cf.THU_MUC_KET_QUA.glob("hinh/*.png"))
    for p in nguon:
        if p.exists():
            muc = {"sha256_16": bam_file(p)}
            if p.suffix == ".csv":       # PNG không đếm dòng được
                muc["so_dong"] = sum(1 for _ in open(p, encoding="utf-8")) - 1
            dau_ra[p.name] = muc
    manifest = {
        "nguon": {"file": cf.FILE_XLSX.name, "sha256_16": bam_file(cf.FILE_XLSX)},
        "moi_truong": {
            "python": platform.python_version(),
            "pandas": pd.__version__,
            "numpy": np.__version__,
        },
        "tham_so": {
            "ngay_chinh_sach": cf.NGAY_CHINH_SACH,
            "cua_so_chinh_bat_dau": cf.CUA_SO_CHINH_BAT_DAU,
            "seed": cf.SEED,
            "so_lan_bootstrap": cf.SO_LAN_BOOTSTRAP,
            "nguong_tuan_chinh": cf.NGUONG_TUAN_CHINH,
        },
        "dau_ra": dau_ra,
    }
    cf.FILE_MANIFEST.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n→ {cf.FILE_MANIFEST.relative_to(cf.GOC_REPO)}")


def chay():
    sach = "--sach" in sys.argv
    if sach and cf.THU_MUC_TAM.exists():
        shutil.rmtree(cf.THU_MUC_TAM)
        print("Đã xóa du-lieu-tam/")
    cf.tao_thu_muc()

    import b0_doc_du_lieu, b1_lam_sach, b2_dung_mau, b3_eda, b4_uoc_luong, b5_suy_dien

    # Chỉ dùng lại CSV khi chúng chứng minh được là sinh từ ĐÚNG file xlsx này.
    # Nếu 60.xlsx đổi mà số dòng không đổi, manifest sẽ gắn hash mới với CSV cũ.
    dau_xlsx = cf.THU_MUC_TAM / "nguon-xlsx.sha"
    bam_hien_tai = bam_file(cf.FILE_XLSX)
    khop = (dau_xlsx.exists()
            and dau_xlsx.read_text(encoding="utf-8").strip() == bam_hien_tai)

    print("=" * 72)
    if cf.CSV_GOC.exists() and cf.CSV_CHITIET.exists() and khop and not sach:
        print("BƯỚC 0 — bỏ qua, CSV trung gian khớp hash 60.xlsx hiện tại")
    else:
        if cf.CSV_GOC.exists() and not khop:
            print("BƯỚC 0 — CSV cũ KHÔNG khớp hash 60.xlsx, đọc lại")
        else:
            print("BƯỚC 0 — Đọc 60.xlsx")
        b0_doc_du_lieu.chay()
        dau_xlsx.write_text(bam_hien_tai, encoding="utf-8")

    print("\n" + "=" * 72)
    print("BƯỚC 1 — Nối và lọc")
    luong = b1_lam_sach.chay()

    print("\n" + "=" * 72)
    print("BƯỚC 2 — Dựng mẫu")
    b2_dung_mau.chay(luong_mau=luong)

    print("\n" + "=" * 72)
    print("BƯỚC 3 — Thống kê mô tả (chương 3)")
    b3_eda.chay()

    print("\n" + "=" * 72)
    print("BƯỚC 4 — Hai phương pháp ước lượng")
    b4_uoc_luong.chay()

    print("\n" + "=" * 72)
    print("BƯỚC 5 — Suy diễn & phân tích phụ")
    b5_suy_dien.chay()

    ghi_manifest()
    print("\n" + "=" * 72)
    print("PIPELINE HOÀN TẤT — mọi kiểm chứng đạt.")
    return 0


if __name__ == "__main__":
    sys.exit(chay())
