"""Hằng số và đường dẫn dùng chung cho toàn bộ pipeline.

Mọi giá trị ở đây phải khớp với plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md.
Không script nào được tự định nghĩa lại các hằng số này.
"""
import sys
from pathlib import Path

# --- Console Windows mặc định là cp1252: mọi print() tiếng Việt sẽ ném
# UnicodeEncodeError và giết cả pipeline giữa chừng. Ép UTF-8 tại đây vì mọi
# script đều import module này, nên không nơi nào phải nhớ tự làm.
for _luong in (sys.stdout, sys.stderr):
    if hasattr(_luong, "reconfigure"):
        _luong.reconfigure(encoding="utf-8", errors="replace")

# --- Đường dẫn: suy ra từ vị trí file, không phụ thuộc thư mục đang đứng ---
GOC_REPO = Path(__file__).resolve().parent.parent
FILE_XLSX = GOC_REPO / "60.xlsx"
THU_MUC_TAM = GOC_REPO / "du-lieu-tam"
THU_MUC_KET_QUA = GOC_REPO / "ket-qua"

CSV_GOC = THU_MUC_TAM / "goc.csv"
CSV_CHITIET = THU_MUC_TAM / "chitiet.csv"
CSV_DONG_SACH = THU_MUC_TAM / "dong-hang-sach.csv"
CSV_ROSTER = THU_MUC_TAM / "roster-sku.csv"
CSV_MAU_PHAN_TICH = THU_MUC_TAM / "mau-phan-tich-chinh.csv"
CSV_DONG_PHAN_TICH = THU_MUC_TAM / "dong-hang-phan-tich.csv"
CSV_LUONG_MAU = THU_MUC_KET_QUA / "bang-luong-mau.csv"
CSV_CHAN_DOAN_TYPE = THU_MUC_KET_QUA / "chan-doan-bien-type.csv"
FILE_MANIFEST = THU_MUC_KET_QUA / "manifest-tai-lap.json"

# --- Đặc tả khóa §3: bước 1 giữ dữ liệu từ đây để mọi cửa sổ độ nhạy chạy được ---
# KHÔNG lọc tháng 4 ở bước 1: cửa sổ `co_thang_4` cần nó. Cửa sổ áp ở bước 2.
NGAY_SOM_NHAT_GIU_LAI = "2025-04-01"

# --- Đặc tả khóa §5: phân loại sản phẩm để dựng ba định nghĩa đối chứng ---
# Danh sách CỐ ĐỊNH. Sửa danh sách này sau khi xem kết quả là vi phạm §12.
TU_KHOA_RUOU_BIA_THUOC = [
    "bia", "beer", "heineken", "tiger", "saigon", "budweiser", "corona",
    "asahi", "tsingtao", "sapporo", "hoegaarden", "leffe", "chimay", "sanwald",
    "strongbow", "somersby", "vodka", "whisky", "whiskey", "rum", "tequila",
    "brandy", "cognac", "rượu", "vang", "wine", "sake", "soju", "champagne",
    "prosecco", "jagermeister", "chivas", "ballantine", "absolut",
    "jack daniel", "johnnie", "macallan", "glenfiddich", "hennessy", "martell",
    "cocktail", "rio ", "smirnoff", "baileys", "aperol", "campari",
    "thuốc lá", "marlboro", "vinataba", "craven", "esse", "dunhill", "camel",
    "winston", "kent", "lucky strike", "pall mall",
    # Bổ sung 26/07: nhãn thuốc lá bỏ sót, phát hiện khi kiểm tra phần dư
    # chưa phân loại. Đây là sửa lỗi THIẾU SÓT theo định danh sản phẩm,
    # không phải điều chỉnh theo kết quả — xem §12.
    "555", "mevius", "điếu",
]
TU_KHOA_HOA_CHAT_CSCN = [
    "kem đánh răng", "kdr", "kđr", "bàn chải", "nước súc miệng", "son ",
    "sữa rửa mặt", "srm", "sữa tắm", "dầu gội", "dầu xả", "kem xả", "xà phòng",
    "xà bông", "nước rửa", "nước tẩy", "nước lau", "khăn ướt", "khăn lau",
    "băng vệ sinh", "dao cạo", "lưỡi dao", "bọt cạo", "khử mùi", "nước hoa",
    "mặt nạ", "kem chống nắng", "kcn", "dưỡng da", "dưỡng ẩm", "tẩy trang",
    "lột mụn", "dán mũi", "bấm mi", "tăm ", "bao cao su", "sáp thơm",
    "xịt thơm", "nước xả", "nxv", "bột giặt", "nước giặt", "keo ", "kéo ",
    "bút ", "vở ", "xkm",
    # Bổ sung 26/07 cùng lý do như trên: hàng tẩy rửa/CSCN bỏ sót
    "nước rửa chén", "nrc", "nước lau sàn", "nls", "viên giặt", "n.giặt",
    "xịt côn trùng", "bình xịt", "tẩy lông", "da chết", "khẩu trang",
    "nrt", "sữa uv", "bấm móng", "nước muối",
]

