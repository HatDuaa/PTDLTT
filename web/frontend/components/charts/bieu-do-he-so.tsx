"use client";

/**
 * Biểu đồ hệ số (bắt buộc #1): cả bốn ước lượng chính + KTC 95%, cùng hai đường
 * tham chiếu — 0 (không đổi) và mốc chuyển hoàn toàn phần giảm thuế. Cả bốn điểm
 * dùng cùng một màu vì cùng biểu diễn một estimand; màu không mã hóa thắng/thua.
 */
import {
  CartesianGrid,
  ErrorBar,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useUocLuongChinh } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangKtc, dinhDangP, dinhDangSo } from "@/lib/format";
import { MOC_CHUYEN_HOAN_TOAN } from "@/lib/hang-so-chinh-sach";
import type { UocLuongChinhRow } from "@/lib/types";

const CAU_HINH: ChartConfig = {
  uoc_luong: { label: "Ước lượng ATT", color: "var(--chart-3)" },
};

interface DiemBieuDo {
  pp: string;
  uoc_luong: number;
  ktc: [number, number];
  ktc_duoi: number;
  ktc_tren: number;
  se: number;
  p: number;
}

export function BieuDoHeSo({ anTieuDe = false }: { anTieuDe?: boolean } = {}) {
  const { duLieu, dangTai, loi, thuLai } = useUocLuongChinh();

  return (
    <KhoiBieuDo
      anTieuDe={anTieuDe}
      tieuDe="Biểu đồ hệ số — bốn ước lượng chính"
      moTa="ATT là chênh lệch trung bình cần ước lượng cho nhóm được luật cho giảm thuế. Mỗi điểm dùng một cách tính khác nhau, không phải bốn nghiên cứu độc lập; g-computation là dùng mô hình để dự đoán mỗi SKU dưới cả hai trạng thái rồi lấy chênh lệch."
      vaiTro="chinh"
      moTaChoBieuDo="Biểu đồ chấm ngang thể hiện bốn ước lượng ATT (PP1-A thô, PP1-A có hiệp biến, PP1-B g-computation, PP2 phân tầng) kèm khoảng tin cậy 95%, cùng hai đường tham chiếu dọc tại 0 và tại mốc chuyển hoàn toàn phần giảm thuế. Cả bốn khoảng tin cậy đều phủ qua đường 0."
      bangThayThe={
        <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai}>
          {(hang) => <BangThayThe hang={hang} />}
        </TrangThaiDuLieu>
      }
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai} chieuCaoTai="h-72">
        {(hang) => <NoiDungBieuDo hang={hang} />}
      </TrangThaiDuLieu>
    </KhoiBieuDo>
  );
}

function chuanBiDiem(hang: UocLuongChinhRow[]): DiemBieuDo[] {
  return hang
    .filter((h) => h.vai_tro === "chính")
    .map((h) => ({
      pp: h.pp,
      uoc_luong: h.uoc_luong,
      ktc: [h.uoc_luong - h.ktc_duoi, h.ktc_tren - h.uoc_luong],
      ktc_duoi: h.ktc_duoi,
      ktc_tren: h.ktc_tren,
      se: h.se,
      p: h.p,
    }));
}

function NoiDungBieuDo({ hang }: { hang: UocLuongChinhRow[] }) {
  const diem = chuanBiDiem(hang);
  const bienDuoi = Math.min(0, MOC_CHUYEN_HOAN_TOAN, ...diem.map((d) => d.ktc_duoi));
  const bienTren = Math.max(0, ...diem.map((d) => d.ktc_tren));

  return (
    <ChartContainer config={CAU_HINH} className="aspect-auto h-72 w-full">
      <ScatterChart margin={{ left: 8, right: 24, top: 16, bottom: 8 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="uoc_luong"
          domain={[Math.floor(bienDuoi - 0.3), Math.ceil(bienTren + 0.3)]}
          label={{
            value: "Điểm log ×100",
            position: "insideBottom",
            offset: -4,
            fill: "var(--muted-foreground)",
          }}
          tickFormatter={(v: number) => dinhDangSo(v, 1)}
        />
        <YAxis
          type="category"
          dataKey="pp"
          width={150}
          tick={{ fontSize: 12 }}
          interval={0}
        />
        <ReferenceLine
          x={0}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          label={{ value: "0", position: "top", fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <ReferenceLine
          x={MOC_CHUYEN_HOAN_TOAN}
          stroke="var(--muted-foreground)"
          strokeDasharray="2 4"
          label={{
            value: "chuyển hoàn toàn",
            position: "top",
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const d = item.payload as DiemBieuDo;
                return (
                  <div className="grid gap-0.5">
                    <span className="font-medium text-foreground">{d.pp}</span>
                    <span>{dinhDangDiemLog(d.uoc_luong)}</span>
                    <span>{dinhDangKtc(d.ktc_duoi, d.ktc_tren)}</span>
                    <span>{dinhDangP(d.p)}</span>
                  </div>
                );
              }}
            />
          }
        />
        <Scatter data={diem} dataKey="uoc_luong" fill="var(--color-uoc_luong)">
          <ErrorBar dataKey="ktc" direction="x" width={6} strokeWidth={1.5} stroke="var(--color-uoc_luong)" />
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}

function BangThayThe({ hang }: { hang: UocLuongChinhRow[] }) {
  const diem = chuanBiDiem(hang);
  return (
    <BangSoThayThe<DiemBieuDo>
      id="bang-he-so"
      tieuDe="Biểu đồ hệ số — bốn ước lượng chính"
      cot={[
        { khoa: "pp", nhan: "Phương pháp" },
        { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
        { khoa: "se", nhan: "SE", dinhDang: (h) => dinhDangSo(h.se, 3) },
        { khoa: "ktc", nhan: "KTC 95%", dinhDang: (h) => dinhDangKtc(h.ktc_duoi, h.ktc_tren) },
        { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
      ]}
      hang={diem}
    />
  );
}
