"""Bước 6 — Rà soát ngôn ngữ và số liệu cũ trên TOÀN BỘ sản phẩm nộp.

Năm vòng phản biện trước soi thiết kế đang thay đổi. Script này soi thứ sẽ nộp.

Quét hai loại lỗi:
  1. CÂU CẤM — phát biểu vượt quá dữ liệu (đặc tả khóa §13)
  2. SỐ CŨ — con số từ các đặc tả đã bị thay thế

Rà bằng mắt sẽ bỏ sót. Đây là lý do script này tồn tại.
"""
import re
import sys
from pathlib import Path
import config_du_an as cf

# Thư mục cần quét — mọi thứ người chấm sẽ đọc
THU_MUC_QUET = ["bao-cao", "web/frontend/app", "web/frontend/components",
                "web/frontend/lib", "plans/2026-07-23-thue-gtgt-passthrough",
                # Kế hoạch nội dung slide: nó CHÉP câu chữ sẽ lên slide, nên phải
                # chịu đúng bộ quy tắc của slide. Không quét thì câu sai lọt từ
                # kế hoạch sang sản phẩm mà không ai chặn ở giữa.
                "plans/2026-07-31-noi-dung-slide-thuyet-trinh"]
DUOI_FILE = {".md", ".tsx", ".ts", ".jsx", ".js", ".html"}

# Các file CỐ Ý chứa câu cấm để định nghĩa chúng — không tính là vi phạm
FILE_MIEN_TRU = {"dac-ta-khoa.md", "phase-06-ra-soat-cuoi.md",
                 "b6_ra_soat_ngon_ngu.py"}

CAU_CAM = [
    (r"không\s+có\s+tác\s+động", "Không bác bỏ ≠ bằng 0"),
    (r"tác\s+động\s+bằng\s+0", "Không bác bỏ ≠ bằng 0"),
    (r"suýt\s+có\s+ý\s+nghĩa", "p-value không có ngưỡng 'suýt'"),
    (r"có\s+xu\s+hướng\s+giảm", "Diễn giải vượt quá KTC"),
    (r"gần\s+đạt\s+ý\s+nghĩa", "p-value không có ngưỡng 'gần'"),
    (r"xác\s+nhận\s+lẫn\s+nhau", "Hai phương pháp chung một chiến lược nhận dạng"),
    (r"xu\s+hướng\s+song\s+song\s+(đã\s+)?(đạt|được\s+chứng\s+minh|thỏa)",
     "Cổng 3 không đạt; cổng 1 trượt"),
    (r"giữ\s+lại\s+(phần\s+)?(giảm\s+thuế|thuế)", "Không có dữ liệu chi phí đầu vào"),
    (r"pass-through\s+bằng\s+0", "TOST không kết luận được"),
    (r"đã\s+xử\s+lý\s+ngụy\s+lặp", "Bất định cấp chính sách không ước lượng được"),
    (r"vững\s+trước\s+ngụy\s+lặp", "Bất định cấp chính sách không ước lượng được"),
    (r"chứng\s+minh\s+(được\s+)?nhân\s+quả", "Cổng cân bằng đã trượt"),
    (r"ngành\s+bán\s+lẻ\s+Việt\s+Nam", "Chỉ một cửa hàng — không ngoại suy"),
]

# Số của đặc tả đã bị thay thế. Bắt bằng biên từ để không dính số khác.
SO_CU = [
    # Chỉ bắt khi con số ĐỨNG CẠNH ngữ cảnh nhóm SKU — nếu không sẽ dính
    # "161/259 ngày" và mọi con số 156/161 vô can khác.
    (r"(?<![\d,./])156(?![\d,./])\s*SKU|T\s*=\s*156",
     "T=156 là đặc tả còn tháng 4 → nay 153"),
    (r"(?<![\d,./])161(?![\d,./])\s*SKU|C10\s*=\s*161",
     "C10=161 là đặc tả còn tháng 4 → nay 157"),
    (r"ĐC-A[^\n]{0,40}(?<![\d,./])123(?![\d,./])", "ĐC-A=123 → nay 132"),
    (r"ĐC-B[^\n]{0,40}(?<![\d,./])142(?![\d,./])", "ĐC-B=142 → nay 137"),
    (r"0,682", "ATT ĐC-A cũ (danh sách từ khóa thiếu) → nay −0,384"),
    # "MDE 87%" — nhưng KHÔNG bắt khoảng như "66–87%"
    (r"MDE[^\n]{0,20}(?<![\d–-])87\s*%",
     "MDE 87% là thiết kế theo D → nay 1,66–2,17 theo Z"),
    (r"(?<![\d,.])(1,491|1,928|1,823|1,473)(?![\d,.])",
     "Biên TOST tính bằng công thức SAI (chỉ đạt 60% sức mạnh) → nay 1,73–2,27"),
    (r"9\s*tầng|nhóm\s+hàng\s*×\s*phân\s+vị", "Thiết kế tầng cũ dùng `type` → nay 5 phân vị giá"),
]


