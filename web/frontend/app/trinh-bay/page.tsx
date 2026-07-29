"use client";

/**
 * Trang Trình bày — bản trình chiếu cho buổi báo cáo.
 *
 * Trọng tâm là PHƯƠNG PHÁP NHÂN QUẢ, không phải các quan sát mô tả. Hai bản
 * trước đều lệch: bản đầu viết như báo cáo nên không trình chiếu được, bản hai
 * rút gọn tới mức chỉ còn "nhìn thấy giá không đổi rồi kết luận" — không cho
 * thấy nhóm đã làm gì.
 *
 * Bố cục: đặt vấn đề → dữ liệu → khung phương pháp → gắn biến → từng phương
 * pháp → kiểm tra thiết kế → kết quả → kiểm chứng bổ sung → hạn chế → kết luận.
 *
 * Hai điểm bố cục đã sửa theo góp ý:
 *   · Mô phỏng làm tròn KHÔNG phải phương pháp ước lượng — nó là chuẩn cơ học,
 *     nên chuyển xuống sau kết quả, dán nhãn "kiểm chứng bổ sung".
 *   · Hạn chế đặt TRƯỚC kết luận để kết luận đứng cuối.
 *
 * Số liệu lấy qua hook dùng chung với các trang phân tích; file này không giữ
 * bản sao kết quả riêng.
 */
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { KhungTrinhChieu, Slide } from "@/components/slide/khung-trinh-chieu";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import { ThanhTiLe } from "@/components/site/thanh-ti-le";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import {
  useBamChuan,
  useCongChanDoan,
  useEda,
  useLamTron,
  useLuongMau,
  useManifest,
  useTheoTang,
  useUocLuongChinh,
} from "@/lib/hooks";
import {
  MOC_CHUYEN_HOAN_TOAN,
  MAU_SO_SANH_CHINH,
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
  EdaDoPhuThangRow,
  EdaMaTranChuyenTheRow,
  LuongMauRow,
  TheoTangRow,
  UocLuongChinhRow,
} from "@/lib/types";

const TONG = 19;

/**
 * Thông tin môn học và nhóm — hiện trên slide bìa.
 *
 * Đây là thông tin hành chính, KHÔNG phải kết quả phân tích, nên gõ tay ở đây
 * là đúng chỗ. Điền vào rồi lưu là slide tự cập nhật.
 */
const THONG_TIN_NHOM: { nhan: string; gt: string }[] = [
  { nhan: "Môn học", gt: "" },
  { nhan: "Giảng viên", gt: "" },
  { nhan: "Lớp", gt: "" },
  { nhan: "Nhóm", gt: "" },
  { nhan: "Thành viên", gt: "" },
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

/**
 * Con số nổi bật kèm nhãn.
 *
 * Hai điều đã sai ở bản trước, ghi lại để không lặp:
 *
 * 1. Đơn vị bị nhét vào cùng cỡ chữ với con số, nên dòng gãy giữa chừng và
 *    "điểm log ×100" át mất chính con số. Đơn vị chỉ là ngữ cảnh — nhỏ, đứng
 *    cạnh, căn theo baseline.
 *
 * 2. Cỡ chữ đặt tới 3,4rem, tức LỚN HƠN tiêu đề slide (tối đa 2,5rem). Một số
 *    liệu phụ trợ mà to hơn tiêu đề thì đảo lộn thứ bậc thị giác: mắt đọc con
 *    số trước cả tên phương pháp. Giữ nó nằm giữa câu chốt và chữ thân.
 */
function SoLon({ so, donVi, nhan }: { so: string; donVi?: string; nhan: string }) {
  return (
    <div className="grid gap-1">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-semibold tabular-nums"
              style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.75rem)", lineHeight: 1.1 }}>
          {so}
        </span>
        {donVi && <span className="text-sm text-muted-foreground">{donVi}</span>}
      </span>
      <span className="text-sm text-muted-foreground">{nhan}</span>
    </div>
  );
}

