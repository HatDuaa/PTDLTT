"use client";

/**
 * Trang Trình bày — bản trình chiếu cho buổi báo cáo.
 *
 * Mạch: đặt vấn đề → dữ liệu → ĐO CÁI GÌ → ĐO RA CÁI GÌ → VÌ SAO CHƯA DÙNG
 * THẲNG ĐƯỢC → khung phương pháp → đồ thị nhân quả → gắn biến → bốn cách ước
 * lượng → kiểm tra thiết kế → kết quả → hai cách đọc → kiểm chứng bổ sung →
 * hạn chế → kết luận.
 *
 * Ba slide 8–10 là phần bổ sung quan trọng nhất so với bản trước. Không có
 * chúng, bốn cách ước lượng treo lơ lửng: người nghe không biết con số gốc là
 * bao nhiêu và bốn phương pháp đang sửa vấn đề gì. Cụ thể chúng chặn ba hiểu
 * nhầm đã xảy ra thật khi trình bày thử:
 *   · "−0,398" bị đọc thành "giá giảm 0,4%" — thực tế giá CẢ HAI nhóm đều tăng
 *   · "±0,6" xuất hiện mà không ai biết từ đâu ra
 *   · "22% chuyển thuế" mâu thuẫn với "giá tăng" nếu không nói gốc so sánh
 *
 * Mỗi phương pháp một slide. Sai số chuẩn KHÔNG có slide riêng — nó là thuộc
 * tính của từng ước lượng, nên gắn vào đúng chỗ: công thức ở cách 1, nghịch lý
 * "thêm biến mà sai số tăng" ở cách 2, bootstrap ở cách 4.
 *
 * Nhãn vai trò (chính / chẩn đoán / cơ học) KHÔNG hiện ở chân slide: trên máy
 * chiếu đó là dòng chữ nhỏ không ai đọc mà lại chiếm chỗ. Ý nghĩa của nó nói
 * thẳng trong tiêu đề và câu chốt. Web và báo cáo vẫn giữ nhãn đầy đủ.
 *
 * Số liệu lấy qua hook dùng chung với các trang phân tích; file này không giữ
 * bản sao kết quả riêng. Kế hoạch nội dung:
 * `plans/2026-07-31-noi-dung-slide-thuyet-trinh/`.
 */
import Image from "next/image";
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { KhungTrinhChieu, Slide } from "@/components/slide/khung-trinh-chieu";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { ThanhTiLe } from "@/components/site/thanh-ti-le";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import {
  useBamChuan,
  useChanDoanHiepBien,
  useCongChanDoan,
  useEda,
  useHeSoMoHinh,
  useLamTron,
  useLuongMau,
  useManifest,
  useMoTaYTheoNhom,
  useTheoTang,
  useUocLuongChinh,
} from "@/lib/hooks";
import {
  MOC_CHUYEN_HOAN_TOAN,
  MAU_SO_SANH_CHINH,
  NHAN_VAT_HOA,
  TEN_PP1A_HIEP_BIEN,
  TEN_PP1A_THO,
  THUE_SUAT_SAU_CHINH_SACH,
  THUE_SUAT_TRUOC_CHINH_SACH,
} from "@/lib/hang-so-chinh-sach";
import {
  dinhDangDiemLog,
  dinhDangPhanTram,
  dinhDangSo,
  dinhDangSoNguyen,
} from "@/lib/format";
import type {
  ChanDoanHiepBienRow,
  EdaDoPhuThangRow,
  EdaMaTranChuyenTheRow,
  HeSoMoHinhRow,
  LuongMauRow,
  TenMoHinh,
  TheoTangRow,
  UocLuongChinhRow,
} from "@/lib/types";

const TONG = 25;

/**
 * Thông tin hành chính trên slide bìa — KHÔNG phải kết quả phân tích, nên gõ
 * tay ở đây là đúng chỗ. Điền vào rồi lưu là slide tự cập nhật.
 *
 * Danh sách thành viên tách riêng khỏi bảng chung: bốn cặp tên–mã số nhồi vào
 * một ô sẽ tràn ngang bìa. Xếp thành cột riêng thì đọc được cả trên máy chiếu.
 */
const THONG_TIN_NHOM: { nhan: string; gt: string }[] = [
  { nhan: "Môn học", gt: "Phân tích dữ liệu thông minh" },
  // Trang cá nhân fit.hcmus.edu.vn/~btlen ghi "Dr. BUI TIEN LEN", chức danh
  // Senior Lecturer — không có dấu hiệu phó giáo sư, nên ghi TS. chứ không PGS.TS.
  { nhan: "Giảng viên", gt: "TS. Bùi Tiến Lên" },
];

const THANH_VIEN: { ten: string; mssv: string }[] = [
  { ten: "Nguyễn Đình Lộc", mssv: "25C11050" },
  { ten: "Dương Tiến Vinh", mssv: "24C11034" },
  { ten: "Phạm Thị Chiều", mssv: "24C12003" },
  { ten: "Lê Hoàng Nhân", mssv: "24C11044" },
];

function Y({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-foreground/60" />
      <span>{children}</span>
    </li>
  );
}

function DanhSach({ children }: { children: React.ReactNode }) {
  return <ul className="grid gap-[1.4vh] leading-snug">{children}</ul>;
}

/** Khối công thức / phép tính. Dùng chung để mọi slide có cùng một hình thức. */
function KhoiCongThuc({ children, canGiua = false }: { children: React.ReactNode; canGiua?: boolean }) {
  return (
    <div className={`rounded-md border bg-muted/40 p-3 font-mono text-sm ${canGiua ? "text-center" : ""}`}>
      {children}
    </div>
  );
}

/**
 * Bảng ước lượng · sai số chuẩn · khoảng tin cậy · p cho MỘT phương pháp.
 *
 * Dùng chung ở cả bốn slide phương pháp. Bản trước mỗi slide tự bày một kiểu —
 * chỗ thì con số to, chỗ thì gạch đầu dòng — nên lật qua lại rất khó so sánh
 * bốn cách với nhau, mà so sánh chính là việc người nghe cần làm.
 */
function BangMotUocLuong({ h }: { h: UocLuongChinhRow }) {
  return (
    <BangDuLieu<{ muc: string; gt: string }>
      cot={[{ khoa: "muc", nhan: "Chỉ số" }, { khoa: "gt", nhan: "Giá trị" }]}
      hang={[
        { muc: "Ước lượng", gt: `${dinhDangSo(h.uoc_luong, 3)} ${DON_VI_DIEM_LOG}` },
        { muc: "Sai số chuẩn", gt: dinhDangSo(h.se, 3) },
        { muc: "KTC 95%", gt: `[${dinhDangSo(h.ktc_duoi, 3)} · ${dinhDangSo(h.ktc_tren, 3)}]` },
        { muc: "p", gt: dinhDangSo(h.p, 3) },
      ]}
    />
  );
}

const DON_VI_DIEM_LOG = "điểm log ×100";

/** Tên đọc được của ba hiệp biến. Khóa khớp cột `bien` của kq-he-so-mo-hinh.csv. */
const NHAN_BIEN: Record<string, string> = {
  chan: "hệ số chặn β₀",
  Z: "Z → β₁",
  log_pre_p: "log giá nền",
  log1p_pre_q: "log(1 + sức bán nền)",
  pre_w: "số tuần bán",
};

const nhanBien = (b: string) => NHAN_BIEN[b] ?? b;

/** Tra một hệ số. Trả `undefined` nếu pipeline đổi tên — gọi phải tự phòng. */
function layHeSo(hang: HeSoMoHinhRow[], moHinh: TenMoHinh, bien: string) {
  return hang.find((h) => h.mo_hinh === moHinh && h.bien === bien)?.he_so;
}

/** Tra một chỉ số chẩn đoán theo tên. */
function layChiSo(hang: ChanDoanHiepBienRow[], chiSo: string) {
  return hang.find((h) => h.chi_so === chiSo)?.gia_tri;
}

function thangGon(t: string) {
  const [nam, thang] = t.split("-");
  return `${thang}/${nam}`;
}

/**
 * Nhãn thuế suất đúng như pipeline ghi vào `eda-ma-tran-chuyen-thue.csv`.
 *
 * `b3_eda.py` sinh nhãn bằng `f"{int(v)}%"`, tức "10%" / "8%" không có khoảng
 * trắng. KHÔNG dùng `dinhDangPhanTram` ở đây: hàm đó định dạng cho người đọc và
 * có thể chèn khoảng trắng không ngắt, đủ để phép so chuỗi trượt âm thầm.
 * Cũng không nhân trực tiếp `0.1 * 100` vì trong JS ra 10.000000000000002.
 */