# Một dòng CẤM cụm từ nào đó thì bản thân nó phải chứa cụm đó. Không phân biệt
# được "dùng" với "cấm" thì script sẽ báo động chính các câu cảnh báo của mình,
# và một script kêu oan sẽ bị bỏ qua.
LA_LOI_CAM = re.compile(
    r"không\s+được|không\s+nên|cấm|tránh|thay\s+bằng|sai\b|❌|🔴|⚠️"
    r"|đừng|chớ|không\s+phải|≠|thay\s+vì|đã\s+bỏ|đã\s+cắt|bẫy"
    r"|không\s+kết\s+luận|lyDo|ly_do|vì\s+sao", re.IGNORECASE)

# TSX không có tiêu đề markdown. Nhận diện khối liệt kê bằng tên hằng số.
KHOI_LIET_KE_TSX = re.compile(r"(CAU_CAM|BAY_|CAM_VIET|KHONG_DUOC)\s*[:=]")

# Kết quả giá phải luôn kèm điều kiện mẫu.
# CHỈ áp cho SẢN PHẨM NỘP. Các file trong plans/ là tài liệu làm việc ghi lại
# quá trình — quyết định đổi tên estimand đến ở phase 4, sau khi phase 3 đã
# viết xong, nên bắt lỗi chúng là sai thời điểm.
THU_MUC_SAN_PHAM = ("bao-cao", "frontend")
CAN_KEM_DIEU_KIEN = re.compile(r"\bITT\b")

# "[ITT]" trong ngoặc vuông là hậu tố NHÃN của cột `truc` trong kq-do-nhay.csv
# ("23 SKU chưa rõ [ITT]"), không phải câu khẳng định về estimand. Văn xuôi luôn
# viết "ITT" trần. Bỏ token này trước khi soi, nếu không thì chính file hằng số
# giữ hợp đồng nhãn lại bị báo lỗi — và cách "sửa" duy nhất là đổi nhãn cho khác
# pipeline, tức phá đúng thứ nó sinh ra để bảo vệ.
NHAN_ITT_TRONG_NGOAC = re.compile(r"\[ITT\]")
DAU_HIEU_DIEU_KIEN = re.compile(
    r"sống\s+sót|có\s+giá\s+quan\s+sát|điều\s+kiện\s+mẫu|cả\s+hai\s+kỳ|có\s+điều\s+kiện")

# Một dòng nhắc số cũ mà ĐÃ tự đính chính thì không phải vi phạm — đó là ghi
# chép lịch sử trung thực, thứ đồ án này cố ý giữ lại.
DA_DINH_CHINH = re.compile(
    r"lúc\s+mới\s+khảo\s+sát|đặc\s+tả\s+(khóa\s+)?(sau\s+này|cũ)|con\s+số\s+cũ"
    r"|→\s*nay|thiết\s+kế\s+theo\s+`?D`?|bản\s+(đầu|trước)|đã\s+sửa|vòng\s+phản\s+biện"
    r"|dùng\s+lại|KHÔNG\s+(dùng|tái\s+sử\s+dụng)|cấm|tính\s+lại")


MUC_LIET_KE_CAM = re.compile(
    r"không\s+được\s+viết|câu\s+cấm|bẫy|phải\s+tránh|nên\s+bỏ|đã\s+cắt",
    re.IGNORECASE)