# --- Đặc tả khóa §5: ba định nghĩa đối chứng, bắt buộc báo cáo song song ---
DINH_NGHIA_DOI_CHUNG = {
    "DC-A": "C10 chỉ hàng rượu/bia/thuốc lá — thuế suất do luật cố định",
    "DC-B": "C10 bỏ hàng hóa chất nhận diện được",
    "DC-C": "C10 đầy đủ — lẫn SKU ở 10% do cửa hàng không cập nhật",
}

# --- Đặc tả khóa §6: cửa sổ thời gian ---
NGAY_CHINH_SACH = "2025-07-01"
CUA_SO_CHINH_BAT_DAU = "2025-05-01"      # tiền kỳ 05+06, hậu kỳ 07+08
CUA_SO_DO_NHAY = {
    "chinh":       ("2025-05-01", "2025-07-01"),   # (bắt đầu tiền kỳ, ngày cắt)
    "co_thang_4":  ("2025-04-01", "2025-07-01"),
    "hep_1_thang": ("2025-06-01", "2025-07-01"),
    "sau_doi_cho": ("2025-06-11", "2025-07-01"),
}

# --- Đặc tả khóa §10: suy diễn ---
SEED = 42
SO_LAN_BOOTSTRAP = 5000
ALPHA = 0.05
# log(1,08/1,10)*100 — mốc chuyển hoàn toàn, tính bằng điểm log ×100
import math
TAU_CHUYEN_HOAN_TOAN = math.log(1.08 / 1.10) * 100
BIEN_TOST = {"hep": 0.25, "rong": 0.50}   # nhân với |TAU|

# --- Đặc tả khóa §7: ngưỡng survivorship ---
NGUONG_TUAN_CHINH = 1
LUOI_NGUONG_TUAN = [1, 2, 3, 4, 5]

# --- Đặc tả khóa §9: phân tầng ---
# Nhãn mẫu so sánh chính — HỢP ĐỒNG với web/frontend/lib/hang-so-chinh-sach.ts
NHAN_MAU_SO_SANH_CHINH = "so sánh theo Z"

# Nhãn trục/mức của lưới độ nhạy — cũng là HỢP ĐỒNG với frontend.
# Frontend tra cứu bằng chuỗi khớp chính xác; lệch một ký tự thì ô số biến thành
# "—" mà không có lỗi nào được ném ra. `b6_ra_soat_ngon_ngu.kiem_tra_hop_dong_nhan`
# đối chiếu từng giá trị dưới đây với file hằng số của frontend VÀ với CSV đã ghi.
NHAN_DO_NHAY = {
    "chua_ro_truc": "23 SKU chưa rõ [ITT]",
    "chua_ro_co_so": "cơ sở (loại 23 SKU)",
    "chua_ro_z1": "gán tất cả Z=1",
    "chua_ro_z0": "gán tất cả Z=0",
}

# Số SKU nằm trong nhãn ở trên. Nhãn có con số gắn cứng, nên nếu bộ lọc đổi mà
# nhãn không đổi thì nhãn sẽ nói dối — b4 khẳng định lại con số này lúc chạy.
SO_SKU_CHUA_RO = 23