function nhanThue(tiLe: number) {
  return `${Math.round(tiLe * 100)}%`;
}

/** Đổi điểm log ×100 sang phần trăm giá, để nói "≈0,4%" cạnh "−0,398". */
function phanTramTuDiemLog(diem: number, soLe = 1) {
  return dinhDangPhanTram(Math.abs(Math.expm1(diem / 100)), soLe);
}

export default function TrangTrinhBay() {
  const uocLuong = useUocLuongChinh();
  const bamChuan = useBamChuan();
  const lamTron = useLamTron();
  const luongMau = useLuongMau();
  const manifest = useManifest();
  const theoTang = useTheoTang();
  const congChanDoan = useCongChanDoan();
  const moTaY = useMoTaYTheoNhom();
  const heSo = useHeSoMoHinh();
  const chanDoanHB = useChanDoanHiepBien();
  const doPhu = useEda("do-phu-theo-thang");
  const maTran = useEda("ma-tran-chuyen-thue");
  const moTaNen = useEda("mo-ta-nen-theo-nhom");

  const truoc = dinhDangPhanTram(THUE_SUAT_TRUOC_CHINH_SACH, 0);
  const sau = dinhDangPhanTram(THUE_SUAT_SAU_CHINH_SACH, 0);
  const mucGiamLeRa = phanTramTuDiemLog(MOC_CHUYEN_HOAN_TOAN);
  // Phần thuế quy ra tiền trên hai mức giá điển hình — dùng ở slide phân tầng để
  // cho thấy vì sao giá nền là biến gây nhiễu chứ không phải chi tiết kỹ thuật.
  const tiLeGiam = Math.abs(Math.expm1(MOC_CHUYEN_HOAN_TOAN / 100));
  const giamTrenHangRe = Math.round(10_000 * tiLeGiam);
  const giamTrenHangDat = Math.round(100_000 * tiLeGiam);

  return (
    <div className="grid gap-4">
      <header className="grid gap-1 print:hidden">
        <h1 className="text-2xl font-semibold">Trình bày</h1>
        <p className="text-muted-foreground">
          Bấm <strong>Trình chiếu</strong> để phóng toàn màn hình, hoặc dùng phím ← → để chuyển
          slide. Mọi con số lấy trực tiếp từ pipeline nên không lệch với báo cáo.
        </p>
      </header>

      <KhungTrinhChieu tong={TONG}>
        <Slide so={1} tieuDe="Đồ án cuối kỳ — Phân tích dữ liệu thông minh">
          <div className="flex h-full flex-col justify-between gap-[3vh]">
            <div className="flex flex-1 flex-col justify-center gap-[2vh]">
              <p className="text-balance font-semibold"
                 style={{ fontSize: "clamp(1.4rem, 3.2vw, 3rem)", lineHeight: 1.2 }}>
                Chính sách giảm thuế GTGT của Nhà nước có thật sự tác động tới giá
                người tiêu dùng phải trả không?
              </p>
              <p className="text-muted-foreground">
                Dữ liệu hóa đơn điện tử của một cửa hàng tiện lợi tại TP.HCM.
              </p>
            </div>
            <div className="grid gap-[2vh] text-sm text-muted-foreground sm:grid-cols-2">
              <dl className="grid gap-1 self-end">
                {THONG_TIN_NHOM.map(({ nhan, gt }) => (
                  <div key={nhan} className="flex gap-2">
                    <dt className="min-w-24 shrink-0">{nhan}</dt>
                    <dd className={gt ? "text-foreground" : "italic"}>{gt || "(chưa điền)"}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid gap-1">
                <p className="font-medium text-foreground">Nhóm 5</p>
                <ul className="grid gap-0.5">
                  {THANH_VIEN.map(({ ten, mssv }) => (
                    <li key={mssv} className="flex gap-2">
                      <span className="text-foreground">{ten}</span>
                      <span className="tabular-nums">{mssv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Slide>

        <Slide so={2} tieuDe="Đặt vấn đề"
               chot="Giảm thuế chỉ hỗ trợ được người mua nếu phần thuế bớt đi thật sự đi vào giá bán lẻ.">
          <div className="grid gap-[2.2vh] leading-relaxed">
            <p className="font-medium">
              Từ 01/07 Nhà nước ra chính sách giảm thuế VAT {truoc} → {sau}. Nhưng người tiêu
              dùng có thực sự được hưởng lợi từ việc đó — giá bán lẻ thực sự được giảm, hay
              cửa hàng vẫn giữ nguyên giá cũ, không thay đổi?
            </p>
            <DanhSach>
              <Y>Nhà nước quyết định <strong>thuế suất</strong>. Cửa hàng quyết định <strong>giá trên kệ</strong>.</Y>
              <Y>Hai quyết định đó độc lập với nhau, nên câu trả lời không hiển nhiên.</Y>
              <Y>Đây là bài toán <strong>nhân quả</strong>: phải tách phần do chính sách khỏi mọi thứ khác cùng thay đổi.</Y>
            </DanhSach>
          </div>
        </Slide>

        <Slide so={3} tieuDe="Dữ liệu"
               chot="Hóa đơn điện tử cấp dòng — đủ chi tiết để theo dõi từng mặt hàng qua thời gian.">
          <TrangThaiDuLieu dangTai={manifest.dangTai || luongMau.dangTai}
                           loi={manifest.loi ?? luongMau.loi}
                           duLieu={manifest.duLieu && luongMau.duLieu
                             ? { m: manifest.duLieu, l: luongMau.duLieu } : undefined}
                           chieuCaoTai="h-56">
            {({ m, l }) => (
              <div className="grid gap-[2vh]">
                <BangDuLieu<{ muc: string; gt: string }>
                  cot={[{ khoa: "muc", nhan: "Hạng mục" }, { khoa: "gt", nhan: "Nội dung" }]}
                  hang={[
                    { muc: "Nguồn", gt: "Toàn bộ hóa đơn điện tử bán ra của một cửa hàng tiện lợi tại TP.HCM, trích từ phần mềm kế toán" },
                    { muc: "Đơn vị quan sát", gt: "Một dòng = một mặt hàng trên một hóa đơn" },
                    { muc: "Quy mô ban đầu", gt: `${dinhDangSoNguyen(l[0]?.dong_vao ?? 0)} dòng hàng` },
                    { muc: "Cửa sổ phân tích", gt: `Từ ${m.tham_so.cua_so_chinh_bat_dau}; ngày chính sách ${m.tham_so.ngay_chinh_sach}` },
                    { muc: "Các trường dùng", gt: "Ngày bán · mã vạch · tên hàng · số lượng · tiền trước và sau VAT · thuế suất · địa chỉ cửa hàng" },
                  ]}
                />
                <p className="text-sm text-muted-foreground">
                  Thuế suất ghi ngay trên từng dòng hóa đơn. Đây là điều cho phép biết chính xác
                  mặt hàng nào đã được áp mức thuế mới.
                </p>
              </div>
            )}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={4} tieuDe="Xử lý dữ liệu"
               chot="Dữ liệu được xử lý theo từng bước; mỗi bước ghi rõ quy tắc lọc và số dòng còn lại.">
          <TrangThaiDuLieu dangTai={luongMau.dangTai} loi={luongMau.loi} duLieu={luongMau.duLieu}
                           chieuCaoTai="h-56">
            {(hang) => (
              <BangDuLieu<LuongMauRow>
                cot={[
                  { khoa: "buoc", nhan: "#" },
                  { khoa: "quy_tac", nhan: "Quy tắc lọc" },
                  { khoa: "dong_ra", nhan: "Còn lại", dinhDang: (h) => dinhDangSoNguyen(h.dong_ra) },
                  { khoa: "mat", nhan: "Mất", dinhDang: (h) => dinhDangSoNguyen(h.mat) },
                ]}
                hang={hang}
              />
            )}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={5} tieuDe="Phân bổ dữ liệu theo thời gian"
               chot="Nhóm rà độ phủ dữ liệu theo từng tháng, rồi chọn cửa sổ phân tích dựa trên kết quả rà.">
          <TrangThaiDuLieu dangTai={doPhu.dangTai} loi={doPhu.loi} duLieu={doPhu.duLieu}
                           chieuCaoTai="h-56">
            {(hang) => (
              <div className="grid gap-[1.8vh]">
                <BangDuLieu<EdaDoPhuThangRow>
                  cot={[
                    { khoa: "thang", nhan: "Tháng", dinhDang: (h) => thangGon(h.thang) },
                    { khoa: "so_ngay_co_du_lieu", nhan: "Số ngày có dữ liệu" },
                    { khoa: "so_hoa_don", nhan: "Hóa đơn", dinhDang: (h) => dinhDangSoNguyen(h.so_hoa_don) },
                    { khoa: "ti_le_co_ma_vach", nhan: "% có mã vạch", dinhDang: (h) => `${dinhDangSo(h.ti_le_co_ma_vach, 0)}%` },
                  ]}
                  hang={hang}
                />
                <DanhSach>
                  <Y>Mã vạch chỉ được điền từ 21/04/2025; trước đó không định danh được mặt hàng.</Y>
                  <Y>Đứt đoạn dài 13/03 → 20/04, và mất thêm 02/06 → 10/06.</Y>
                </DanhSach>
              </div>
            )}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={6} tieuDe="Đánh giá sơ bộ dữ liệu"
               chot="Đếm thuế suất ghi trên hóa đơn của từng mặt hàng, trước và sau ngày chính sách.">
          <TrangThaiDuLieu dangTai={maTran.dangTai} loi={maTran.loi} duLieu={maTran.duLieu}
                           chieuCaoTai="h-48">
            {(hang) => {
              const nhanTruoc = nhanThue(THUE_SUAT_TRUOC_CHINH_SACH);
              const nhanSau = nhanThue(THUE_SUAT_SAU_CHINH_SACH);
              const tu10 = hang.filter((h) => h.tien === nhanTruoc);
              const tong10 = tu10.reduce((s, h) => s + h.so_sku, 0);
              const daChuyen = tu10.find((h) => h.hau === nhanSau)?.so_sku ?? 0;
              const conHoa = tu10.find((h) => h.hau === NHAN_VAT_HOA)?.so_sku ?? 0;
              return (
                <div className="grid gap-[1.8vh]">
                  <BangDuLieu<EdaMaTranChuyenTheRow>
                    cot={[
                      { khoa: "tien", nhan: "Thuế suất trước 01/07" },
                      { khoa: "hau", nhan: "Thuế suất sau 01/07" },
                      { khoa: "so_sku", nhan: "Số mặt hàng", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
                    ]}
                    hang={hang}
                    chuThich={`«${NHAN_VAT_HOA}»: sau 01/07 cửa hàng xuất cả hai mức với số lần bằng nhau, `
                      + `nên không xác định được mức nào là chính. Nhóm ${nhanSau}→${nhanSau} đông nhất `
                      + `nhưng phần lớn là mặt hàng chưa phân loại được theo luật, nên không dùng làm đối chứng.`}
                  />
                  {tong10 > 0 && (
                    <ThanhTiLe
                      nhan={`Mặt hàng còn ghi ${nhanTruoc} trước 01/07 và đã chuyển sang ${nhanSau}`}
                      tuSo={daChuyen} mauSo={tong10} noiBat
                      ghiChu={`Còn lại ${dinhDangSoNguyen(tong10 - daChuyen - conHoa)} mặt hàng vẫn ghi `
                        + `${nhanTruoc}, và ${dinhDangSoNguyen(conHoa)} mặt hàng thuộc nhóm hòa.`}
                    />
                  )}
                  <DanhSach>
                    <Y>Đây mới là mô tả: nó chưa tách được phần thay đổi do chính sách khỏi những thay đổi khác cùng thời điểm.</Y>
                    <Y>Để chứng minh chính xác, nhóm đề xuất một khung phương pháp nhân quả và bốn cách ước lượng.</Y>
                  </DanhSach>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={7} tieuDe="Cơ sở pháp lý — nguồn của thí nghiệm tự nhiên"
               chot="Luật giảm thuế cho nhóm này nhưng loại trừ nhóm kia. Chính điều đó tạo ra nhóm đối chứng.">
          <div className="grid gap-[2vh]">
            <BangDuLieu<{ muc: string; gt: string }>
              cot={[{ khoa: "muc", nhan: "Mốc" }, { khoa: "gt", nhan: "Nội dung" }]}
              hang={[
                { muc: "Trước 01/07/2025", gt: `Nghị quyết 174/2024/QH15 — thuế suất ${truoc}` },
                { muc: "Từ 01/07/2025", gt: `Nghị quyết 204/2025/QH15 — hạ xuống ${sau}` },
                { muc: "Được giảm", gt: "Hàng tiêu dùng thông thường: hóa chất tẩy rửa, mỹ phẩm, đồ gia dụng…" },
                { muc: "Bị loại trừ", gt: "Hàng chịu thuế tiêu thụ đặc biệt: rượu, bia, thuốc lá — giữ nguyên thuế suất" },
              ]}
            />
            <DanhSach>
              <Y>Quyết định do <strong>Quốc hội</strong> ban hành, không do cửa hàng, nên nó ngoại sinh với hành vi định giá.</Y>
              <Y>Nhóm bị loại trừ trở thành <strong>nhóm đối chứng tự nhiên</strong>: cùng cửa hàng, cùng thời gian, chỉ khác ở chỗ không được giảm thuế.</Y>
            </DanhSach>
          </div>
        </Slide>

        <Slide so={8} tieuDe="Đại lượng cần đo"
               chot="Mỗi mặt hàng cho một con số duy nhất: giá sau so với giá trước, tính bằng log.">
          <TrangThaiDuLieu dangTai={moTaY.dangTai} loi={moTaY.loi} duLieu={moTaY.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => {
              const z1 = hang.find((h) => h.Z === 1);
              const z0 = hang.find((h) => h.Z === 0);
              if (!z1 || !z0) return null;
              return (
                <div className="grid gap-[1.8vh]">
                  <KhoiCongThuc canGiua>
                    Y = 100 × log( giá sau / giá trước )
                  </KhoiCongThuc>
                  <BangDuLieu<{ th: string; tr: string; s: string; y: string }>
                    cot={[
                      { khoa: "th", nhan: "Trường hợp" },
                      { khoa: "tr", nhan: "Giá trước" },
                      { khoa: "s", nhan: "Giá sau" },
                      { khoa: "y", nhan: "Y" },
                    ]}
                    hang={[
                      { th: "Giữ nguyên giá", tr: "50.000đ", s: "50.000đ", y: "0" },
                      { th: "Giảm 1.000đ", tr: "50.000đ", s: "49.000đ", y: "−2,02" },
                      { th: "Tăng 2.000đ", tr: "50.000đ", s: "52.000đ", y: "+3,92" },
                    ]}
                    chuThich={`Đơn vị gọi là ${DON_VI_DIEM_LOG}, xấp xỉ phần trăm khi giá trị nhỏ.`}
                  />
                  <DanhSach>
                    <Y>
                      <strong>Vì sao dùng log thay vì phần trăm.</strong> Log đối xứng: tăng rồi
                      giảm cùng một lượng thì về đúng chỗ cũ. Phần trăm thì không — tăng 10% rồi
                      giảm 10% ra 99%.
                    </Y>
                    <Y>
                      <strong>Đơn vị phân tích là mặt hàng</strong>, không phải hóa đơn. Câu hỏi
                      nghiên cứu là về quyết định định giá theo mặt hàng, nên mỗi mặt hàng đếm
                      đúng một lần. Mẫu so sánh chính:{" "}
                      <strong>{dinhDangSoNguyen(z1.n + z0.n)} mặt hàng</strong> —{" "}
                      {dinhDangSoNguyen(z1.n)} nhóm Z=1 (luật cho giảm),{" "}
                      {dinhDangSoNguyen(z0.n)} nhóm Z=0 (bia, rượu, thuốc lá).
                    </Y>
                  </DanhSach>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={9} tieuDe="Kết quả đo được"
               chot="Giá của cả hai nhóm đều tăng. Nhóm được giảm thuế tăng ít hơn.">
          <TrangThaiDuLieu dangTai={moTaY.dangTai} loi={moTaY.loi} duLieu={moTaY.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => {
              const z1 = hang.find((h) => h.Z === 1);
              const z0 = hang.find((h) => h.Z === 0);
              if (!z1 || !z0) return null;
              const hieu = z1.y_tb - z0.y_tb;
              return (
                <div className="grid gap-[1.6vh]">
                  <BangDuLieu<{ muc: string; z1: string; z0: string }>
                    cot={[
                      { khoa: "muc", nhan: "Chỉ số" },
                      { khoa: "z1", nhan: "Z=1 — được giảm thuế" },
                      { khoa: "z0", nhan: "Z=0 — đối chứng" },
                    ]}
                    hang={[
                      { muc: "Số mặt hàng", z1: dinhDangSoNguyen(z1.n), z0: dinhDangSoNguyen(z0.n) },
                      { muc: "Y trung bình", z1: dinhDangSo(z1.y_tb, 3), z0: dinhDangSo(z0.y_tb, 3) },
                      { muc: "Y trung vị", z1: dinhDangSo(z1.y_trung_vi, 3), z0: dinhDangSo(z0.y_trung_vi, 3) },
                      { muc: "Độ lệch chuẩn", z1: dinhDangSo(z1.y_do_lech_chuan, 2), z0: dinhDangSo(z0.y_do_lech_chuan, 2) },
                      { muc: "Giữ nguyên giá y hệt", z1: `${z1.n_giu_nguyen_gia}/${z1.n}`, z0: `${z0.n_giu_nguyen_gia}/${z0.n}` },
                    ]}
                  />
                  <DanhSach>
                    <Y>
                      <strong>Không nhóm nào giảm giá.</strong> Cả hai trung bình đều dương, nên{" "}
                      <strong>{dinhDangSo(hieu, 3)}</strong> là chênh lệch giữa hai mức{" "}
                      <em>tăng</em>, không phải mức giảm.
                    </Y>
                    <Y>
                      <strong>Trung vị bằng 0 ở cả hai nhóm</strong> — quá nửa số mặt hàng không
                      đổi giá một đồng nào. Toàn bộ biến động nằm ở phần thiểu số còn lại.
                    </Y>
                    <Y>
                      <strong>Nhiễu lớn hơn tín hiệu nhiều lần.</strong> Độ lệch chuẩn{" "}
                      {dinhDangSo(z1.y_do_lech_chuan, 2)} trong khi thứ cần đo chỉ{" "}
                      {dinhDangSo(Math.abs(hieu), 1)}. Đây là lý do gốc khiến mọi khoảng tin cậy
                      phía sau đều rộng.
                    </Y>
                  </DanhSach>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={10} tieuDe="Vì sao chưa dùng thẳng được"
               chot="Kể cả không có chính sách nào, hai nhóm này vẫn sẽ đổi giá khác nhau.">
          <TrangThaiDuLieu dangTai={moTaNen.dangTai} loi={moTaNen.loi} duLieu={moTaNen.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => {
              const z1 = hang.find((h) => h.Z === 1);
              const z0 = hang.find((h) => h.Z === 0);
              if (!z1 || !z0) return null;
              return (
                <div className="grid gap-[1.8vh]">
                  <BangDuLieu<{ muc: string; z1: string; z0: string }>
                    cot={[
                      { khoa: "muc", nhan: "Đặc điểm nền, đo trước 01/07" },
                      { khoa: "z1", nhan: "Z=1 — hóa chất, mỹ phẩm" },
                      { khoa: "z0", nhan: "Z=0 — bia, rượu, thuốc lá" },
                    ]}
                    hang={[
                      { muc: "Giá trung bình", z1: `${dinhDangSoNguyen(z1.pre_p_tb)}đ`, z0: `${dinhDangSoNguyen(z0.pre_p_tb)}đ` },
                      { muc: "Số lượng bán trung bình", z1: dinhDangSo(z1.pre_q_tb, 1), z0: dinhDangSo(z0.pre_q_tb, 1) },
                      { muc: "Số tuần có giao dịch", z1: dinhDangSo(z1.pre_w_tb, 2), z0: dinhDangSo(z0.pre_w_tb, 2) },
                    ]}
                  />
                  <DanhSach>
                    <Y>
                      Dòng giữa là dòng quan trọng nhất: <strong>bia rượu bán gấp{" "}
                      {dinhDangSo(z0.pre_q_tb / z1.pre_q_tb, 1)} lần</strong> hàng hóa chất.
                    </Y>
                    <Y>
                      Món bán chạy thì cửa hàng theo dõi giá sát và đổi giá thường xuyên theo chi
                      phí đầu vào. Món bán ế thì giá nằm im hàng tháng.
                    </Y>
                  </DanhSach>
                  <KhoiCongThuc canGiua>
                    chênh lệch đo được = phần do chính sách + phần do &ldquo;hóa chất khác bia rượu&rdquo;
                  </KhoiCongThuc>
                  <p className="text-sm leading-snug">
                    Bốn cách ước lượng ở phần sau là <strong>bốn cách trừ phần thứ hai đi</strong>.
                    Chúng khác nhau đúng ở chỗ đó, không khác ở cách đo Y hay cách chia nhóm.
                  </p>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={11} tieuDe="Khung phương pháp"
               chot="Ước lượng tác động bằng cách so mức đổi giá của hai nhóm, sau khi trừ đi khác biệt sẵn có.">
          <div className="grid gap-[1.6vh]">
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-sm font-medium">Mô hình cơ bản</p>
              <p className="mt-1 font-mono">Y = β₀ + β₁·Z + γ·X + ε</p>
              <ul className="mt-2 grid gap-0.5 text-sm text-muted-foreground">
                <li><span className="font-mono text-foreground">β₀</span> — hệ số chặn: mức đổi giá trung bình của nhóm đối chứng</li>
                <li><span className="font-mono text-foreground">β₁</span> — con số cần tìm: chênh lệch mức đổi giá giữa hai nhóm sau khi đã tính tới X</li>
                <li><span className="font-mono text-foreground">γ</span> — hệ số của các biến kiểm soát: mỗi biến trong X kéo Y đi bao nhiêu</li>
                <li><span className="font-mono text-foreground">ε</span> — phần dư: những gì mô hình không giải thích được</li>
              </ul>
            </div>
            <BangDuLieu<{ k: string; ten: string; vt: string }>
              cot={[
                { khoa: "k", nhan: "Ký hiệu" },
                { khoa: "ten", nhan: "Tên gọi" },
                { khoa: "vt", nhan: "Vai trò" },
              ]}
              hang={[
                { k: "Z", ten: "Biến can thiệp", vt: "Luật có cho mặt hàng này giảm thuế không (1 hoặc 0)" },
                { k: "D", ten: "Biến thực thi", vt: "Cửa hàng có thật sự áp mức thuế mới không" },
                { k: "Y", ten: "Biến kết quả", vt: "Mức đổi giá của cùng mặt hàng, trước so với sau" },
                { k: "X", ten: "Biến kiểm soát", vt: "Đặc điểm sẵn có khiến hai nhóm khác nhau từ đầu" },
              ]}
            />
            <p className="text-sm leading-snug">
              Quan hệ giữa chúng: <strong>Z → D → Y</strong> — luật cho phép, cửa hàng quyết định
              áp hay không, sau đó giá mới đổi. Đồng thời <strong>X → Y</strong>, nên phải kiểm soát X.
            </p>
          </div>
        </Slide>

        {/* Slide này CỐ Ý không có câu chốt. Đồ thị có 12 nút kèm nhãn chữ, thu
            nhỏ thêm là chữ trong nút không đọc nổi trên máy chiếu — mà mỗi dòng
            chữ thêm vào đều lấy mất chiều cao của hình. Đo ở khổ 1600×1000: có
            câu chốt thì hình rộng 823px, bỏ đi thì được 895px. Phần diễn giải
            dồn vào một dòng dưới hình. */}
        <Slide so={12} tieuDe="Đồ thị nhân quả">
          {/* Nền trắng cố định: hình do matplotlib vẽ vốn có nền trắng, đặt lên
              nền tối của giao diện thì lộ ra một khối sáng lệch khung. */}
          <div className="grid gap-[1.4vh]">
            <div className="flex justify-center rounded-md border bg-white p-2">
              <Image
                src="/hinh/do-thi-nhan-qua.png"
                alt="Đồ thị nhân quả của đồ án: nghị quyết 204 quyết định Z, Z dẫn tới quyết định cập nhật thuế của cửa hàng rồi tới D, D và chi phí thực đơn dẫn tới Y; đặc tính SKU không quan sát được nối tới Z, tới các biến nền và tới Y."
                width={1750}
                height={1148}
                priority
                className="h-auto max-h-[62vh] w-auto max-w-full object-contain"
              />
            </div>
            <p className="leading-snug">
              Mũi tên liền là quan hệ đo được từ hóa đơn;{" "}
              <strong>mũi tên đứt màu đỏ</strong> xuất phát từ những thứ dữ liệu này không nhìn
              thấy. Đường nguy hiểm nhất là đặc tính mặt hàng — nó vừa quyết định nhóm (Z) vừa ảnh
              hưởng tới giá (Y), nên phải kiểm soát X.
            </p>
          </div>
        </Slide>

        <Slide so={13} tieuDe="Gắn biến vào dữ liệu"
               chot="Mỗi biến trong khung được đo bằng một trường cụ thể của hóa đơn.">
          <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu}
                           chieuCaoTai="h-56">
            {(hang) => {
              const chinh = hang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
              const n1 = chinh.reduce((s, h) => s + h.n1, 0);
              const n0 = chinh.reduce((s, h) => s + h.n0, 0);
              return (
                <div className="grid gap-[1.6vh]">
                  <BangDuLieu<{ k: string; dl: string }>
                    cot={[{ khoa: "k", nhan: "Biến" }, { khoa: "dl", nhan: "Đo bằng gì trong dữ liệu này" }]}
                    hang={[
                      { k: "Z", dl: `Phân loại theo tên hàng: hóa chất và mỹ phẩm → Z=1 (${dinhDangSoNguyen(n1)} mặt hàng); rượu, bia, thuốc lá → Z=0 (${dinhDangSoNguyen(n0)} mặt hàng)` },
                      { k: "D", dl: `Thuế suất ghi trên hóa đơn hậu kỳ: đã áp ${sau} → D=1, còn ${truoc} → D=0` },
                      { k: "Y", dl: `Log tỉ lệ giá gồm thuế hậu kỳ trên tiền kỳ, nhân 100 (${DON_VI_DIEM_LOG})` },
                      { k: "X₁ — giá nền", dl: "Log giá trung vị của mặt hàng trước chính sách" },
                      { k: "X₂ — sức bán nền", dl: "Log số lượng bán trước chính sách" },
                      { k: "X₃ — tần suất bán", dl: "Số tuần mặt hàng có phát sinh giao dịch trước chính sách" },
                    ]}
                  />
                  <p className="text-sm leading-snug">
                    Nhóm chọn <strong>Z</strong> làm can thiệp chính vì nó do luật quyết định. D
                    phản ánh một quyết định vận hành của cửa hàng nên không ngoại sinh.
                  </p>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={14} tieuDe="Bốn cách ước lượng — tổng quan"
               chot="Bốn cách khác nhau ở chỗ xử lý biến kiểm soát X, không khác ở Z hay Y.">
          <div className="grid gap-[1.6vh]">
            <p className="leading-snug">
              Vấn đề chung của cả bốn: hai nhóm hàng vốn khác nhau từ trước. Muốn phần chênh lệch
              còn lại quy được cho chính sách, phải trừ đi phần khác biệt sẵn có. Bốn cách dưới đây
              là bốn lời giải khác nhau cho đúng bài toán đó.
            </p>
            <BangDuLieu<{ so: string; ten: string; ytuong: string; xl: string; diem: string }>
              cot={[
                { khoa: "so", nhan: "#" },
                { khoa: "ten", nhan: "Cách tính" },
                { khoa: "ytuong", nhan: "Ý tưởng" },
                { khoa: "xl", nhan: "Xử lý X" },
                { khoa: "diem", nhan: "Điểm yếu" },
              ]}
              hang={[
                { so: "1", ten: TEN_PP1A_THO, ytuong: "So trung bình hai nhóm, không điều chỉnh",
                  xl: "Bỏ qua", diem: "Lẫn toàn bộ khác biệt sẵn có" },
                { so: "2", ten: TEN_PP1A_HIEP_BIEN, ytuong: "Đưa ba biến nền vào cùng mô hình",
                  xl: "Tuyến tính", diem: "Phải tin quan hệ đúng là tuyến tính" },
                { so: "3", ten: "PP1-B g-computation", ytuong: "Dự đoán nhóm Z=1 sẽ ra sao nếu không có chính sách",
                  xl: "Dự đoán phản thực", diem: "Phải ngoại suy cho vài mặt hàng" },
                { so: "4", ten: "PP2 phân tầng", ytuong: "Chỉ so những mặt hàng có giá nền gần nhau",
                  xl: "Ghép cặp theo tầng", diem: "Chỉ xử lý được biến dùng để chia tầng" },
              ]}
              chuThich="Bốn slide tiếp theo trình bày lần lượt bốn cách này. Cách 1 và cách 2 là cùng một mô hình chạy hai lần, khác nhau đúng ở chỗ có đưa X vào hay không."
            />
          </div>
        </Slide>

        <Slide so={15} tieuDe="Cách 1 — Hồi quy thô"
               chot="Không trừ gì cả. Đây là mốc so sánh để biết ba cách sau thay đổi được bao nhiêu.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || moTaY.dangTai}
                           loi={uocLuong.loi ?? moTaY.loi}
                           duLieu={uocLuong.duLieu && moTaY.duLieu
                             ? { u: uocLuong.duLieu, m: moTaY.duLieu } : undefined}
                           chieuCaoTai="h-52">
            {({ u, m }) => {
              const tho = u.find((h) => h.pp === TEN_PP1A_THO);
              const z1 = m.find((h) => h.Z === 1);
              const z0 = m.find((h) => h.Z === 0);
              if (!tho || !z1 || !z0) return null;
              return (
                <div className="grid gap-[1.5vh]">
                  <KhoiCongThuc>
                    <p>Y = β₀ + β₁·Z + ε</p>
                    <p className="mt-1.5">
                      β₁ = {dinhDangSo(z1.y_tb, 4)} − {dinhDangSo(z0.y_tb, 4)} ={" "}
                      {dinhDangSo(tho.uoc_luong, 4)}
                    </p>
                  </KhoiCongThuc>
                  <p className="text-sm leading-snug">
                    Với biến Z chỉ nhận 0 hoặc 1, hồi quy này <strong>đúng bằng hiệu hai trung
                    bình</strong> ở slide 9 — chỉ viết lại dưới dạng hồi quy để so sánh được với ba
                    cách sau.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <BangMotUocLuong h={tho} />
                    <div className="grid gap-[1.2vh]">
                      <p className="text-sm font-medium">Sai số chuẩn từ đâu ra</p>
                      <KhoiCongThuc>
                        SE = √( {dinhDangSo(z1.y_do_lech_chuan, 2)}²/{z1.n} +{" "}
                        {dinhDangSo(z0.y_do_lech_chuan, 2)}²/{z0.n} ) ={" "}
                        {dinhDangSo(
                          Math.sqrt(
                            z1.y_do_lech_chuan ** 2 / z1.n + z0.y_do_lech_chuan ** 2 / z0.n
                          ), 3)}
                      </KhoiCongThuc>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Tử số là độ dao động của Y, mẫu số là cỡ mẫu. Muốn sai số nhỏ đi một nửa
                        thì cần mẫu gấp bốn. Sai số tính theo HC3 nên không đòi hỏi hai nhóm có
                        cùng độ dao động.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-snug">
                    <strong>Vì sao vẫn báo cáo cách này</strong> dù biết nó lẫn nhiễu: nếu nó và
                    cách có kiểm soát lệch nhau nhiều thì đó là bằng chứng các biến nền đang chi
                    phối. Nó là phép đo <strong>chẩn đoán</strong>, không phải câu trả lời.
                  </p>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={16} tieuDe="Cách 2 — Hồi quy có hiệp biến"
               chot="Giả định một công thức nối đặc điểm nền với mức đổi giá, cho nó hút phần khác biệt sẵn có.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || heSo.dangTai || chanDoanHB.dangTai}
                           loi={uocLuong.loi ?? heSo.loi ?? chanDoanHB.loi}
                           duLieu={uocLuong.duLieu && heSo.duLieu && chanDoanHB.duLieu
                             ? { u: uocLuong.duLieu, h: heSo.duLieu, c: chanDoanHB.duLieu } : undefined}
                           chieuCaoTai="h-52">
            {({ u, h, c }) => {
              const hb = u.find((r) => r.pp === TEN_PP1A_HIEP_BIEN);
              const tho = u.find((r) => r.pp === TEN_PP1A_THO);
              const heSoHB = h.filter((r) => r.mo_hinh === "hiep_bien");
              const vif = layChiSo(c, "vif_can_thiep");
              const r2Z = layChiSo(c, "r2_can_thiep_theo_x");
              const seTho = layChiSo(c, "se_z_tho");
              if (!hb || !tho || !heSoHB.length || vif == null || r2Z == null || seTho == null) {
                return null;
              }
              return (
                <div className="grid gap-[1.4vh]">
                  <KhoiCongThuc>
                    Y = β₀ + β₁·Z + γ₁·log(giá nền) + γ₂·log(1+sức bán) + γ₃·số tuần bán + ε
                  </KhoiCongThuc>
                  <div className="grid gap-4 md:grid-cols-2">
                    <BangDuLieu<HeSoMoHinhRow>
                      cot={[
                        { khoa: "bien", nhan: "Hệ số", dinhDang: (r) => nhanBien(r.bien) },
                        { khoa: "he_so", nhan: "Giá trị", dinhDang: (r) => dinhDangSo(r.he_so, 3) },
                      ]}
                      hang={heSoHB}
                      classNameHang={(r) => (r.bien === "Z" ? "font-semibold" : undefined)}
                      chuThich={`Từ ${dinhDangSo(tho.uoc_luong, 3)} (thô) thành ${dinhDangSo(hb.uoc_luong, 3)}: khoảng một phần ba chênh lệch thô đến từ đặc điểm hàng hóa.`}
                    />
                    <BangMotUocLuong h={hb} />
                  </div>
                  <p className="text-sm leading-snug">
                    Hệ số <strong>{dinhDangSo(layHeSo(h, "hiep_bien", "log1p_pre_q") ?? 0, 3)}</strong>{" "}
                    của sức bán là chỗ đáng chỉ tay vào: hàng bán chạy tăng giá mạnh hơn hẳn, mà
                    nhóm đối chứng bán chạy gấp năm lần. Mô hình dùng đúng thông tin đó để trừ bớt
                    phần &ldquo;bia rượu tăng giá vì bia rượu bán chạy&rdquo;.
                  </p>
                  <div className="rounded-md border-l-4 border-l-foreground/40 bg-muted/30 px-3 py-2">
                    <p className="text-sm font-medium">
                      Nghịch lý: thêm biến kiểm soát mà sai số TĂNG, từ{" "}
                      {dinhDangSo(seTho, 3)} lên {dinhDangSo(hb.se, 3)}
                    </p>
                    <ul className="mt-1.5 grid gap-0.5 text-sm text-muted-foreground">
                      <li>
                        Phần dư gần như không đổi —{" "}
                        {dinhDangSo(layChiSo(c, "sd_phan_du_tho") ?? 0, 3)} xuống{" "}
                        {dinhDangSo(layChiSo(c, "sd_phan_du_hiep_bien") ?? 0, 3)}. Ba biến nền
                        không giải thích được Y, nên <strong>không có phần lợi nào</strong>.
                      </li>
                      <li>
                        Nhưng Z lại đoán được từ X — <strong>{dinhDangPhanTram(r2Z, 1)}</strong>.
                        Mô hình khó tách riêng công của Z hơn, phương sai bị phóng đại hệ số VIF ={" "}
                        {dinhDangSo(vif, 3)}.
                      </li>
                      <li className="text-foreground">
                        Kiểm: {dinhDangSo(seTho, 3)} × √{dinhDangSo(vif, 3)} ={" "}
                        {dinhDangSo(seTho * Math.sqrt(vif), 3)} — gần đúng{" "}
                        {dinhDangSo(hb.se, 3)}.
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm leading-snug">
                    <strong>Điểm yếu.</strong> Cả công thức này là một giả định: nó ép quan hệ giữa
                    X và Y phải tuyến tính, và ép <strong>cả hai nhóm dùng chung một đường
                    thẳng</strong>. Chính chỗ đó dẫn tới cách 3.
                  </p>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={17} tieuDe="Cách 3 — g-computation"
               chot="Dựng mô hình từ nhóm đối chứng để dự đoán nhóm được giảm thuế sẽ ra sao nếu không có chính sách.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || heSo.dangTai || moTaY.dangTai}
                           loi={uocLuong.loi ?? heSo.loi ?? moTaY.loi}
                           duLieu={uocLuong.duLieu && heSo.duLieu && moTaY.duLieu
                             ? { u: uocLuong.duLieu, h: heSo.duLieu, m: moTaY.duLieu } : undefined}
                           chieuCaoTai="h-52">
            {({ u, h, m }) => {
              const g = u.find((r) => r.pp.includes("g-computation"));
              const hbZ = u.find((r) => r.pp === TEN_PP1A_HIEP_BIEN);
              const z1 = m.find((r) => r.Z === 1);
              const nen = layHeSo(h, "tho", "chan");
              const dongX = h.filter((r) => r.mo_hinh === "g_comp_z0" && r.chenh_lech_x != null);
              if (!g || !hbZ || !z1 || nen == null || !dongX.length) return null;
              const phanThuc = nen + dongX.reduce((s, r) => s + r.he_so * (r.chenh_lech_x ?? 0), 0);
              return (
                <div className="grid gap-[1.3vh]">
                  <DanhSach>
                    <Y>
                      <strong>Ý tưởng.</strong> Dựng ra <em>phản thực</em>: mức đổi giá mà nhóm
                      Z=1 lẽ ra có nếu chính sách không xảy ra. Học nó từ nhóm đối chứng — nhóm
                      đang sống trong đúng thế giới không có chính sách.
                    </Y>
                    <Y>
                      <strong>Ba bước.</strong> Khớp mô hình <em>chỉ trên nhóm Z=0</em> → áp công
                      thức đó lên X của từng mặt hàng Z=1 → lấy giá thật trừ giá dự đoán.
                    </Y>
                  </DanhSach>
                  <div className="grid gap-4 md:grid-cols-2">
                    <KhoiCongThuc>
                      <p className="mb-1.5 font-sans text-xs text-muted-foreground">
                        Phân rã dự báo phản thực
                      </p>
                      <p>trung bình Y nhóm Z=0 {dinhDangSo(nen, 4).padStart(12)}</p>
                      {dongX.map((r) => (
                        <p key={r.bien}>
                          {dinhDangSo(r.he_so, 4)} × {dinhDangSo(r.chenh_lech_x ?? 0, 4)}{" "}
                          <span className="text-muted-foreground">({nhanBien(r.bien)})</span>{" "}
                          = {dinhDangSo(r.he_so * (r.chenh_lech_x ?? 0), 4)}
                        </p>
                      ))}
                      <p className="mt-1.5 border-t pt-1.5 font-semibold">
                        = phản thực cho nhóm Z=1 · {dinhDangSo(phanThuc, 4)}
                      </p>
                    </KhoiCongThuc>
                    <div className="grid gap-[1.2vh]">
                      <KhoiCongThuc>
                        <p>ATT = trung bình( Y₁ − Ŷ₀ ) trên nhóm Z=1</p>
                        <p className="mt-1">
                          = {dinhDangSo(z1.y_tb, 4)} − {dinhDangSo(phanThuc, 4)} ={" "}
                          {dinhDangSo(g.uoc_luong, 4)}
                        </p>
                      </KhoiCongThuc>
                      <BangMotUocLuong h={g} />
                    </div>
                  </div>
                  <div className="rounded-md border-l-4 border-l-foreground/40 bg-muted/30 px-3 py-2 text-sm leading-snug">
                    <strong>
                      Vì sao ra {dinhDangSo(g.uoc_luong, 3)} trong khi cách 2 ra{" "}
                      {dinhDangSo(hbZ.uoc_luong, 3)}?
                    </strong>{" "}
                    Hai cách chỉ khác ở chỗ tin hệ số của ai — khớp trên cả hai nhóm, hay khớp chỉ
                    trên Z=0. Chênh lệch giữa hai ước lượng bằng đúng tổng (chênh lệch hệ số) ×
                    (chênh lệch đặc điểm hai nhóm), và{" "}
                    <strong>gần như toàn bộ nằm ở biến sức bán</strong>. Ai đúng thì dữ liệu trong
                    tay không phân xử được — đó là bản chất của giả định, và là lý do đồ án báo cáo
                    cả bốn con số thay vì chọn một.
                  </div>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={18} tieuDe="Cách 4 — Phân tầng theo mức giá"
               chot="Chỉ so những mặt hàng có giá nền gần nhau, sau đó gộp năm tầng theo trọng số.">
          <TrangThaiDuLieu dangTai={theoTang.dangTai || uocLuong.dangTai}
                           loi={theoTang.loi ?? uocLuong.loi}
                           duLieu={theoTang.duLieu && uocLuong.duLieu
                             ? { t: theoTang.duLieu, u: uocLuong.duLieu } : undefined}
                           chieuCaoTai="h-52">
            {({ t, u }) => {
              const tang = t.filter((h) => h.mau === MAU_SO_SANH_CHINH);
              const pp2 = u.find((h) => h.pp === "PP2 phân tầng");
              if (!tang.length || !pp2) return null;
              const lonNhat = tang.reduce((a, b) =>
                Math.abs(a.w_s * a.tau_s) > Math.abs(b.w_s * b.tau_s) ? a : b);
              const conLai = tang
                .filter((h) => h.tang !== lonNhat.tang)
                .reduce((s, h) => s + h.w_s * h.tau_s, 0);
              return (
                <div className="grid gap-[1.3vh]">
                  <DanhSach>
                    <Y>
                      <strong>Ý tưởng.</strong> Ba cách trên đều phải giả định một dạng hàm. Cách
                      này không giả định gì: chỉ so những mặt hàng có giá nền gần nhau thì phần
                      khác biệt do giá tự triệt tiêu.
                    </Y>
                    <Y>
                      <strong>Vì sao mức giá quyết định.</strong> Phần thuế được giảm tương đương{" "}
                      {mucGiamLeRa} giá. Món {dinhDangSoNguyen(10_000)}đ →{" "}
                      {dinhDangSoNguyen(giamTrenHangRe)}đ, nhỏ hơn cả bước giá{" "}
                      {dinhDangSoNguyen(1_000)}đ. Món {dinhDangSoNguyen(100_000)}đ →{" "}
                      {dinhDangSoNguyen(giamTrenHangDat)}đ, gần hai bước giá.
                    </Y>
                  </DanhSach>
                  <BangDuLieu<TheoTangRow>
                    cot={[
                      { khoa: "tang", nhan: "Tầng" },
                      { khoa: "gia_min", nhan: "Khoảng giá nền", dinhDang: (h) => `${dinhDangSoNguyen(h.gia_min)}–${dinhDangSoNguyen(h.gia_max)}đ` },
                      { khoa: "n1", nhan: "Z=1" },
                      { khoa: "n0", nhan: "Z=0" },
                      { khoa: "tau_s", nhan: "τ trong tầng", dinhDang: (h) => dinhDangSo(h.tau_s, 3) },
                      { khoa: "w_s", nhan: "trọng số w", dinhDang: (h) => dinhDangSo(h.w_s, 3) },
                      { khoa: "dong_gop", nhan: "w × τ", dinhDang: (h) => dinhDangSo(h.w_s * h.tau_s, 3) },
                    ]}
                    hang={tang}
                    classNameHang={(h) => (h.tang === lonNhat.tang ? "font-semibold" : undefined)}
                    chuThich={`Trọng số w = số mặt hàng Z=1 trong tầng chia cho tổng số mặt hàng Z=1. Cộng cột cuối ra ${dinhDangSo(pp2.uoc_luong, 3)}.`}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border-l-4 border-l-foreground/40 bg-muted/30 px-3 py-2 text-sm leading-snug">
                      <strong>Phải nói ra:</strong> tầng {lonNhat.tang} một mình đóng góp{" "}
                      {dinhDangSo(lonNhat.w_s * lonNhat.tau_s, 3)} trong khi tổng chỉ{" "}
                      {dinhDangSo(pp2.uoc_luong, 3)}. Bốn tầng còn lại cộng lại ra{" "}
                      {dinhDangSo(conLai, 3)}. Với {lonNhat.n1} mặt hàng trong một tầng, con số đó
                      rất có thể chỉ là nhiễu — nhóm không đào sâu riêng tầng nào.
                    </div>
                    <div className="grid gap-[1vh]">
                      <p className="text-sm font-medium">
                        Sai số bằng bootstrap — {dinhDangSoNguyen(pp2.so_lan_hop_le ?? 0)} vòng hợp lệ
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Không có công thức đóng, nên mô phỏng: mỗi vòng bốc lại đúng số mặt hàng
                        ban đầu, <strong>mỗi lần bốc một món rồi bỏ lại vào rổ</strong> — nên có
                        món trúng nhiều lần, món không trúng lần nào. Chia lại tầng từ đầu ở mỗi
                        vòng, vì ranh giới tầng cũng ước lượng từ dữ liệu. Độ tản mát của các vòng
                        chính là SE = {dinhDangSo(pp2.se, 3)}.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={19} tieuDe="Kiểm tra thiết kế trước khi tin kết quả"
               chot="Bốn cách tính dùng chung một giả định gốc, nên chúng không kiểm chứng lẫn nhau.">
          <TrangThaiDuLieu dangTai={congChanDoan.dangTai} loi={congChanDoan.loi}
                           duLieu={congChanDoan.duLieu} chieuCaoTai="h-48">
            {() => (
              <div className="grid gap-[1.8vh]">
                <p className="leading-snug">
                  <strong>Giả định xu hướng song song:</strong> nếu không có chính sách, giá hai
                  nhóm sẽ đi song song. Không kiểm chứng trực tiếp được, nên nhóm đặt trước ba cổng:
                </p>
                <DanhSach>
                  <Y><strong>Cân bằng</strong> — hai nhóm có giống nhau ở các đặc điểm nền không.</Y>
                  <Y><strong>Giả dược</strong> — chạy lại phép so ở giai đoạn chưa có chính sách; lẽ ra phải ra gần 0.</Y>
                  <Y><strong>Tiền xu hướng</strong> — chênh lệch trước chính sách có đủ nhỏ không.</Y>
                </DanhSach>
                <p className="leading-snug">
                  Kết quả: cổng giả dược đạt, hai cổng còn lại không đạt. Vì vậy mọi kết luận nhân
                  quả phía sau đều được trình bày <strong>có điều kiện</strong>.
                </p>
              </div>
            )}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={20} tieuDe="Kết quả — bốn ước lượng"
               chot="Bốn cách tính đều cho chênh lệch âm nhưng nhỏ, và khoảng tin cậy đều phủ qua 0.">
          <BieuDoHeSo anTieuDe />
        </Slide>

        <Slide so={21} tieuDe="Từ chênh lệch ra tỉ lệ chuyển thuế"
               chot="Gốc so sánh không phải số 0, mà là mức tăng giá của nhóm đối chứng.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || moTaY.dangTai}
                           loi={uocLuong.loi ?? moTaY.loi}
                           duLieu={uocLuong.duLieu && moTaY.duLieu
                             ? { u: uocLuong.duLieu, m: moTaY.duLieu } : undefined}
                           chieuCaoTai="h-56">
            {({ u, m }) => {
              const chinh = u.filter((h) => h.vai_tro === "chính" && h.pass_through != null);
              const tho = chinh.find((h) => h.pp === TEN_PP1A_THO) ?? chinh[0];
              const z1 = m.find((h) => h.Z === 1);
              const z0 = m.find((h) => h.Z === 0);
              const ty = chinh.map((h) => h.pass_through as number);
              if (!tho || !z1 || !z0 || !ty.length) return null;
              return (
                <div className="grid gap-[1.4vh]">
                  <KhoiCongThuc>
                    <p>{dinhDangSo(z0.y_tb, 3).padStart(7)} · nếu không có chính sách, giá lẽ ra tăng chừng này</p>
                    <p>{dinhDangSo(z1.y_tb, 3).padStart(7)} · thực tế nhóm được giảm thuế chỉ tăng chừng này</p>
                    <p className="border-t pt-1">{dinhDangSo(tho.uoc_luong, 3).padStart(7)} · chính sách kéo lại được chừng này</p>
                    <p className="mt-1.5">{dinhDangSo(MOC_CHUYEN_HOAN_TOAN, 3).padStart(7)} · nếu chuyển hết phần thuế, phải kéo được chừng này</p>
                    <p className="mt-1.5 font-semibold">
                      {dinhDangSo(tho.uoc_luong, 3)} ÷ {dinhDangSo(MOC_CHUYEN_HOAN_TOAN, 3)} ={" "}
                      {dinhDangPhanTram(tho.pass_through as number, 0)}
                    </p>
                  </KhoiCongThuc>
                  <p className="rounded-md border-l-4 border-l-foreground/40 bg-muted/30 px-3 py-2 text-sm leading-snug">
                    <strong>Đọc con số này thế nào.</strong>{" "}
                    {dinhDangPhanTram(tho.pass_through as number, 0)} không có nghĩa là giá giảm{" "}
                    {dinhDangPhanTram(tho.pass_through as number, 0)} — giá vẫn tăng, chỉ tăng ít
                    hơn kịch bản không có chính sách. Nếu chuyển hết phần thuế thì giá lẽ ra thấp
                    hơn {mucGiamLeRa}; nhóm chỉ đo được {phanTramTuDiemLog(tho.uoc_luong)}. Tỉ lệ
                    là phần trăm <em>của mức lẽ ra kéo được</em>, không phải phần trăm của giá.
                  </p>
                  <BangDuLieu<UocLuongChinhRow>
                    cot={[
                      { khoa: "pp", nhan: "Cách tính" },
                      { khoa: "uoc_luong", nhan: "Chênh lệch", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
                      { khoa: "pass_through", nhan: "Tỉ lệ vào giá", dinhDang: (h) => dinhDangPhanTram(h.pass_through, 0) },
                    ]}
                    hang={chinh}
                    chuThich={`Bốn cách tính cho khoảng ${dinhDangPhanTram(Math.min(...ty), 0)} – ${dinhDangPhanTram(Math.max(...ty), 0)} mức chuyển hoàn toàn.`}
                  />
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={22} tieuDe="Hai câu hỏi khác nhau, hai câu trả lời khác nhau"
               chot="Một cách đọc cần giả định về nhóm đối chứng, cách còn lại không cần gì cả.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || bamChuan.dangTai}
                           loi={uocLuong.loi ?? bamChuan.loi}
                           duLieu={uocLuong.duLieu && bamChuan.duLieu
                             ? { u: uocLuong.duLieu, b: bamChuan.duLieu } : undefined}
                           chieuCaoTai="h-48">
            {({ u, b }) => {
              const ty = u.filter((h) => h.vai_tro === "chính" && h.pass_through != null)
                          .map((h) => h.pass_through as number);
              const z1 = b.find((h) => h.Z === 1);
              if (!ty.length || !z1) return null;
              return (
                <div className="grid gap-[1.8vh]">
                  <BangDuLieu<{ ten: string; ch: string; kq: string; gd: string }>
                    cot={[
                      { khoa: "ten", nhan: "" },
                      { khoa: "ch", nhan: "Câu hỏi nó trả lời" },
                      { khoa: "kq", nhan: "Kết quả" },
                      { khoa: "gd", nhan: "Cần giả định gì" },
                    ]}
                    hang={[
                      {
                        ten: "Tỉ lệ chuyển thuế",
                        ch: "So với kịch bản không có chính sách, giá thấp hơn được bao nhiêu?",
                        kq: `${dinhDangPhanTram(Math.min(...ty), 0)} – ${dinhDangPhanTram(Math.max(...ty), 0)} mức lẽ ra`,
                        gd: "Xu hướng song song — cổng cân bằng đã trượt",
                      },
                      {
                        ten: "Bám chuẩn cơ học",
                        ch: "Giá có rơi đúng con số số học phải có không?",
                        kq: `${z1.n_bam_chuan}/${z1.n_du_bao_doi_muc} mặt hàng`,
                        gd: "Không cần giả định nào",
                      },
                    ]}
                  />
                  <DanhSach>
                    <Y>
                      Hai con số <strong>không mâu thuẫn</strong> — chúng trả lời hai câu khác
                      nhau, và mỗi cái mạnh ở chỗ cái kia yếu.
                    </Y>
                    <Y>
                      Tỉ lệ chuyển thuế là ước lượng nhân quả, nhưng thừa hưởng toàn bộ bất định
                      của giả định xu hướng song song, và khoảng tin cậy của cả bốn cách đều phủ
                      qua 0.
                    </Y>
                    <Y>
                      Bám chuẩn cơ học không cần giả định nào, nhưng chỉ mô tả — nó không nói được
                      nguyên nhân, chỉ nói giá đã không rơi vào con số số học đáng lẽ phải có.
                    </Y>
                  </DanhSach>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={23} tieuDe="Kiểm chứng bổ sung — chuẩn giá cơ học"
               chot="Không dùng nhóm đối chứng: chỉ tính giá lẽ ra phải có, sau đó đối chiếu với giá thật.">
          <TrangThaiDuLieu dangTai={bamChuan.dangTai || lamTron.dangTai}
                           loi={bamChuan.loi ?? lamTron.loi}
                           duLieu={bamChuan.duLieu && lamTron.duLieu
                             ? { b: bamChuan.duLieu, t: lamTron.duLieu } : undefined}
                           chieuCaoTai="h-52">
            {({ b, t }) => {
              const z1 = b.find((h) => h.Z === 1);
              const z0 = b.find((h) => h.Z === 0);
              const luoi = t.find((h) => h.buoc_lam_tron === 1000);
              if (!z1) return null;
              return (
                <div className="grid gap-[1.8vh]">
                  <DanhSach>
                    <Y>Lấy giá cũ nhân tỉ lệ thuế, làm tròn 1.000đ, ra mức giá lẽ ra phải có.</Y>
                    {luoi && (
                      <Y>
                        Với lưới 1.000đ, <strong>{dinhDangPhanTram(luoi.ti_le_doi_muc, 1)}</strong> mặt hàng
                        vẫn buộc phải đổi mức giá, nên làm tròn cho đẹp không giải thích được việc giá đứng im.
                      </Y>
                    )}
                  </DanhSach>
                  <ThanhTiLe nhan="Nhóm được giảm thuế — đạt đúng mức giá lẽ ra" tuSo={z1.n_bam_chuan}
                             mauSo={z1.n_du_bao_doi_muc} noiBat />
                  {z0 && (
                    <ThanhTiLe nhan="Nhóm không được giảm thuế — để đối chiếu" tuSo={z0.n_bam_chuan}
                               mauSo={z0.n_du_bao_doi_muc}
                               ghiChu="Tỉ lệ ngang nhau, nghĩa là nhóm được giảm thuế không hành xử khác." />
                  )}
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={24} tieuDe="Hạn chế"
               chot="Ba hạn chế của đồ án, kèm mức ảnh hưởng của từng cái tới kết luận.">
          <div className="grid gap-[1.8vh] leading-snug">
            <div>
              <p className="font-semibold">Chi phí đổi giá</p>
              <p>
                Cửa hàng có thể ngại đổi giá vì mỗi lần đổi đều tốn công và ảnh hưởng vận hành.
                Dữ liệu hóa đơn không quan sát được chi phí này, nên đồ án không tách được phần do
                ngại đổi giá khỏi phần do chính sách.
              </p>
            </div>
            <div>
              <p className="font-semibold">Lạm phát tích lũy</p>
              <p>
                Phần giảm thuế có thể đã bị phần lạm phát tích lũy từ lần điều chỉnh giá gần nhất
                bù vào. Dữ liệu này không quan sát được chi phí đầu vào, nên đây là khả năng chưa
                loại trừ được.
              </p>
            </div>
            <div>
              <p className="font-semibold">Hai nhóm khác nhau từ trước</p>
              <p>
                Hàng hóa chất bán chậm hơn hẳn bia rượu. Vì vậy chưa xác định được chính xác bao
                nhiêu phần chênh lệch là do chính sách. Một cửa hàng cũng không suy rộng ra ngành
                bán lẻ.
              </p>
            </div>
          </div>
        </Slide>

        <Slide so={25} tieuDe="Kết luận"
               chot="Cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ.">
          <TrangThaiDuLieu dangTai={uocLuong.dangTai || bamChuan.dangTai}
                           loi={uocLuong.loi ?? bamChuan.loi}
                           duLieu={uocLuong.duLieu && bamChuan.duLieu
                             ? { u: uocLuong.duLieu, b: bamChuan.duLieu } : undefined}
                           chieuCaoTai="h-56">
            {({ u, b }) => {
              const ty = u.filter((h) => h.vai_tro === "chính" && h.pass_through != null)
                          .map((h) => h.pass_through as number);
              const z1 = b.find((h) => h.Z === 1);
              if (!ty.length || !z1) return null;
              return (
                <DanhSach>
                  <Y>
                    Bốn phương pháp ước lượng đều cho tỉ lệ chuyển thuế vào giá chỉ khoảng{" "}
                    <strong>
                      {dinhDangPhanTram(Math.min(...ty), 0)} – {dinhDangPhanTram(Math.max(...ty), 0)}
                    </strong>{" "}
                    mức lẽ ra phải đạt.
                  </Y>
                  <Y>
                    Chuẩn giá cơ học độc lập cho cùng một hướng: chỉ{" "}
                    <strong>{dinhDangSoNguyen(z1.n_bam_chuan)}</strong> trên{" "}
                    {dinhDangSoNguyen(z1.n_du_bao_doi_muc)} mặt hàng rơi đúng mức giá lẽ ra phải có.
                  </Y>
                  <Y>
                    Ba cổng chẩn đoán cho thấy chưa thể quy toàn bộ chênh lệch cho chính sách. Điều
                    đó giới hạn <strong>độ lớn</strong> của tác động, không lật ngược kết luận.
                  </Y>
                  <Y>
                    Đóng góp của đồ án: đo được mức độ thực thi chính sách ở cấp cửa hàng, và cho
                    thấy dữ liệu một cửa hàng đủ tới đâu.
                  </Y>
                </DanhSach>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>
      </KhungTrinhChieu>
    </div>
  );
}
