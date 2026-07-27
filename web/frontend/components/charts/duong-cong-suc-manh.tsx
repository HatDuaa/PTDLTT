"use client";

/**
 * Đường cong sức mạnh mô phỏng — không nằm trong 4 biểu đồ bắt buộc nhưng cần cho
 * trang Sức mạnh & cơ chế. Ghi rõ đường cong này khớp gần nhất với đặc tả MDE giải
 * tích nào (suy ra bằng nội suy, không gõ tay tên đặc tả).
 */
import { Line, LineChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useMde } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangPhanTram, dinhDangSo } from "@/lib/format";
import { MOC_CHUYEN_HOAN_TOAN } from "@/lib/hang-so-chinh-sach";
import { SUC_MANH_MUC_TIEU } from "@/lib/nguong-thiet-ke";
import { noiSuyMdeTuDuongCong, tachDuLieuMde, timDacTaGanNhat } from "@/lib/derive";
import type { DuongCongSucManhDiem } from "@/lib/types";

const CAU_HINH: ChartConfig = {
  suc_manh: { label: "Sức mạnh mô phỏng", color: "var(--chart-3)" },
};

export function DuongCongSucManh() {
  const { duLieu, dangTai, loi, thuLai } = useMde();

  return (
    <KhoiBieuDo
      tieuDe="Đường cong sức mạnh — mô phỏng tái định tâm"
      moTa="Sức mạnh phát hiện tác động giả định δ, ước lượng bằng mô phỏng tái định tâm dữ liệu về H₀ rồi cộng δ, chạy lại toàn bộ estimator nhiều lần mỗi mức."
      vaiTro="chan-doan"
      moTaChoBieuDo="Đường cong tăng dần thể hiện sức mạnh thống kê theo độ lớn hiệu ứng giả định δ; tại δ=0 sức mạnh xấp xỉ mức alpha 0,05, xác nhận mô phỏng tái định tâm đúng; tại mốc chuyển hoàn toàn, sức mạnh chưa đạt 80%."
      bangThayThe={
        <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai}>
          {(hang) => {
            const { dacTa, duongCong } = tachDuLieuMde(hang);
            return <BangThayThe duongCong={duongCong} dacTa={dacTa} />;
          }}
        </TrangThaiDuLieu>
      }
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai} chieuCaoTai="h-72">
        {(hang) => {
          const { dacTa, duongCong } = tachDuLieuMde(hang);
          return <NoiDungBieuDo duongCong={duongCong} dacTa={dacTa} />;
        }}
      </TrangThaiDuLieu>
    </KhoiBieuDo>
  );
}

function NoiDungBieuDo({
  duongCong,
  dacTa,
}: {
  duongCong: ReturnType<typeof tachDuLieuMde>["duongCong"];
  dacTa: ReturnType<typeof tachDuLieuMde>["dacTa"];
}) {
  const mdeMoPhong = noiSuyMdeTuDuongCong(duongCong, SUC_MANH_MUC_TIEU);
  const dacTaGanNhat = timDacTaGanNhat(dacTa, mdeMoPhong);

  return (
    <div>
      <ChartContainer config={CAU_HINH} className="aspect-auto h-72 w-full">
        <LineChart data={duongCong} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="delta"
            label={{ value: "δ — điểm log ×100", position: "insideBottom", offset: -4 }}
            tickFormatter={(v: number) => dinhDangSo(v, 1)}
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v: number) => dinhDangPhanTram(v, 0)}
            width={56}
          />
          <ReferenceLine x={MOC_CHUYEN_HOAN_TOAN} stroke="var(--muted-foreground)" strokeDasharray="2 4" />
          <ReferenceLine y={SUC_MANH_MUC_TIEU} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(v) => `δ = ${dinhDangSo(Number(v), 2)}`}
                formatter={(value) => [dinhDangPhanTram(Number(value), 1), "sức mạnh"]}
              />
            }
          />
          <Line type="monotone" dataKey="suc_manh" stroke="var(--color-suc_manh)" dot strokeWidth={2} />
        </LineChart>
      </ChartContainer>
      {dacTaGanNhat && mdeMoPhong !== undefined && (
        <p className="mt-2 text-sm text-muted-foreground">
          MDE nội suy từ mô phỏng (giao sức mạnh {dinhDangPhanTram(SUC_MANH_MUC_TIEU, 0)}):{" "}
          {dinhDangSo(mdeMoPhong, 2)} điểm log ×100 — khớp gần nhất với đặc tả giải tích{" "}
          <strong>{dacTaGanNhat.dac_ta}</strong> (MDE giải tích {dinhDangDiemLog(dacTaGanNhat.mde)}).
        </p>
      )}
    </div>
  );
}

function BangThayThe({
  duongCong,
  dacTa,
}: {
  duongCong: ReturnType<typeof tachDuLieuMde>["duongCong"];
  dacTa: ReturnType<typeof tachDuLieuMde>["dacTa"];
}) {
  const mdeMoPhong = noiSuyMdeTuDuongCong(duongCong, SUC_MANH_MUC_TIEU);
  const dacTaGanNhat = timDacTaGanNhat(dacTa, mdeMoPhong);
  return (
    <BangSoThayThe<DuongCongSucManhDiem>
      id="bang-duong-cong-suc-manh"
      tieuDe="Đường cong sức mạnh mô phỏng"
      moTa={
        dacTaGanNhat
          ? `Đường cong khớp gần nhất với đặc tả ${dacTaGanNhat.dac_ta}.`
          : undefined
      }
      cot={[
        { khoa: "delta", nhan: "δ (điểm log ×100)", dinhDang: (h) => dinhDangSo(h.delta, 3) },
        { khoa: "suc_manh", nhan: "Sức mạnh", dinhDang: (h) => dinhDangPhanTram(h.suc_manh, 1) },
      ]}
      hang={duongCong}
    />
  );
}