# Nhãn hiển thị của hai biến thể PP1-A. Đặt ở đây vì b4 GHI ra, b5 LỌC theo, và
# báo cáo/web ĐỌC — ba nơi phải khớp tuyệt đối. Bản trước ghép thẳng khóa dict
# ("tho"/"hiep_bien") vào nhãn, nên web hiện "PP1-A tho" trong khi báo cáo viết
# "PP1-A thô"; lúc sửa lại thì bộ lọc chuỗi cứng trong b5 rỗng và pipeline chết.
TEN_HIEN_THI_PP1A = {"tho": "PP1-A thô", "hiep_bien": "PP1-A hiệp biến"}

# Nhãn cho SKU mà mode thuế suất trong kỳ là HÒA giữa 8% và 10% — tức cửa hàng
# xuất cả hai mức với số lần bằng nhau, không xác định được mức nào là chính.
# b3 ghi nhãn này vào `eda-ma-tran-chuyen-thue.csv`, slide đọc lại để tách riêng
# nhóm đó ra khỏi phép đếm "đã chuyển sang 8%" — nên nó là HỢP ĐỒNG với frontend.
NHAN_VAT_HOA = "hòa 8/10"

SO_PHAN_VI_GIA = 5          # phân vị của pre_p. KHÔNG dùng `type` — xem §9
TOI_THIEU_SKU_MOI_TANG = 3

# --- Đặc tả khóa §2: schema bắt buộc ---
COT_CHUOI_GOC = ["soid", "ma_ncc_hddt", "daxoa", "diachi_ban", "nguoitao"]
COT_CHUOI_CHITIET = ["soid", "ma_hh_ct", "ten_hh_ct", "type"]
COT_SO_CHITIET = ["soluong_ct", "sotien_ct", "sotien_sauvat_ct", "tyle_vat_ct"]

# --- Con số kiểm chứng (đặc tả khóa §15) ---
KIEM_CHUNG = {
    "dong_chitiet_tho": 233996,
    "hoa_don_tho": 67562,
    "dong_sau_loc": 82109,
    "so_sku_roster": 2218,
    "so_sku_T": 153,
    "so_sku_C10": 157,
    "so_sku_C8": 1908,
    "so_sku_C10_ruou_bia_thuoc": 132,
    "so_sku_C10_hoa_chat": 15,
}


import re


def _bien_tu(tu_khoa):
    """Ghép từ khóa thành regex có BIÊN TỪ.

    Khớp chuỗi con thuần gây lỗi thật: 'esse' bắt "Cheese dessert",
    'camel' bắt "Camel Hazelnut Coffee", 'kéo ' bắt "phô mai kéo sợi".
    Sữa chua và cà phê bị xếp vào thuốc lá.
    """
    mau = "|".join(re.escape(k.strip()) for k in sorted(tu_khoa, key=len, reverse=True))
    return re.compile(rf"\b(?:{mau})\b", re.IGNORECASE)


RE_RUOU_BIA_THUOC = _bien_tu(TU_KHOA_RUOU_BIA_THUOC)
RE_HOA_CHAT_CSCN = _bien_tu(TU_KHOA_HOA_CHAT_CSCN)


def phan_loai_san_pham(ten_hang):
    """Phân loại theo định danh sản phẩm — đặc tả khóa §5.

    Dùng để dựng ba định nghĩa đối chứng. Danh sách từ khóa cố định trong
    file này; sửa nó sau khi xem kết quả là vi phạm §12.
    """
    t = str(ten_hang)
    if RE_RUOU_BIA_THUOC.search(t):
        return "ruou_bia_thuoc"
    if RE_HOA_CHAT_CSCN.search(t):
        return "hoa_chat"
    return "khong_ro"


def khang_dinh(dieu_kien, thong_diep):
    """Dừng ngay khi sai. Pipeline không được chạy tiếp bằng dữ liệu hỏng."""
    if not dieu_kien:
        raise AssertionError(f"KIỂM CHỨNG THẤT BẠI: {thong_diep}")


def tao_thu_muc():
    THU_MUC_TAM.mkdir(exist_ok=True)
    THU_MUC_KET_QUA.mkdir(exist_ok=True)