def quet_file(p: Path):
    vi_pham = []
    try:
        noi_dung = p.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return vi_pham
    dong = noi_dung.splitlines()
    trong_muc_liet_ke = False
    for i, d in enumerate(dong, 1):
        # Theo dõi tiêu đề: một mục tên "Không được viết" thì cả mục đó là
        # danh sách trích dẫn, không phải khẳng định.
        if d.lstrip().startswith("#"):
            trong_muc_liet_ke = bool(MUC_LIET_KE_CAM.search(d))
        if KHOI_LIET_KE_TSX.search(d):
            trong_muc_liet_ke = True
        elif trong_muc_liet_ke and p.suffix in {".tsx", ".ts"} and d.rstrip() in ("];", "]"):
            trong_muc_liet_ke = False
        if trong_muc_liet_ke:
            continue
        for mau, ly_do in CAU_CAM:
            if re.search(mau, d, re.IGNORECASE):
                # Xét cả dòng trước và sau: câu cảnh báo hay bị ngắt dòng
                quanh_cam = " ".join(dong[max(0, i - 2):i + 1])
                if LA_LOI_CAM.search(quanh_cam):
                    continue    # đang CẤM cụm đó, không phải đang DÙNG nó
                vi_pham.append(("CÂU CẤM", p, i, d.strip()[:88], ly_do))
        for mau, ly_do in SO_CU:
            if re.search(mau, d, re.IGNORECASE):
                quanh = " ".join(dong[max(0, i - 2):i + 2])
                if DA_DINH_CHINH.search(quanh):
                    continue        # đã tự đính chính — ghi chép lịch sử hợp lệ
                vi_pham.append(("SỐ CŨ", p, i, d.strip()[:88], ly_do))
        # "ITT" phải có dấu hiệu điều kiện mẫu trong phạm vi ±2 dòng
        d_van_xuoi = NHAN_ITT_TRONG_NGOAC.sub("", d)
        if CAN_KEM_DIEU_KIEN.search(d_van_xuoi) and any(x in p.parts for x in THU_MUC_SAN_PHAM):
            quanh = "\n".join(dong[max(0, i - 3):i + 2])
            if not DAU_HIEU_DIEU_KIEN.search(quanh):
                vi_pham.append(("ITT THIẾU ĐIỀU KIỆN", p, i, d.strip()[:88],
                                "Mẫu đã điều kiện hóa sống sót — phải ghi rõ"))
    return vi_pham


def kiem_tra_hai_con_so_871(goc: Path):
    """87,1% làm tròn và 87,1% tuân thủ trùng NGẪU NHIÊN — không được đứng gần nhau."""
    canh_bao = []
    for p in goc.rglob("*"):
        if p.suffix.lower() not in DUOI_FILE or not p.is_file():
            continue
        if any(x in p.parts for x in ("node_modules", ".next", "__pycache__")):
            continue
        try:
            dong = p.read_text(encoding="utf-8").splitlines()
        except (UnicodeDecodeError, OSError):
            continue
        vi_tri = [i for i, d in enumerate(dong) if re.search(r"87[,.]1\s*%", d)]
        for a in range(len(vi_tri)):
            for b in range(a + 1, len(vi_tri)):
                if vi_tri[b] - vi_tri[a] <= 15:
                    canh_bao.append((p, vi_tri[a] + 1, vi_tri[b] + 1))
    return canh_bao


# Mỗi dòng: (tên hằng phía frontend, giá trị pipeline, CSV phải chứa giá trị đó).
# Frontend lọc dữ liệu bằng chuỗi khớp chính xác, nên lệch một ký tự là ô số biến
# thành "—" hoặc biểu đồ rỗng — không ngoại lệ, không log, không ai biết.
HOP_DONG_NHAN = [
    ("MAU_SO_SANH_CHINH", cf.NHAN_MAU_SO_SANH_CHINH, "kq-theo-tang.csv"),
    # Nhãn phương pháp: b5 lọc `kq-mde-va-suc-manh.csv` theo đúng chuỗi này.
    # Đã hỏng một lần khi đổi "PP1-A hiep_bien" → "PP1-A hiệp biến" — bộ lọc
    # rỗng và pipeline chết ở `.iloc[0]`. Kiểm ba chiều để không tái diễn.
    ("TEN_PP1A_THO", cf.TEN_HIEN_THI_PP1A["tho"], "kq-uoc-luong-chinh.csv"),
    ("TEN_PP1A_HIEP_BIEN", cf.TEN_HIEN_THI_PP1A["hiep_bien"], "kq-uoc-luong-chinh.csv"),
    ("DO_NHAY_CHUA_RO_TRUC", cf.NHAN_DO_NHAY["chua_ro_truc"], "kq-do-nhay.csv"),
    ("DO_NHAY_CHUA_RO_CO_SO", cf.NHAN_DO_NHAY["chua_ro_co_so"], "kq-do-nhay.csv"),
    ("DO_NHAY_CHUA_RO_Z1", cf.NHAN_DO_NHAY["chua_ro_z1"], "kq-do-nhay.csv"),
    ("DO_NHAY_CHUA_RO_Z0", cf.NHAN_DO_NHAY["chua_ro_z0"], "kq-do-nhay.csv"),
    # Slide "Quan sát sơ bộ" tách nhóm hòa ra khỏi phép đếm "đã chuyển sang 8%".
    # Nhãn lệch ⇒ nhóm hòa lọt vào phần còn lại và tỉ lệ trên slide sai âm thầm.
    ("NHAN_VAT_HOA", cf.NHAN_VAT_HOA, "eda-ma-tran-chuyen-thue.csv"),
]


