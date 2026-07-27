"use client";

/**
 * Trang Kết quả — bốn ước lượng chính, kết quả theo tầng, ba cổng chẩn đoán, lưới
 * độ nhạy đầy đủ (kể cả kết quả bất lợi). Nguồn: `/api/uoc-luong-chinh`,
 * `/api/theo-tang`, `/api/cong-chan-doan`, `/api/do-nhay`.
 */
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { TostPlot } from "@/components/charts/tost-plot";
import { BaCongChanDoan } from "@/components/ket-qua/ba-cong-chan-doan";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useDoNhay, useTheoTang, useUocLuongChinh } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangKtc, dinhDangP, dinhDangSo, dinhDangSoNguyen, dinhDangTien } from "@/lib/format";
import { chuanHoaVaiTro } from "@/lib/vai-tro";
import { ALPHA } from "@/lib/nguong-thiet-ke";
import type { DoNhayRow, TheoTangRow, UocLuongChinhRow } from "@/lib/types";
import { MAU_SO_SANH_CHINH } from "@/lib/hang-so-chinh-sach";

export default function TrangKetQua() {
  const uocLuongChinh = useUocLuongChinh();
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
        moTa="Cả bốn khoảng tin cậy đều chứa 0. Không phát hiện được bằng chứng thống kê về việc giá giảm."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const chinh = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "chinh");
            return (
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
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Hai giả thuyết: ATT = 0 và chuyển hoàn toàn"
        moTa="Việc bác bỏ mốc chuyển hoàn toàn PHỤ THUỘC PHƯƠNG PHÁP — không lấy đa số làm biểu quyết."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const chinh = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "chinh");
            return (
              <BangDuLieu<UocLuongChinhRow>
                cot={[
                  { khoa: "pp", nhan: "Phương pháp" },
                  { khoa: "pass_through", nhan: "Pass-through", dinhDang: (h) => dinhDangSo(h.pass_through, 3) },
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
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <TostPlot />

      <KhoiKetQua
        tieuDe="Kết quả theo tầng"
        moTa="Chưa thể phân biệt dị biệt thật với nhiễu ở bất kỳ tầng nào — không đào sâu riêng một tầng."
        vaiTro="kham-pha"
      >
        <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu} thuLai={theoTang.thuLai} chieuCaoTai="h-56">
          {(hang: TheoTangRow[]) => {
            const itt = hang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
            return (
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
        <BaCongChanDoan />
      </section>

      <KhoiKetQua
        tieuDe="Kết quả phụ — per-protocol theo D"
        moTa="Cần thêm giả định rằng quyết định cập nhật thuế không liên quan xu hướng giá phản thực."
        vaiTro="phu"
      >
        <TrangThaiDuLieu dangTai={uocLuongChinh.dangTai} loi={uocLuongChinh.loi} duLieu={uocLuongChinh.duLieu} thuLai={uocLuongChinh.thuLai} chieuCaoTai="h-48">
          {(hang: UocLuongChinhRow[]) => {
            const phu = hang.filter((h) => chuanHoaVaiTro(h.vai_tro) === "phu");
            return (
              <BangDuLieu<UocLuongChinhRow>
                cot={[
                  { khoa: "pp", nhan: "Đối chứng" },
                  { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
                  { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                  { khoa: "ktc", nhan: "KTC 95%", dinhDang: (h) => dinhDangKtc(h.ktc_duoi, h.ktc_tren) },
                ]}
                hang={phu}
              />
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Lưới độ nhạy — báo cáo toàn bộ, kể cả kết quả bất lợi"
        moTa="Bao gồm survivorship ≥5 tuần (đổi dấu, KTC rất rộng) và biến kết quả giá chưa thuế (tăng, xem dòng tương ứng bên dưới) — không lọc bớt kết quả không thuận lợi."
        vaiTro="phu"
      >
        <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} thuLai={doNhay.thuLai} chieuCaoTai="h-96">
          {(hang: DoNhayRow[]) => (
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
          )}
        </TrangThaiDuLieu>
      </KhoiKetQua>
    </div>
  );
}
