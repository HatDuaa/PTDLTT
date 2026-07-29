"use client";

/**
 * Trang Kết quả — bốn ước lượng chính, kết quả theo tầng, ba cổng chẩn đoán, lưới
 * độ nhạy đầy đủ (kể cả kết quả bất lợi). Nguồn: `/api/uoc-luong-chinh`,
 * `/api/bam-chuan`, `/api/theo-tang`, `/api/cong-chan-doan`, `/api/do-nhay`.
 */
import { AlertTriangleIcon } from "lucide-react";
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { TostPlot } from "@/components/charts/tost-plot";
import { BaCongChanDoan } from "@/components/ket-qua/ba-cong-chan-doan";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { DienGiai } from "@/components/site/dien-giai";
import { ThanhTiLe } from "@/components/site/thanh-ti-le";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBamChuan, useDoNhay, useTheoTang, useUocLuongChinh } from "@/lib/hooks";
import {
  dinhDangDiemLog,
  dinhDangKtc,
  dinhDangP,
  dinhDangPhanTram,
  dinhDangSo,
  dinhDangSoNguyen,
  dinhDangTien,
} from "@/lib/format";
import { chuanHoaVaiTro } from "@/lib/vai-tro";
import { ALPHA } from "@/lib/nguong-thiet-ke";
import type { BamChuanRow, DoNhayRow, TheoTangRow, UocLuongChinhRow } from "@/lib/types";
import {
  MAU_SO_SANH_CHINH,
  THUE_SUAT_SAU_CHINH_SACH,
  THUE_SUAT_TRUOC_CHINH_SACH,
} from "@/lib/hang-so-chinh-sach";

