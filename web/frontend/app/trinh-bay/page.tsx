"use client";

/**
 * Trang Trình bày — slide tóm tắt cho buổi báo cáo. Dùng lại đúng các hook và
 * component biểu đồ của các trang phân tích (`lib/hooks.ts`, `components/charts/*`)
 * nên không thể lệch số với phần còn lại của web.
 *
 * Người xem chỉ nhìn mỗi slide vài giây, nên mỗi slide bắt buộc có MỘT câu chốt
 * (`chot`) đặt ngay đầu phần nội dung, và mọi khối có số đều kèm `<DienGiai>`.
 */
import type { ReactNode } from "react";
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { TostPlot } from "@/components/charts/tost-plot";
import { SoDoLuongMau } from "@/components/charts/so-do-luong-mau";
import { BaCongChanDoan } from "@/components/ket-qua/ba-cong-chan-doan";
import { DienGiai } from "@/components/site/dien-giai";
import { ThanhTiLe } from "@/components/site/thanh-ti-le";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBamChuan, useDoNhay, useLamTron, useSanLuong, useUocLuongChinh } from "@/lib/hooks";
import {
  DO_NHAY_CHUA_RO_CO_SO,
  DO_NHAY_CHUA_RO_TRUC,
  DO_NHAY_CHUA_RO_Z1,
  THUE_SUAT_SAU_CHINH_SACH,
  THUE_SUAT_TRUOC_CHINH_SACH,
} from "@/lib/hang-so-chinh-sach";
import type { BamChuanRow, UocLuongChinhRow } from "@/lib/types";
import { dinhDangDiemLog, dinhDangP, dinhDangPhanTram, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";

function Slide({
  so,
  tong,
  tieuDe,
  chot,
  children,
}: {
  so: number;
  tong: number;
  tieuDe: string;
  /** Một câu người xem nhớ được sau vài giây — bắt buộc, hiện ngay đầu slide. */
  chot: string;
  children: ReactNode;
}) {
  return (
    <Card className="scroll-mt-20">
      <CardHeader>
        <p className="text-xs text-muted-foreground">
          Slide {so}/{tong}
        </p>
        <CardTitle className="text-xl">{tieuDe}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="border-l-4 border-foreground/50 pl-3 text-base font-medium leading-snug">
          {chot}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}

export default function TrangTrinhBay() {
  const doNhay = useDoNhay();
  const sanLuong = useSanLuong();
  const lamTron = useLamTron();
  const bamChuan = useBamChuan();
  const uocLuong = useUocLuongChinh();
  const tongSlide = 11;

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Trình bày</h1>
        <p className="text-muted-foreground">
          Mười một slide dưới đây dùng chung dữ liệu với các trang phân tích ở trên — không có con
          số nào tách rời hay có thể lệch nhau. Mỗi slide mở đầu bằng một câu chốt; phần bên dưới
          là bằng chứng cho câu đó. Cuộn để xem toàn bộ, hoặc trình chiếu từng slide khi báo cáo
          trực tiếp.
        </p>
      </header>

      <Slide
        so={1}
        tong={tongSlide}
        tieuDe="Câu hỏi của đồ án"
        chot="Nhà nước bớt thuế cho một nhóm hàng — phần bớt đó có tới tay người mua không?"
      >
        <p>
          Từ 01/07/2025, Nghị quyết 204/2025/QH15 hạ thuế GTGT của nhiều mặt hàng từ{" "}
          {dinhDangPhanTram(THUE_SUAT_TRUOC_CHINH_SACH, 0)} xuống{" "}
          {dinhDangPhanTram(THUE_SUAT_SAU_CHINH_SACH, 0)}. Nếu phần thuế bớt đi được chuyển hết
          vào giá, người mua phải trả ít tiền hơn cho đúng món hàng cũ.
        </p>
        <p>
          Đồ án so giá của <strong>cùng một mã hàng</strong> trước và sau ngày đó, tại{" "}
          <strong>một</strong> cửa hàng tiện lợi TP.HCM, rồi hỏi tiếp: chênh lệch quan sát được có
          quy cho chính sách được không.
        </p>
      </Slide>

      <Slide
        so={2}
        tong={tongSlide}
        tieuDe="Thí nghiệm tự nhiên không hoàn hảo"
        chot="Luật đổi từ bên ngoài cửa hàng, nhưng cửa hàng thực thi không hoàn hảo."
      >
        <p>
          Nghị quyết 204/2025/QH15 tạo ra thay đổi từ bên ngoài cửa hàng, nên được xem là nguồn biến
          thiên ngoại sinh. Nhưng thực thi không hoàn hảo: có <strong>không tuân thủ</strong> khi
          cửa hàng chưa cập nhật đúng thuế, nhóm đối chứng từng <strong>bị ô nhiễm</strong> vì chứa
          mặt hàng luật cho giảm, và{" "}
          <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} inline>
            {(hang) => {
              const coSo = hang.find(
                (h) => h.truc === DO_NHAY_CHUA_RO_TRUC && h.muc === DO_NHAY_CHUA_RO_CO_SO
              );
              const ganZ1 = hang.find(
                (h) => h.truc === DO_NHAY_CHUA_RO_TRUC && h.muc === DO_NHAY_CHUA_RO_Z1
              );
              const so = coSo && ganZ1 ? ganZ1.n - coSo.n : undefined;
              return <strong>{so !== undefined ? dinhDangSoNguyen(so) : "—"}</strong>;
            }}
          </TrangThaiDuLieu>{" "}
          SKU chưa phân loại được về địa vị pháp lý.
        </p>
        <DienGiai>
          <p>
            Con số trên là các mã hàng nhóm không xếp chắc được vào bên nào — luật cho giảm hay
            không. Chúng không bị vứt đi mà được thử gán về cả hai phía để xem kết luận có đổi
            không.
          </p>
          <p>
            Nghĩa là ngay ở bước phân nhóm, ranh giới đã không sạch. Mọi so sánh phía sau đều mang
            theo phần mờ này.
          </p>
        </DienGiai>
        <NhanVaiTro vaiTro="chinh" />
      </Slide>

      <Slide
        so={3}
        tong={tongSlide}
        tieuDe="Hai phương pháp, chung một cách tách ảnh hưởng của thuế"
        chot="Hai cách tính, nhưng chung một giả định gốc — nên chúng không kiểm chứng lẫn nhau."
      >
        <p>
          ATT là chênh lệch trung bình cần ước lượng cho nhóm được luật cho giảm thuế. Khung Kết quả
          tiềm năng hỏi giá của cùng SKU sẽ ra sao dưới mỗi trạng thái chính sách. Hồi quy và phân
          tầng <strong>không phải hai xác nhận độc lập</strong> — cả hai cùng dựa trên giả định xu
          hướng song song.
        </p>
        <DienGiai kieu="vi-du">
          <p>
            Giống hai người cùng đo một bức tường bằng chung một cái thước cong. Hai kết quả trùng
            nhau không chứng minh cái thước thẳng.
          </p>
          <p>
            Vì vậy khi hai phương pháp cho cùng một hướng, đó chưa phải bằng chứng cộng thêm — chỉ
            là cùng một giả định được dùng hai lần.
          </p>
        </DienGiai>
      </Slide>

      <Slide
        so={4}
        tong={tongSlide}
        tieuDe="Cân bằng thất bại, TOST tiền xu hướng không đạt"
        chot="Hai nhóm hàng đã khác nhau từ trước ngày giảm thuế."
      >
        <p>
          TOST tiền xu hướng kiểm tra chênh lệch trước chính sách có đủ nhỏ để xem hai nhóm đi gần
          song song không. Ba cổng chẩn đoán không phải ba lá phiếu; cổng đạt không bù được cổng
          trượt.
        </p>
        <DienGiai>
          <p>
            Ba cổng là ba bài kiểm tra bắt buộc phải qua trước khi được phép nói chuyện nhân quả.
            Chúng kiểm ba chuyện khác nhau, nên đạt cái này không gỡ được cái kia.
          </p>
          <p>
            Hệ quả: mọi con số ở các slide sau chỉ là <strong>so sánh có điều chỉnh</strong>, không
            phải tác động sạch của chính sách.
          </p>
        </DienGiai>
        <BaCongChanDoan />
      </Slide>

      <Slide
        so={5}
        tong={tongSlide}
        tieuDe="So sánh giá trên SKU sống sót — mọi KTC chứa 0"
        chot="Chênh lệch giá đo được nhỏ hơn độ nhiễu của chính dữ liệu."
      >
        <p>KTC là khoảng các mức chênh lệch vẫn còn phù hợp với dữ liệu, không chỉ một con số điểm.</p>
        <DienGiai kieu="canh-bao">
          <p>
            Khoảng nào cũng chứa 0, nghĩa là dữ liệu chưa loại được khả năng hai nhóm không chênh
            nhau.
          </p>
          <p>
            Đừng đọc ngược thành &ldquo;không có tác động&rdquo;: cùng khoảng đó còn chứa nhiều mức
            chênh lệch khác 0 mà dữ liệu cũng không loại được.
          </p>
        </DienGiai>
        <BieuDoHeSo />
      </Slide>

      <Slide
        so={6}
        tong={tongSlide}
        tieuDe="TOST thất bại chủ yếu vì biên quá hẹp"
        chot="Dữ liệu không đủ mịn để xác nhận cả chiều “gần như không đổi”."
      >
        <p>
          TOST hỏi chênh lệch có đủ nhỏ để xem là gần như tương đương không. Không kết luận được giá
          không giảm hay phần giảm thuế đi vào giá (pass-through) bằng 0. Biên tương đương đã chọn
          nhỏ hơn mức cần cho 80% sức mạnh ở cả bốn đặc tả.
        </p>
        <DienGiai kieu="vi-du">
          <p>
            Giống đo tiếng thì thầm giữa chợ: micro không hỏng, chợ ồn. Biên nhóm khóa trước hẹp hơn
            độ chính xác dữ liệu, nên phép kiểm gần như không thể đạt dù thực tế thế nào.
          </p>
          <p>Vì vậy TOST thất bại ở đây nói về giới hạn của dữ liệu, không nói về hành vi giá.</p>
        </DienGiai>
        <TostPlot />
      </Slide>

      <Slide
        so={7}
        tong={tongSlide}
        tieuDe="Bác bỏ chuyển hoàn toàn phụ thuộc phương pháp"
        chot="Kết quả này đổi theo cách tính, nên không được lấy làm kết luận chính."
      >
        <p>
          Ba trong bốn đặc tả bác bỏ mốc chuyển hoàn toàn phần giảm thuế. G-computation — dùng mô
          hình để dự đoán mỗi SKU dưới cả hai trạng thái rồi lấy chênh lệch — thì không. Theo quy
          tắc khóa trước, <strong>không lấy đa số làm biểu quyết</strong>.
        </p>
        <DienGiai>
          <p>
            Khi một kết luận chỉ xuất hiện ở một số cách tính, thứ đáng báo cáo là chính sự phụ
            thuộc đó, không phải bên đông hơn.
          </p>
          <p>
            Điều vẫn đứng vững nằm ở slide cuối và không cần mô hình nào: giá thực tế đếm được đã
            không bám mức lẽ ra phải có.
          </p>
        </DienGiai>
      </Slide>

      <Slide
        so={8}
        tong={tongSlide}
        tieuDe="Chọn lọc sống sót làm suy yếu thêm diễn giải giá"
        chot="Chỉ so được giá của những mặt hàng còn bán ở cả hai giai đoạn."
      >
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const moRong = hang.find((h) => h.nhanh === "biên độ mở rộng");
            if (!moRong) return null;
            return (
              <p>
                Tỉ lệ sống sót của hai nhóm chênh{" "}
                <strong>{dinhDangSo(moRong.uoc_luong, 1)} điểm phần trăm</strong> ({dinhDangP(moRong.p)}
                ). Giá hậu kỳ chỉ quan sát được khi SKU còn bán — kết quả giá vì vậy{" "}
                <strong>không phải</strong> ITT vô điều kiện: đây là mẫu SKU có giá ở cả hai kỳ,
                không phải toàn bộ cohort tiền kỳ, tức toàn bộ nhóm SKU có ở giai đoạn trước chính
                sách.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <DienGiai kieu="vi-du">
          <p>
            Giống muốn biết chiều cao trung bình cả trường nhưng chỉ đo được các em còn ở lại lớp
            bóng rổ. Số đo lệch không phải vì đo sai, mà vì chọn nhầm người để đo.
          </p>
          <p>
            Hệ quả: kết quả giá chỉ nói về nhóm mặt hàng sống sót, không nói thay cho những mặt
            hàng đã biến mất khỏi kệ.
          </p>
        </DienGiai>
        <SoDoLuongMau />
      </Slide>

      <Slide
        so={9}
        tong={tongSlide}
        tieuDe="Sản lượng và việc còn bán chỉ là khám phá"
        chot="Nhánh sản lượng chỉ để tham khảo — dữ liệu chưa đủ mịn để kết luận."
      >
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const tangCuong = hang.find((h) => h.nhanh === "biên độ tăng cường");
            if (!tangCuong) return null;
            return (
              <p>
                Chênh lệch sản lượng chuẩn hóa theo ngày: <strong>{dinhDangDiemLog(tangCuong.uoc_luong)}</strong>{" "}
                ({dinhDangP(tangCuong.p)}), MDE 80% là <strong>{dinhDangDiemLog(tangCuong.mde)}</strong> —
                MDE là thay đổi nhỏ nhất thiết kế có khả năng phát hiện đủ tin cậy. Thiết kế không
                đủ lực phát hiện các thay đổi nhỏ hơn mức này.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <DienGiai kieu="vi-du">
          <p>
            Giống cái cân vạch chia 1 kg: cân được người tăng 3 kg, nhưng tăng 400 g thì báo
            &ldquo;không đổi&rdquo;. Không phải họ không tăng, mà cân không đủ mịn.
          </p>
          <p>
            MDE ở đây lớn hơn nhiều so với mức chênh lệch đo được, nên p-value của nhánh này không
            được đọc như &ldquo;suýt có ý nghĩa&rdquo;.
          </p>
        </DienGiai>
        <NhanVaiTro vaiTro="kham-pha" />
      </Slide>

      <Slide
        so={10}
        tong={tongSlide}
        tieuDe="Mô phỏng làm tròn — chuẩn cơ học, không phải hành vi"
        chot="Bộ quy tắc làm tròn đã thử không đủ để giải thích việc giá đứng yên."
      >
        <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const luoi1000 = hang.find((h) => h.buoc_lam_tron === 1000);
            if (!luoi1000) return null;
            return (
              <p>
                Với giả định chuyển hoàn toàn và làm tròn gần nhất tới 1.000đ,{" "}
                <strong>{dinhDangPhanTram(luoi1000.ti_le_doi_muc, 1)}</strong> SKU sẽ đổi mức giá
                niêm yết. Quy tắc làm tròn khó che mức giảm cơ học cho phần lớn SKU — nhưng đây
                không phải bằng chứng về hành vi định giá thật.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <DienGiai>
          <p>
            Con số trên trả lời một câu hỏi trên giấy: nếu giảm giá đúng theo thuế rồi làm tròn tới
            nghìn đồng gần nhất, bao nhiêu mã hàng sẽ phải đổi mức giá niêm yết. Phần lớn sẽ phải
            đổi.
          </p>
          <p>
            Nên không thể đổ cho việc &ldquo;làm tròn nuốt mất phần giảm&rdquo; trong bộ quy tắc đã
            thử. Đây là phép tính cơ học, không nói gì về cách cửa hàng thực sự ra quyết định giá.
          </p>
        </DienGiai>
        <NhanVaiTro vaiTro="co-hoc" />
      </Slide>

      <Slide
        so={11}
        tong={tongSlide}
        tieuDe="Kết luận — điều tìm ra được"
        chot="Cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ."
      >
        <TrangThaiDuLieu
          dangTai={bamChuan.dangTai}
          loi={bamChuan.loi}
          duLieu={bamChuan.duLieu}
          thuLai={bamChuan.thuLai}
          chieuCaoTai="h-32"
        >
          {(hang) => <BangChungDemDuoc hang={hang} />}
        </TrangThaiDuLieu>
        <TrangThaiDuLieu
          dangTai={uocLuong.dangTai}
          loi={uocLuong.loi}
          duLieu={uocLuong.duLieu}
          thuLai={uocLuong.thuLai}
          chieuCaoTai="h-12"
        >
          {(hang) => <CauPassThrough hang={hang} />}
        </TrangThaiDuLieu>
        <DienGiai>
          <p>
            Ba bằng chứng trên đếm trực tiếp từ giá bán thật, không cần mô hình nào: rất ít mặt
            hàng đạt đúng mức giá lẽ ra phải có, phần lớn giữ nguyên giá cũ, và phần thuế thực sự
            đi vào giá chỉ bằng một phần nhỏ mức chuyển hoàn toàn.
          </p>
          <p>
            Vì vậy các hạn chế ở những slide trước làm yếu đi phần <em>độ lớn tác động</em>, không
            lật ngược phát hiện này.
          </p>
        </DienGiai>
        <p className="text-sm text-muted-foreground">
          Điều đồ án <strong>chưa</strong> nói được: bao nhiêu phần trong đó <em>do chính sách gây
          ra</em>. Hai nhóm hàng khác nhau từ trước, nên phép so sánh nhân quả chưa đủ chắc để gắn
          một con số cho phần này.
        </p>
        <p className="text-sm text-muted-foreground">
          Đóng góp đáng tin nhất của đồ án cũng nằm ở đó: một minh họa minh bạch về giới hạn của
          nhận dạng — khả năng tách riêng ảnh hưởng của thuế — cùng không tuân thủ và chọn lọc mẫu
          trong dữ liệu bán lẻ thực tế.
        </p>
        <NhanVaiTro vaiTro="chinh" />
      </Slide>
    </div>
  );
}

/**
 * Hai bằng chứng đếm được ở nhóm được giảm thuế: bao nhiêu mặt hàng đạt đúng mức giá
 * lẽ ra phải có, và bao nhiêu mặt hàng giữ nguyên giá cũ. Mẫu số chung là số mặt hàng
 * lẽ ra phải đổi giá — mọi trị số lấy từ `/api/bam-chuan`.
 */
function BangChungDemDuoc({ hang }: { hang: BamChuanRow[] }) {
  const duocGiam = hang.find((h) => h.Z === 1);
  if (!duocGiam) return null;
  return (
    <div className="grid gap-3">
      <p>
        Nếu cửa hàng giảm giá đúng theo phần thuế được giảm rồi làm tròn tới nghìn đồng,{" "}
        <strong>{dinhDangSoNguyen(duocGiam.n_du_bao_doi_muc)}</strong> mặt hàng lẽ ra phải đổi giá.
      </p>
      <ThanhTiLe
        nhan="Đạt đúng mức giá lẽ ra phải có"
        tuSo={duocGiam.n_bam_chuan}
        mauSo={duocGiam.n_du_bao_doi_muc}
        noiBat
        ghiChu="Trên tổng số mặt hàng lẽ ra phải đổi giá."
      />
      <ThanhTiLe
        nhan="Giữ nguyên giá cũ"
        tuSo={duocGiam.n_giu_nguyen_gia}
        mauSo={duocGiam.n_du_bao_doi_muc}
        ghiChu="Người mua trả đúng số tiền như trước ngày giảm thuế."
      />
    </div>
  );
}

/**
 * `pass_through` là tỉ lệ phần giảm thuế đi vào giá, do pipeline tính sẵn. Chỉ lấy
 * khoảng nhỏ nhất–lớn nhất trong các đặc tả chính, không chọn riêng một con số.
 */
function CauPassThrough({ hang }: { hang: UocLuongChinhRow[] }) {
  const ty = hang
    .filter((h) => h.vai_tro === "chính" && h.pass_through != null)
    .map((h) => h.pass_through as number);
  if (ty.length === 0) return null;
  return (
    <p>
      Phần giảm thuế thực sự đi vào giá chỉ khoảng{" "}
      <strong>
        {dinhDangPhanTram(Math.min(...ty), 0)} – {dinhDangPhanTram(Math.max(...ty), 0)}
      </strong>{" "}
      mức chuyển hoàn toàn — một phần nhỏ so với chuyển hết.
    </p>
  );
}
