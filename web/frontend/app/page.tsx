"use client";

/**
 * Trang chủ — Tóm tắt. Mở đầu bằng HẠN CHẾ và câu hỏi nghiên cứu, không phải bằng
 * một con số ấn tượng. Đây là quy tắc bắt buộc số một của đồ án này.
 */
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import { useBamChuan, useDoNhay, useTheoTang, useUocLuongChinh } from "@/lib/hooks";
import { dinhDangSoNguyen } from "@/lib/format";
import type { BamChuanRow, DoNhayRow, TheoTangRow, UocLuongChinhRow } from "@/lib/types";
import {
  DO_NHAY_CHUA_RO_CO_SO,
  DO_NHAY_CHUA_RO_TRUC,
  DO_NHAY_CHUA_RO_Z1,
  MAU_SO_SANH_CHINH,
} from "@/lib/hang-so-chinh-sach";

export default function TrangChu() {
  const theoTang = useTheoTang();
  const doNhay = useDoNhay();
  const bamChuan = useBamChuan();
  const uocLuong = useUocLuongChinh();

  return (
    <div className="grid gap-8">
      <section aria-labelledby="tieu-de-han-che">
        <Alert className="border-l-4">
          <AlertTitle id="tieu-de-han-che" className="text-base">
            Đọc trước khi xem bất kỳ con số nào ở đây
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm">
            <p>
              Đồ án này đánh giá thí nghiệm tự nhiên <strong>không hoàn hảo</strong>: cửa hàng có
              không tuân thủ khi cập nhật thuế, nhóm đối chứng từng bị ô nhiễm — tức có mặt hàng
              luật cho giảm nhưng bị xếp theo thuế cửa hàng thực áp — và{" "}
              <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} inline>
                {(hang) => <SoSkuChuaPhanLoai hang={hang} />}
              </TrangThaiDuLieu>{" "}
              SKU chưa phân loại được về địa vị pháp lý.
            </p>
            <p>
              Cân bằng tiền kỳ giữa nhóm can thiệp và nhóm đối chứng <strong>thất bại</strong> sau
              phân tầng. Kiểm định tương đương tiền xu hướng — kiểm tra xem hai nhóm trước chính
              sách có đủ giống nhau hay không — cũng <strong>không đạt</strong>. Theo quy tắc khóa
              trước của đồ án, kết luận nhân quả vì vậy chỉ có điều kiện — xem đầy đủ ở{" "}
              <Link href="/han-che" className="underline underline-offset-2">
                trang Hạn chế
              </Link>
              .
            </p>
          </AlertDescription>
        </Alert>
      </section>

      <section aria-labelledby="cau-hoi-nghien-cuu" className="grid gap-3">
        <h1 id="cau-hoi-nghien-cuu" className="text-2xl font-semibold">
          Việc giảm thuế GTGT từ 10% xuống 8% (01/07/2025) có làm giảm giá bán lẻ mà người tiêu
          dùng thực trả không?
        </h1>
        <p className="text-muted-foreground">
          Đồ án dùng Nghị quyết 204/2025/QH15 làm thí nghiệm tự nhiên: quyết định giảm thuế do Quốc
          hội ban hành, không do cửa hàng — nhưng dữ liệu cho thấy việc thực thi không hoàn hảo. Đơn
          vị phân tích: SKU (mã vạch) sai phân trước–sau, tức so sánh mức thay đổi của cùng một mã
          hàng, tại <strong>một</strong> cửa hàng tiện lợi TP.HCM. Đơn vị hiệu ứng:{" "}
          <strong>điểm log ×100</strong>, có thể đọc gần như phần trăm khi mức thay đổi nhỏ.
        </p>
      </section>

      <section aria-labelledby="ket-luan-chinh" className="grid gap-3">
        <h2 id="ket-luan-chinh" className="text-lg font-semibold">
          Kết luận
        </h2>
        <p>
          Kết quả rõ nhất của đồ án là{" "}
          <strong>cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ</strong>.
        </p>
        <TrangThaiDuLieu dangTai={bamChuan.dangTai} loi={bamChuan.loi} duLieu={bamChuan.duLieu} chieuCaoTai="h-12">
          {(hang) => <CauBamChuan hang={hang} />}
        </TrangThaiDuLieu>
        <TrangThaiDuLieu dangTai={uocLuong.dangTai} loi={uocLuong.loi} duLieu={uocLuong.duLieu} chieuCaoTai="h-12">
          {(hang) => <CauPassThrough hang={hang} />}
        </TrangThaiDuLieu>
        <p className="text-sm text-muted-foreground">
          Điều đồ án <strong>chưa</strong> nói được là chính xác bao nhiêu phần chênh lệch này{" "}
          <em>do chính sách gây ra</em>. Hai nhóm hàng khác nhau về sức bán từ trước, nên phép so
          sánh nhân quả chưa đủ chắc. Giới hạn đó ảnh hưởng tới <em>độ lớn</em> của tác động, không
          làm thay đổi điều quan sát được ở trên.
        </p>
        <BieuDoHeSo />
      </section>

      <section aria-labelledby="dieu-huong-tiep" className="grid gap-4">
        <h2 id="dieu-huong-tiep" className="text-lg font-semibold">
          Đọc tiếp theo trình tự lập luận
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <TheChuyenTiep
            href="/du-lieu"
            tieuDe="1. Dữ liệu"
            moTa="Luồng mẫu, độ phủ theo tháng, cân bằng tiền kỳ."
          />
          <TheChuyenTiep
            href="/thiet-ke"
            tieuDe="2. Thiết kế"
            moTa="Bản đồ cái gì ảnh hưởng cái gì, vì sao hai nhóm chưa thể so sánh hoàn toàn công bằng."
          />
          <TheChuyenTiep
            href="/ket-qua"
            tieuDe="3. Kết quả"
            moTa="Bốn ước lượng, kết quả theo tầng, ba cổng chẩn đoán, lưới độ nhạy."
          />
          <TheChuyenTiep
            href="/suc-manh"
            tieuDe="4. Sức mạnh & cơ chế"
            moTa="Dữ liệu phát hiện được thay đổi nhỏ đến đâu, có đủ sức kiểm tra giá gần như không đổi không."
          />
          <TheChuyenTiep
            href="/han-che"
            tieuDe="5. Hạn chế"
            moTa="Tổng hợp mọi hạn chế và danh sách câu cấm viết."
          />
          <TheChuyenTiep
            href="/trinh-bay"
            tieuDe="Bản trình bày"
            moTa="Slide tóm tắt — dùng chung dữ liệu với các trang trên."
          />
        </div>
      </section>

      <section aria-labelledby="pham-vi" className="grid gap-2">
        <h2 id="pham-vi" className="text-lg font-semibold">
          Phạm vi suy rộng
        </h2>
        <p className="text-sm text-muted-foreground">
          Tổng thể đại diện: SKU đủ điều kiện giảm thuế theo luật, có bán ở cả hai kỳ, tại một cửa
          hàng tiện lợi TP.HCM (mẫu chính:{" "}
          <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu} inline>
            {(hang) => <TongSkuTheoZ hang={hang} />}
          </TrangThaiDuLieu>
          ). Không được ngoại suy ra ngành bán lẻ Việt Nam — một cửa hàng, một ngày chính sách, một
          người ra quyết định giá.
        </p>
        <div>
          <NhanVaiTro vaiTro="chinh" />
        </div>
      </section>
    </div>
  );
}