export default function TrangKetQua() {
  const uocLuongChinh = useUocLuongChinh();
  const bamChuan = useBamChuan();
  const theoTang = useTheoTang();
  const doNhay = useDoNhay();

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Kết quả</h1>
        <p className="text-muted-foreground">
          Cổng cân bằng đã trượt (xem trang Thiết kế). Theo quy tắc khóa trước, cả hai phương pháp
          dưới đây là <strong>so sánh có điều chỉnh</strong>, không phải ước lượng nhân quả sạch.
        </p>
      </header>

      <BieuDoHeSo />

      <KhoiKetQua
        tieuDe="Bốn ước lượng chính — bảng đầy đủ"
        moTa="SE là độ bất định của ước lượng; KTC 95% là khoảng các giá trị còn phù hợp với dữ liệu. Cả bốn khoảng đều chứa 0."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const chinh = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "chinh");
            const soAm = chinh.filter((h) => h.uoc_luong < 0).length;
            const soPhuKhong = chinh.filter((h) => h.ktc_duoi <= 0 && h.ktc_tren >= 0).length;
            return (
              <div className="grid gap-4">
                <BangDuLieu<UocLuongChinhRow>
                  cot={[
                    { khoa: "pp", nhan: "Phương pháp" },
                    { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
                    { khoa: "se", nhan: "SE", dinhDang: (h) => dinhDangSo(h.se, 3) },
                    { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                    { khoa: "ktc", nhan: "KTC 95%", dinhDang: (h) => dinhDangKtc(h.ktc_duoi, h.ktc_tren) },
                  ]}
                  hang={chinh}
                />

                <DienGiai>
                  <p>
                    Biểu đồ ở trên và bảng này là cùng một tập số: {dinhDangSoNguyen(chinh.length)}{" "}
                    cách tính khác nhau trên cùng một bộ dữ liệu, không phải{" "}
                    {dinhDangSoNguyen(chinh.length)} nghiên cứu độc lập. Ước lượng mang dấu âm ở{" "}
                    {dinhDangSoNguyen(soAm)}/{dinhDangSoNguyen(chinh.length)} cách tính — giá nhóm
                    được giảm thuế nhích lên ít hơn nhóm không được giảm. Nhưng khoảng tin cậy vẫn phủ
                    qua 0 ở {dinhDangSoNguyen(soPhuKhong)}/{dinhDangSoNguyen(chinh.length)} cách, tức
                    chênh lệch nhỏ tới mức chưa tách được khỏi nhiễu.
                  </p>
                </DienGiai>
              </div>
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Giá thực tế có giảm đúng theo phần thuế được giảm không?"
        vaiTro="co-hoc"
      >
        <TrangThaiDuLieu
          dangTai={bamChuan.dangTai}
          loi={bamChuan.loi}
          duLieu={bamChuan.duLieu}
          thuLai={bamChuan.thuLai}
          chieuCaoTai="h-72"
        >
          {(hang: BamChuanRow[]) => {
            const nhomDuocGiam = hang.find((h) => h.Z === 1);
            const nhomGiaDuoc = hang.find((h) => h.Z === 0);
            const buocLamTron = nhomDuocGiam?.buoc_lam_tron ?? nhomGiaDuoc?.buoc_lam_tron;

            return (
              <div className="grid gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Nếu cửa hàng thật sự giảm giá theo thuế, giá mới của từng mặt hàng phải là bao
                  nhiêu? Nhóm lấy giá trước chính sách, giảm theo tỉ lệ thuế từ{" "}
                  {dinhDangPhanTram(THUE_SUAT_TRUOC_CHINH_SACH, 0)} xuống{" "}
                  {dinhDangPhanTram(THUE_SUAT_SAU_CHINH_SACH, 0)}, rồi làm tròn đến{" "}
                  {dinhDangSoNguyen(buocLamTron)} đồng, sau đó so với giá bán thực tế.
                </p>

                <BangDuLieu<BamChuanRow>
                  cot={[
                    { khoa: "vai_tro", nhan: "Nhóm" },
                    {
                      khoa: "n_du_bao_doi_muc",
                      nhan: "Số lẽ ra phải đổi giá",
                      dinhDang: (h) => dinhDangSoNguyen(h.n_du_bao_doi_muc),
                    },
                    {
                      khoa: "n_bam_chuan",
                      nhan: "Số có giá đúng mức dự kiến",
                      dinhDang: (h) => dinhDangSoNguyen(h.n_bam_chuan),
                    },
                    {
                      khoa: "ti_le_bam_chuan",
                      nhan: "Tỉ lệ",
                      dinhDang: (h) => dinhDangPhanTram(h.ti_le_bam_chuan),
                    },
                    {
                      khoa: "ktc95_wilson",
                      nhan: "KTC 95%",
                      dinhDang: (h) =>
                        `${dinhDangPhanTram(h.ktc95_wilson_duoi)} – ${dinhDangPhanTram(
                          h.ktc95_wilson_tren
                        )}`,
                    },
                  ]}
                  hang={hang}
                  classNameHang={(h) =>
                    h.Z === 1 ? "bg-primary/5 font-medium hover:bg-primary/10" : undefined
                  }
                />

                {nhomDuocGiam && (
                  <div className="grid gap-3">
                    <ThanhTiLe
                      nhan="Có giá đúng mức dự kiến"
                      tuSo={nhomDuocGiam.n_bam_chuan}
                      mauSo={nhomDuocGiam.n_du_bao_doi_muc}
                      noiBat
                      ghiChu="Trong số mặt hàng được giảm thuế lẽ ra phải đổi giá."
                    />
                    <ThanhTiLe
                      nhan="Giữ y nguyên giá cũ"
                      tuSo={nhomDuocGiam.n_giu_nguyen_gia}
                      mauSo={nhomDuocGiam.n_du_bao_doi_muc}
                      ghiChu="Cùng mẫu số: bán đúng giá như trước ngày giảm thuế."
                    />
                  </div>
                )}

                {nhomDuocGiam && nhomGiaDuoc ? (
                  <p className="text-sm leading-relaxed">
                    Trong{" "}
                    <strong>{dinhDangSoNguyen(nhomDuocGiam.n_du_bao_doi_muc)} mặt hàng</strong>{" "}
                    lẽ ra phải đổi giá, chỉ{" "}
                    <strong>{dinhDangSoNguyen(nhomDuocGiam.n_bam_chuan)} mặt hàng</strong> đạt đúng
                    mức dự kiến;{" "}
                    <strong>{dinhDangSoNguyen(nhomDuocGiam.n_giu_nguyen_gia)} mặt hàng</strong> giữ
                    nguyên giá cũ. Tỉ lệ khớp ở nhóm được giảm thuế (
                    {dinhDangPhanTram(nhomDuocGiam.ti_le_bam_chuan)}) không cao hơn nhóm đối chiếu (
                    {dinhDangPhanTram(nhomGiaDuoc.ti_le_bam_chuan)}).
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Backend chưa trả đủ hai nhóm để viết nhận xét đối chiếu.
                  </p>
                )}

                <DienGiai>
                  <p>
                    Nếu cửa hàng hạ giá đúng theo phần thuế được giảm thì mọi mặt hàng ở hàng trên lẽ
                    ra phải đổi giá. Thực tế gần như không mặt hàng nào chạm đúng mức đó, phần lớn giữ
                    y nguyên giá cũ — người mua trả đúng số tiền như trước. Nhóm đối chiếu vốn không
                    được giảm thuế mà tỉ lệ khớp cũng tương tự, nên vài lần trùng mức chỉ là tình cờ.
                  </p>
                </DienGiai>

                <Alert>
                  <AlertTriangleIcon aria-hidden="true" />
                  <AlertTitle>Cảnh báo về diễn giải</AlertTitle>
                  <AlertDescription>
                    Đây là so sánh mô tả hậu kiểm, <strong>không phải ước lượng tác động nhân quả</strong>.
                    {" "}Hậu kiểm nghĩa là phép so sánh này được thêm sau khi đã xem kết quả chính.
                    {" "}Khoảng Wilson là cách tính KTC phù hợp khi số lần khớp quan sát được rất ít.
                  </AlertDescription>
                </Alert>
              </div>
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Hai giả thuyết: ATT = 0 và chuyển hoàn toàn"
        moTa="ATT là chênh lệch trung bình cần ước lượng cho nhóm được luật cho giảm thuế. Việc bác bỏ mốc chuyển hoàn toàn phụ thuộc phương pháp — không lấy đa số làm biểu quyết."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const chinh = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "chinh");
            const soBacBo = chinh.filter(
              (h) => h.p_chuyen_hoan_toan !== null && h.p_chuyen_hoan_toan < ALPHA
            ).length;
            return (
              <div className="grid gap-4">
                <BangDuLieu<UocLuongChinhRow>
                  cot={[
                    { khoa: "pp", nhan: "Phương pháp" },
                    {
                      khoa: "pass_through",
                      nhan: "Phần giảm thuế đi vào giá (pass-through)",
                      dinhDang: (h) => dinhDangSo(h.pass_through, 3),
                    },
                    { khoa: "p", nhan: "H₀: ATT=0", dinhDang: (h) => dinhDangP(h.p) },
                    {
                      khoa: "p_chuyen_hoan_toan",
                      nhan: "H₀: chuyển hoàn toàn",
                      dinhDang: (h) =>
                        `${dinhDangP(h.p_chuyen_hoan_toan)} → ${
                          h.p_chuyen_hoan_toan !== null && h.p_chuyen_hoan_toan < ALPHA ? "bác bỏ" : "không bác bỏ"
                        }`,
                    },
                  ]}
                  hang={chinh}
                />

                <DienGiai>
                  <p>
                    Hai cột cuối là hai câu hỏi khác nhau: &ldquo;giá có nhúc nhích không&rdquo; và
                    &ldquo;cửa hàng có giảm đủ mức thuế không&rdquo;. Câu đầu dữ liệu không trả lời
                    được. Câu sau thì {dinhDangSoNguyen(soBacBo)}/{dinhDangSoNguyen(chinh.length)} cách
                    tính nói là không đủ mức
                    {soBacBo < chinh.length ? ", phần còn lại thì không" : ""} — câu trả lời đổi theo
                    cách tính, nên quy tắc khóa trước không cho lấy số đông làm biểu quyết.
                  </p>
                </DienGiai>
              </div>
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <div className="grid gap-3">
        <TostPlot />
        <DienGiai kieu="canh-bao">
          <p>
            Kiểm định này hỏi ngược lại câu thường gặp: chênh lệch có đủ nhỏ để coi hai nhóm là gần
            như nhau không. Không khoảng nào lọt gọn vào vùng tương đương, nhưng đó là vì vùng được
            vẽ quá hẹp so với độ mịn của dữ liệu. Không đọc điều đó thành &ldquo;chênh lệch khác
            0&rdquo;.
          </p>
        </DienGiai>
      </div>

      <KhoiKetQua
        tieuDe="Kết quả theo tầng"
        moTa="Chưa thể phân biệt dị biệt thật với nhiễu ở bất kỳ tầng nào — không đào sâu riêng một tầng."
        vaiTro="kham-pha"
      >
        <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu} thuLai={theoTang.thuLai} chieuCaoTai="h-56">
          {(hang: TheoTangRow[]) => {
            const itt = hang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
            return (
              <div className="grid gap-4">
                <BangDuLieu<TheoTangRow>
                  cot={[
                    { khoa: "tang", nhan: "Tầng" },
                    {
                      khoa: "gia_min",
                      nhan: "Khoảng giá nền",
                      dinhDang: (h) => `${dinhDangTien(h.gia_min)} – ${dinhDangTien(h.gia_max)}`,
                    },
                    { khoa: "n1", nhan: "n(Z=1)", dinhDang: (h) => dinhDangSoNguyen(h.n1) },
                    { khoa: "n0", nhan: "n(Z=0)", dinhDang: (h) => dinhDangSoNguyen(h.n0) },
                    { khoa: "w_s", nhan: "Trọng số", dinhDang: (h) => dinhDangSo(h.w_s, 3) },
                    { khoa: "tau_s", nhan: "τ̂ theo tầng", dinhDang: (h) => dinhDangDiemLog(h.tau_s) },
                  ]}
                  hang={itt}
                />

                <DienGiai>
                  <p>
                    Ở đây hàng hóa được xếp thành từng tầng theo mức giá trước chính sách, rồi tính
                    riêng cho mỗi tầng, để xem hàng rẻ và hàng đắt có phản ứng khác nhau không. Mỗi
                    tầng chỉ giữ một phần nhỏ số mặt hàng nên con số nhảy lên xuống thất thường, không
                    thành quy luật. Vì chưa tách được khác biệt thật khỏi nhiễu, nhóm không đào sâu
                    riêng tầng nào.
                  </p>
                </DienGiai>
              </div>
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <section aria-labelledby="tieu-de-cong-chan-doan" className="grid gap-3">
        <h2 id="tieu-de-cong-chan-doan" className="text-lg font-semibold">
          Ba cổng chẩn đoán
        </h2>
        <p className="text-sm text-muted-foreground">
          Ba cổng không phải ba lá phiếu: cổng đạt không bù được cổng trượt. Giả định xu hướng song
          song không được xác nhận; mọi diễn giải nhân quả chỉ có điều kiện.
        </p>
        <DienGiai kieu="vi-du">
          <p>
            Ví như ba bài kiểm tra xem hai nhóm có đem ra so sánh công bằng được không: hai nhóm có
            giống nhau từ trước không, cách tính có tự sinh ra chênh lệch khi chưa có chính sách
            không, và xu hướng giá trước đó có đủ sát nhau không. Trạng thái từng bài nằm ngay trong
            ba thẻ dưới đây, đọc riêng từng thẻ chứ đừng cộng lại thành một điểm chung. Bài đạt không
            bù được bài trượt.
          </p>
        </DienGiai>
        <BaCongChanDoan />
      </section>

      <KhoiKetQua
        tieuDe="Kết quả phụ — per-protocol theo D"
        moTa="Per-protocol là chia nhóm theo thuế cửa hàng thực sự áp. Cách này cần giả định quyết định cập nhật thuế không liên quan mức giá lẽ ra có nếu chính sách khác đi (giá phản thực)."
        vaiTro="phu"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const phu = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "phu");
            return (
              <div className="grid gap-4">
                <BangDuLieu<UocLuongChinhRow>
                  cot={[
                    { khoa: "pp", nhan: "Đối chứng" },
                    { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
                    { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                    { khoa: "ktc", nhan: "KTC 95%", dinhDang: (h) => dinhDangKtc(h.ktc_duoi, h.ktc_tren) },
                  ]}
                  hang={phu}
                />

                <DienGiai>
                  <p>
                    Các bảng chính chia nhóm theo luật: mặt hàng nào được luật cho giảm thuế. Bảng này
                    chia theo mức thuế cửa hàng thực sự bấm trên máy tính tiền. Cách chia sau sát thực
                    tế hơn, nhưng phải tin rằng cửa hàng không chọn cập nhật thuế dựa trên chính những
                    mặt hàng sắp đổi giá — nên nó chỉ để tham khảo, không dùng làm kết quả chính.
                  </p>
                </DienGiai>
              </div>
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Lưới độ nhạy — báo cáo toàn bộ, kể cả kết quả bất lợi"
        moTa="Survivorship là chỉ giữ mặt hàng còn được bán đủ số tuần yêu cầu. Lưới cũng đổi cửa sổ thời gian, cách phân loại và biến kết quả để xem kết luận có phụ thuộc một lựa chọn riêng hay không."
        vaiTro="phu"
      >
        <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} thuLai={doNhay.thuLai} chieuCaoTai="h-96">
          {(hang: DoNhayRow[]) => (
            <div className="grid gap-4">
              <BangDuLieu<DoNhayRow>
                cot={[
                  { khoa: "truc", nhan: "Trục" },
                  { khoa: "muc", nhan: "Mức" },
                  { khoa: "n", nhan: "n", dinhDang: (h) => dinhDangSoNguyen(h.n) },
                  { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
                  { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                  { khoa: "ktc", nhan: "KTC 95%", dinhDang: (h) => dinhDangKtc(h.ktc_duoi, h.ktc_tren) },
                ]}
                hang={hang}
              />

              <DienGiai>
                <p>
                  Mỗi dòng là một lần tính lại toàn bộ phân tích với một lựa chọn khác: đổi cửa sổ
                  thời gian, đổi cách phân loại mặt hàng, đổi biến kết quả. Mục đích là thử đi thử
                  lại xem kết luận có phụ thuộc vào một lựa chọn riêng của nhóm hay không. Nó không
                  đổi; những dòng ngược chiều cũng để nguyên trong bảng chứ không cắt bớt.
                </p>
              </DienGiai>
            </div>
          )}
        </TrangThaiDuLieu>
      </KhoiKetQua>
    </div>
  );
}