const DON_VI_DIEM_LOG = "điểm log ×100";

function thangGon(t: string) {
  const [nam, thang] = t.split("-");
  return `${thang}/${nam}`;
}

export default function TrangTrinhBay() {
  const uocLuong = useUocLuongChinh();
  const bamChuan = useBamChuan();
  const lamTron = useLamTron();
  const luongMau = useLuongMau();
  const manifest = useManifest();
  const theoTang = useTheoTang();
  const congChanDoan = useCongChanDoan();
  const doPhu = useEda("do-phu-theo-thang");
  const maTran = useEda("ma-tran-chuyen-thue");

  const truoc = dinhDangPhanTram(THUE_SUAT_TRUOC_CHINH_SACH, 0);
  const sau = dinhDangPhanTram(THUE_SUAT_SAU_CHINH_SACH, 0);
  const mucGiamLeRa = dinhDangPhanTram(Math.abs(Math.expm1(MOC_CHUYEN_HOAN_TOAN / 100)), 1);

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
            <dl className="grid gap-1 text-sm text-muted-foreground">
              {THONG_TIN_NHOM.map(({ nhan, gt }) => (
                <div key={nhan} className="flex gap-2">
                  <dt className="min-w-24 shrink-0">{nhan}</dt>
                  <dd className={gt ? "text-foreground" : "italic"}>{gt || "(chưa điền)"}</dd>
                </div>
              ))}
            </dl>
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
               chot="Mỗi bước lọc đều ghi rõ lý do và số dòng mất đi, kiểm lại được từng bước."
               ghiChu={<NhanVaiTro vaiTro="chan-doan" />}>
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
               chot="Dữ liệu có lỗ hổng thật, và nhóm chọn cửa sổ phân tích dựa trên chúng."
               ghiChu={<NhanVaiTro vaiTro="chan-doan" />}>
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

        <Slide so={6} tieuDe="Quan sát sơ bộ"
               chot="Nhìn thô đã thấy điều đáng ngờ: nhiều mặt hàng luật cho giảm nhưng hóa đơn vẫn ghi mức thuế cũ."
               ghiChu={<NhanVaiTro vaiTro="chan-doan" />}>
          <TrangThaiDuLieu dangTai={maTran.dangTai} loi={maTran.loi} duLieu={maTran.duLieu}
                           chieuCaoTai="h-48">
            {(hang) => (
              <div className="grid gap-[2vh]">
                <BangDuLieu<EdaMaTranChuyenTheRow>
                  cot={[
                    { khoa: "tien", nhan: "Thuế suất trước" },
                    { khoa: "hau", nhan: "Thuế suất sau" },
                    { khoa: "so_sku", nhan: "Số mặt hàng", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
                  ]}
                  hang={hang}
                />
                <DanhSach>
                  <Y>Quan sát này gợi ý câu trả lời, nhưng chưa tách được phần do chính sách.</Y>
                  <Y>Muốn nói &ldquo;do chính sách&rdquo; thì cần một khung phương pháp — phần tiếp theo.</Y>
                </DanhSach>
              </div>
            )}
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

        <Slide so={8} tieuDe="Khung phương pháp"
               chot="Ước lượng tác động bằng cách so mức đổi giá của hai nhóm, sau khi trừ đi khác biệt sẵn có.">
          <div className="grid gap-[1.8vh]">
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-sm font-medium">Mô hình cơ bản</p>
              <p className="mt-1 font-mono text-sm">Y = β₀ + β₁·Z + γ·X + ε</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                β₁ là con số cần tìm: chênh lệch mức đổi giá giữa hai nhóm sau khi đã tính tới X.
              </p>
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

        <Slide so={9} tieuDe="Gắn biến vào dữ liệu"
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
                      { k: "D", dl: "Thuế suất ghi trên hóa đơn hậu kỳ: đã áp 8% → D=1, còn 10% → D=0" },
                      { k: "Y", dl: "Log tỉ lệ giá gồm thuế hậu kỳ trên tiền kỳ, nhân 100 (điểm log ×100)" },
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

        <Slide so={10} tieuDe="Bốn cách ước lượng — tổng quan"
               chot="Bốn cách khác nhau ở chỗ xử lý biến kiểm soát X, không khác ở Z hay Y."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <div className="grid gap-[1.6vh]">
            <p className="text-sm leading-snug">
              Vấn đề chung của cả bốn: hai nhóm hàng vốn khác nhau từ trước. Muốn phần chênh lệch
              còn lại quy được cho chính sách, phải trừ đi phần khác biệt sẵn có. Bốn cách dưới đây
              là bốn lời giải khác nhau cho đúng bài toán đó.
            </p>
            <BangDuLieu<{ ten: string; ytuong: string; xl: string; diem: string }>
              cot={[
                { khoa: "ten", nhan: "Cách tính" },
                { khoa: "ytuong", nhan: "Ý tưởng" },
                { khoa: "xl", nhan: "Xử lý X" },
                { khoa: "diem", nhan: "Điểm yếu" },
              ]}
              hang={[
                { ten: TEN_PP1A_THO, ytuong: "So trung bình hai nhóm, không điều chỉnh",
                  xl: "Bỏ qua", diem: "Lẫn toàn bộ khác biệt sẵn có" },
                { ten: TEN_PP1A_HIEP_BIEN, ytuong: "Đưa ba biến nền vào cùng mô hình",
                  xl: "Tuyến tính", diem: "Phải tin quan hệ đúng là tuyến tính" },
                { ten: "PP1-B g-computation", ytuong: "Dự đoán nhóm Z=1 sẽ ra sao nếu không có chính sách",
                  xl: "Dự đoán phản thực", diem: "Phải ngoại suy cho vài mặt hàng" },
                { ten: "PP2 phân tầng", ytuong: "Chỉ so những mặt hàng có giá nền gần nhau",
                  xl: "Ghép cặp theo tầng", diem: "Chỉ xử lý được biến dùng để chia tầng" },
              ]}
            />
          </div>
        </Slide>

        <Slide so={11} tieuDe="Cách 1 — Hồi quy chênh lệch"
               chot="Chạy hai lần: một lần không kiểm soát gì, một lần thêm ba biến X. Nếu lệch nhiều thì X đang chi phối."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <TrangThaiDuLieu dangTai={uocLuong.dangTai} loi={uocLuong.loi} duLieu={uocLuong.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => {
              const tho = hang.find((h) => h.pp === TEN_PP1A_THO);
              const hb = hang.find((h) => h.pp === TEN_PP1A_HIEP_BIEN);
              return (
                <div className="grid gap-[1.4vh]">
                  <DanhSach>
                    <Y><strong>Làm gì.</strong> Ước lượng β₁ — chênh lệch mức đổi giá giữa nhóm được giảm thuế và nhóm không.</Y>
                    <Y><strong>Cách làm.</strong> Chạy hồi quy hai lần trên cùng bộ dữ liệu: lần đầu chỉ có Z, lần sau thêm cả ba biến nền.</Y>
                    <Y><strong>Vì sao chạy hai lần.</strong> Nếu hai kết quả lệch nhau nhiều, nghĩa là đặc điểm sẵn có đang chi phối, không phải chính sách.</Y>
                  </DanhSach>
                  <div className="rounded-md border bg-muted/40 p-3 font-mono text-sm">
                    <p>thô: Y = β₀ + β₁·Z + ε</p>
                    <p className="mt-1">hiệp biến: Y = β₀ + β₁·Z + γ₁·X₁ + γ₂·X₂ + γ₃·X₃ + ε</p>
                  </div>
                  {tho && hb && (
                    <div className="grid grid-cols-2 gap-6">
                      <SoLon so={dinhDangSo(tho.uoc_luong, 3)} donVi={DON_VI_DIEM_LOG} nhan={`${tho.pp} — không kiểm soát`} />
                      <SoLon so={dinhDangSo(hb.uoc_luong, 3)} donVi={DON_VI_DIEM_LOG} nhan={`${hb.pp} — có kiểm soát`} />
                    </div>
                  )}
                  <p className="text-sm leading-snug">
                    Hai con số gần nhau, nghĩa là ba biến kiểm soát không làm đổi kết luận. Sai số
                    chuẩn tính theo HC3 nên không phụ thuộc giả định phương sai đồng nhất.
                  </p>
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={12} tieuDe="Cách 2 — g-computation"
               chot="Dựng mô hình từ nhóm đối chứng để dự đoán nhóm được giảm thuế sẽ ra sao nếu không có chính sách."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <TrangThaiDuLieu dangTai={uocLuong.dangTai} loi={uocLuong.loi} duLieu={uocLuong.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => {
              const g = hang.find((h) => h.pp.includes("g-computation"));
              return (
                <div className="grid gap-[1.4vh]">
                  <p className="text-sm leading-snug">
                    <strong>Làm gì.</strong> Thay vì so hai nhóm trực tiếp, cách này dựng ra{" "}
                    <em>phản thực</em>: mức giá mà nhóm được giảm thuế lẽ ra có nếu chính sách
                    không xảy ra. Đây chính là đại lượng mà định nghĩa nhân quả cần.
                  </p>
                  <DanhSach>
                    <Y><strong>Bước 1.</strong> Huấn luyện mô hình giá chỉ trên nhóm Z=0, tức nhóm không chịu chính sách.</Y>
                    <Y><strong>Bước 2.</strong> Đưa X của từng mặt hàng Z=1 vào mô hình đó để dự đoán mức đổi giá phản thực.</Y>
                    <Y><strong>Bước 3.</strong> Lấy giá thật trừ giá dự đoán, sau đó lấy trung bình trên toàn nhóm Z=1.</Y>
                  </DanhSach>
                  <div className="rounded-md border bg-muted/40 p-3 font-mono text-sm">
                    <p>ATT = trung bình[ Y(thật) − Ŷ(dự đoán từ mô hình Z=0) ] trên nhóm Z=1</p>
                  </div>
                  {g && <SoLon so={dinhDangSo(g.uoc_luong, 3)} donVi={DON_VI_DIEM_LOG} nhan={`${g.pp} — khoảng tin cậy tính bằng bootstrap`} />}
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={13} tieuDe="Cách 3 — Phân tầng theo mức giá"
               chot="Chỉ so những mặt hàng có giá nền gần nhau, sau đó gộp năm tầng theo trọng số."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu}
                           chieuCaoTai="h-52">
            {(hang) => (
              <div className="grid gap-[1.4vh]">
                <DanhSach>
                  <Y><strong>Làm gì.</strong> Loại bỏ ảnh hưởng của giá nền mà không cần giả định dạng hàm như hồi quy.</Y>
                  <Y><strong>Cách làm.</strong> Chia toàn bộ mặt hàng thành năm tầng theo giá trước chính sách, tính chênh lệch riêng trong từng tầng, sau đó gộp lại với trọng số bằng số mặt hàng được giảm thuế trong tầng.</Y>
                  <Y><strong>Vì sao chia tầng.</strong> Hàng rẻ và hàng đắt không đổi giá theo cùng một kiểu, so chung sẽ lẫn hai hiệu ứng vào nhau.</Y>
                </DanhSach>
                <BangDuLieu<TheoTangRow>
                  cot={[
                    { khoa: "tang", nhan: "Tầng" },
                    { khoa: "gia_min", nhan: "Khoảng giá nền", dinhDang: (h) => `${dinhDangSoNguyen(h.gia_min)}–${dinhDangSoNguyen(h.gia_max)}đ` },
                    { khoa: "n1", nhan: "Z=1" },
                    { khoa: "n0", nhan: "Z=0" },
                    { khoa: "tau_s", nhan: "Chênh lệch", dinhDang: (h) => dinhDangSo(h.tau_s, 3) },
                    { khoa: "w_s", nhan: "Trọng số", dinhDang: (h) => dinhDangSo(h.w_s, 3) },
                  ]}
                  hang={hang.filter((h) => h.mau === MAU_SO_SANH_CHINH)}
                  chuThich="Trọng số bằng tỉ lệ số mặt hàng được giảm thuế nằm trong tầng đó."
                />
              </div>
            )}
          </TrangThaiDuLieu>
        </Slide>

        <Slide so={14} tieuDe="Kiểm tra thiết kế trước khi tin kết quả"
               chot="Bốn cách tính dùng chung một giả định gốc, nên chúng không kiểm chứng lẫn nhau."
               ghiChu={<NhanVaiTro vaiTro="chan-doan" />}>
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

        <Slide so={15} tieuDe="Kết quả — bốn ước lượng"
               chot="Bốn cách tính đều cho chênh lệch âm nhưng nhỏ, và khoảng tin cậy đều phủ qua 0."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <BieuDoHeSo />
        </Slide>

        <Slide so={16} tieuDe="Từ chênh lệch ra tỉ lệ chuyển thuế"
               chot="Chia chênh lệch quan sát được cho mức lẽ ra phải giảm, ra tỉ lệ phần thuế thật sự vào giá."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
          <TrangThaiDuLieu dangTai={uocLuong.dangTai} loi={uocLuong.loi} duLieu={uocLuong.duLieu}
                           chieuCaoTai="h-56">
            {(hang) => {
              const chinh = hang.filter((h) => h.vai_tro === "chính" && h.pass_through != null);
              const tho = chinh.find((h) => h.pp === TEN_PP1A_THO) ?? chinh[0];
              const ty = chinh.map((h) => h.pass_through as number);
              if (!tho || !ty.length) return null;
              return (
                <div className="grid gap-[1.6vh]">
                  <div className="grid grid-cols-2 gap-6">
                    <SoLon so={dinhDangSo(MOC_CHUYEN_HOAN_TOAN, 3)} donVi={DON_VI_DIEM_LOG} nhan={`Giá lẽ ra phải giảm — tương đương ${mucGiamLeRa}`} />
                    <SoLon so={dinhDangSo(tho.uoc_luong, 3)} donVi={DON_VI_DIEM_LOG} nhan={`Chênh lệch thực tế (${tho.pp})`} />
                  </div>
                  <p className="rounded-md border bg-muted/40 p-3 text-center font-medium tabular-nums">
                    {dinhDangSo(tho.uoc_luong, 3)} ÷ {dinhDangSo(MOC_CHUYEN_HOAN_TOAN, 3)} ={" "}
                    {dinhDangPhanTram(tho.pass_through as number, 0)}
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

        <Slide so={17} tieuDe="Kiểm chứng bổ sung — chuẩn giá cơ học"
               chot="Không dùng nhóm đối chứng: chỉ tính giá lẽ ra phải có, sau đó đối chiếu với giá thật."
               ghiChu={<NhanVaiTro vaiTro="co-hoc" />}>
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

        <Slide so={18} tieuDe="Hạn chế"
               chot="Ba hạn chế lớn, và hai trong đó vẫn dẫn tới cùng một kết luận.">
          <div className="grid gap-[1.8vh] leading-snug">
            <div>
              <p className="font-semibold">Chi phí đổi giá</p>
              <p>
                Cửa hàng có thể ngại đổi giá vì mỗi lần đổi đều tốn công và ảnh hưởng vận hành.
                Nhưng dù lý do là gì, <strong>người mua vẫn trả đúng số tiền cũ</strong> — hạn chế
                này không đổi kết luận.
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

        <Slide so={19} tieuDe="Kết luận"
               chot="Cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ."
               ghiChu={<NhanVaiTro vaiTro="chinh" />}>
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