/** Bằng chứng đếm được: giá thật gần như không bám mức lẽ ra phải có. */
function CauBamChuan({ hang }: { hang: BamChuanRow[] }) {
  const duocGiam = hang.find((h) => h.Z === 1);
  if (!duocGiam) return null;
  return (
    <p>
      Nếu cửa hàng giảm giá đúng theo phần thuế được giảm,{" "}
      <strong>{dinhDangSoNguyen(duocGiam.n_du_bao_doi_muc)}</strong> mặt hàng lẽ ra phải đổi giá.
      Thực tế chỉ <strong>{dinhDangSoNguyen(duocGiam.n_bam_chuan)}</strong> mặt hàng đạt đúng mức
      đó, còn <strong>{dinhDangSoNguyen(duocGiam.n_giu_nguyen_gia)}</strong> mặt hàng giữ nguyên
      giá cũ.
    </p>
  );
}

/**
 * `pass_through` là tỉ lệ phần giảm thuế đi vào giá, do pipeline tính sẵn.
 * Chỉ lấy khoảng nhỏ nhất–lớn nhất trong bốn đặc tả chính, không chọn một con số.
 */
function CauPassThrough({ hang }: { hang: UocLuongChinhRow[] }) {
  const ty = hang
    .filter((h) => h.vai_tro === "chính" && h.pass_through != null)
    .map((h) => h.pass_through as number);
  if (ty.length === 0) return null;
  const pct = (v: number) => `${(v * 100).toFixed(0)}%`;
  return (
    <p>
      Theo bốn cách tính, phần giảm thuế thực sự đi vào giá chỉ khoảng{" "}
      <strong>
        {pct(Math.min(...ty))} – {pct(Math.max(...ty))}
      </strong>{" "}
      mức chuyển hoàn toàn — thấp hơn nhiều so với mức chuyển hết.
    </p>
  );
}

function SoSkuChuaPhanLoai({ hang }: { hang: DoNhayRow[] }) {
  const coSo = hang.find(
    (h) => h.truc === DO_NHAY_CHUA_RO_TRUC && h.muc === DO_NHAY_CHUA_RO_CO_SO
  );
  const ganZ1 = hang.find(
    (h) => h.truc === DO_NHAY_CHUA_RO_TRUC && h.muc === DO_NHAY_CHUA_RO_Z1
  );
  if (!coSo || !ganZ1) return <span>—</span>;
  return <strong>{dinhDangSoNguyen(ganZ1.n - coSo.n)}</strong>;
}

function TongSkuTheoZ({ hang }: { hang: TheoTangRow[] }) {
  const itt = hang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
  const n1 = itt.reduce((s, h) => s + h.n1, 0);
  const n0 = itt.reduce((s, h) => s + h.n0, 0);
  return (
    <span>
      Z=1: {dinhDangSoNguyen(n1)} SKU · Z=0: {dinhDangSoNguyen(n0)} SKU
    </span>
  );
}

function TheChuyenTiep({ href, tieuDe, moTa }: { href: string; tieuDe: string; moTa: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{tieuDe}</CardTitle>
        <CardDescription>{moTa}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>
            Xem trang <ArrowRightIcon />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
