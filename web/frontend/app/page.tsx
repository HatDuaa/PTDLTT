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
import { useDoNhay, useTheoTang } from "@/lib/hooks";
import { dinhDangSoNguyen } from "@/lib/format";
import type { DoNhayRow, TheoTangRow } from "@/lib/types";
import { MAU_SO_SANH_CHINH } from "@/lib/hang-so-chinh-sach";

export default function TrangChu() {
  const theoTang = useTheoTang();
  const doNhay = useDoNhay();

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
              không tuân thủ khi cập nhật thuế, nhóm đối chứng từng bị ô nhiễm, và{" "}
              <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} inline>
                {(hang) => <SoSkuChuaPhanLoai hang={hang} />}
              </TrangThaiDuLieu>{" "}
              SKU chưa phân loại được về địa vị pháp lý.
            </p>
            <p>
              Cân bằng tiền kỳ giữa nhóm can thiệp và nhóm đối chứng <strong>thất bại</strong> sau
              phân tầng, và kiểm định tương đương tiền xu hướng <strong>không đạt</strong>. Theo quy
              tắc khóa trước của đồ án, kết luận nhân quả vì vậy chỉ có điều kiện — xem đầy đủ ở{" "}
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
          vị phân tích: SKU (mã vạch) sai phân trước–sau, tại <strong>một</strong> cửa hàng tiện lợi
          TP.HCM. Đơn vị hiệu ứng: <strong>điểm log ×100</strong>.
        </p>
      </section>

      <section aria-labelledby="ket-luan-chinh" className="grid gap-3">
        <h2 id="ket-luan-chinh" className="text-lg font-semibold">
          Kết luận
        </h2>
        <p>
          <strong>Không tìm thấy bằng chứng giá giảm</strong> trong các so sánh có điều chỉnh này.
          Dữ liệu không đủ để quy chênh lệch quan sát cho chính sách một cách đáng tin cậy. Đây
          KHÔNG phải &ldquo;tác động bằng 0&rdquo; — kiểm định tương đương cũng không đạt.
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
            moTa="Khung Z/D, đồ thị nhân quả, giả định và đường backdoor."
          />
          <TheChuyenTiep
            href="/ket-qua"
            tieuDe="3. Kết quả"
            moTa="Bốn ước lượng, kết quả theo tầng, ba cổng chẩn đoán, lưới độ nhạy."
          />
          <TheChuyenTiep
            href="/suc-manh"
            tieuDe="4. Sức mạnh & cơ chế"
            moTa="MDE, sức mạnh TOST, mô phỏng làm tròn, sản lượng — mọi thứ chỉ mang tính khám phá."
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

function SoSkuChuaPhanLoai({ hang }: { hang: DoNhayRow[] }) {
  const coSo = hang.find((h) => h.truc === "23 SKU chưa phân loại" && h.muc === "loại (cơ sở)");
  const ganZ1 = hang.find((h) => h.truc === "23 SKU chưa phân loại" && h.muc === "gán tất cả Z=1");
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