def kiem_tra_hop_dong_nhan(goc: Path):
    """Mọi nhãn frontend lọc theo phải khớp pipeline VÀ có thật trong CSV.

    Đã hỏng hai lần theo đúng kịch bản này. Lần một: pipeline đổi "ITT Z" thành
    "so sánh theo Z", frontend vẫn lọc chuỗi cũ → biểu đồ rỗng. Lần hai: frontend
    tra "23 SKU chưa phân loại"/"loại (cơ sở)" trong khi pipeline ghi
    "23 SKU chưa rõ [ITT]"/"cơ sở (loại 23 SKU)" → câu mở đầu trang chủ hiện "—".

    Cả hai lần đều không ném lỗi. Kiểm tra ba chiều: hằng số frontend ↔ hằng số
    pipeline ↔ dữ liệu đã ghi. Thiếu chiều thứ ba thì hai bên vẫn khớp nhau trong
    khi cùng sai so với CSV.
    """
    fe = goc / "web/frontend/lib/hang-so-chinh-sach.ts"
    if not fe.exists():
        return []
    noi_fe = fe.read_text(encoding="utf-8")
    van_de = []
    for ten, gia_tri, ten_csv in HOP_DONG_NHAN:
        m = re.search(rf'{ten}\s*=\s*"([^"]+)"', noi_fe)
        if not m:
            van_de.append((f"frontend không khai báo {ten}",))
            continue
        if m.group(1) != gia_tri:
            van_de.append((f'LỆCH {ten}: pipeline ghi "{gia_tri}" '
                           f'nhưng frontend lọc "{m.group(1)}"',))
            continue
        f = goc / "ket-qua" / ten_csv
        if f.exists() and gia_tri not in f.read_text(encoding="utf-8"):
            van_de.append((f'{ten}: nhãn "{gia_tri}" không có trong {ten_csv}',))
    return van_de


def chay():
    goc = cf.GOC_REPO
    tat_ca = []
    so_file = 0
    for tm in THU_MUC_QUET:
        d = goc / tm
        if not d.exists():
            print(f"  ⚠️  chưa có: {tm}")
            continue
        for p in d.rglob("*"):
            if (p.suffix.lower() in DUOI_FILE and p.is_file()
                    and p.name not in FILE_MIEN_TRU
                    and not any(x in p.parts for x in ("node_modules", ".next"))):
                so_file += 1
                tat_ca.extend(quet_file(p))

    print("=" * 78)
    print(f"RÀ SOÁT NGÔN NGỮ — quét {so_file} file")
    print("=" * 78)
    if not tat_ca:
        print("  ✅ Không phát hiện câu cấm hay số của đặc tả cũ.")
    else:
        for loai in ("CÂU CẤM", "SỐ CŨ", "ITT THIẾU ĐIỀU KIỆN"):
            nhom = [v for v in tat_ca if v[0] == loai]
            if not nhom:
                continue
            print(f"\n  🔴 {loai} — {len(nhom)} chỗ:")
            for _, p, i, d, ly_do in nhom[:25]:
                print(f"    {p.relative_to(goc)}:{i}")
                print(f"      {d}")
                print(f"      → {ly_do}")
            if len(nhom) > 25:
                print(f"    … và {len(nhom)-25} chỗ nữa")

    print("\n" + "=" * 78)
    print("KIỂM TRA HAI CON SỐ 87,1% (trùng ngẫu nhiên — không được đứng gần nhau)")
    print("=" * 78)
    cb = kiem_tra_hai_con_so_871(goc)
    if not cb:
        print("  ✅ Không có chỗ nào hai con số 87,1% cách nhau dưới 15 dòng.")
    else:
        for p, a, b in cb:
            print(f"  🔴 {p.relative_to(goc)}: dòng {a} và {b}")
            print("     Một là mô phỏng làm tròn, một là tỉ lệ tuân thủ — hai tập SKU KHÁC nhau")

    print("\n" + "=" * 78)
    print("HỢP ĐỒNG NHÃN giữa pipeline và frontend")
    print("=" * 78)
    hd = kiem_tra_hop_dong_nhan(goc)
    if not hd:
        for ten, gia_tri, _ in HOP_DONG_NHAN:
            print(f'  ✅ {ten} = "{gia_tri}"')
    else:
        for (msg,) in hd:
            print(f"  🔴 {msg}")

    tong = len(tat_ca) + len(cb) + len(hd)
    print("\n" + "=" * 78)
    print(f"TỔNG: {tong} vấn đề cần xử lý" if tong else "TỔNG: sạch")
    return tong == 0


if __name__ == "__main__":
    sys.exit(0 if chay() else 1)
