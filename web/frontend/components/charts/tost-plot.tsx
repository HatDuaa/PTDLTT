"use client";

/**
 * Biểu đồ tương đương TOST (biểu đồ bắt buộc #4): KTC 90% của bốn ước lượng đặt
 * trên vùng tương đương ±0,918 (biên rộng, suy ra từ mốc chuyển hoàn toàn — xem
 * `lib/hang-so-chinh-sach.ts`). KTC 90% dựng từ SE do API trả về nhân với phân vị
 * chuẩn 95% (quy ước TOST = hai kiểm định một phía ở mức 0,05).
 *
 * ⚠️ KHÔNG được đọc "nằm ngoài vùng tương đương" thành "pass-through khác 0" — biên
 * đã chọn nhỏ hơn mức cần cho 80% sức mạnh ở cả bốn đặc tả (chương 6.3).
 */
import { CartesianGrid, ErrorBar, ReferenceArea, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useUocLuongChinh } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangKtc, dinhDangSo } from "@/lib/format";
import { BIEN_TOST_RONG } from "@/lib/hang-so-chinh-sach";
import { tinhKtc, Z_90 } from "@/lib/thong-ke";
import type { UocLuongChinhRow } from "@/lib/types";

const CAU_HINH: ChartConfig = {
  uoc_luong: { label: "Ước lượng ATT", color: "var(--chart-3)" },
};

interface DiemTost {
  pp: string;
  uoc_luong: number;
  ktc90: [number, number];
  ktc90_duoi: number;
  ktc90_tren: number;
}

export function TostPlot() {
  const { duLieu, dangTai, loi, thuLai } = useUocLuongChinh();
  const bienChuoi = dinhDangSo(BIEN_TOST_RONG, 3);

  return (
    <KhoiBieuDo
      tieuDe={`Biểu đồ tương đương TOST — biên rộng ±${bienChuoi}`}
      moTa={`TOST là hai kiểm định một phía để hỏi chênh lệch có đủ nhỏ để xem là gần như tương đương không. KTC 90% được so với vùng [−${bienChuoi}; +${bienChuoi}] điểm log ×100.`}
      vaiTro="chinh"
      moTaChoBieuDo={`Biểu đồ chấm ngang với khoảng tin cậy 90% của bốn ước lượng ATT, đặt trên nền vùng tương đương từ −${bienChuoi} đến +${bienChuoi} điểm log ×100. Không khoảng tin cậy nào nằm gọn trong vùng tương đương, nhưng điều này chủ yếu do biên hẹp so với độ chính xác dữ liệu, không phải bằng chứng chống lại sự tương đương.`}
      ghiChu={
        <p>
          Biên ±{bienChuoi} nhỏ hơn mức cần cho 80% sức mạnh TOST ở cả bốn đặc tả (xem trang{" "}
          <strong>Sức mạnh &amp; cơ chế</strong>). TOST không đạt ở biên này không chứng minh
          pass-through khác 0.
        </p>
      }
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

function chuanBiDiem(hang: UocLuongChinhRow[]): DiemTost[] {
  return hang
    .filter((h) => h.vai_tro === "chính")
    .map((h) => {
      const ktc90 = tinhKtc(h.uoc_luong, h.se, Z_90);
      return {
        pp: h.pp,
        uoc_luong: h.uoc_luong,
        ktc90: [h.uoc_luong - ktc90.duoi, ktc90.tren - h.uoc_luong],
        ktc90_duoi: ktc90.duoi,
        ktc90_tren: ktc90.tren,
      };
    });
}

function NoiDungBieuDo({ hang }: { hang: UocLuongChinhRow[] }) {
  const diem = chuanBiDiem(hang);
  const bien = Math.max(BIEN_TOST_RONG + 0.3, ...diem.map((d) => Math.max(Math.abs(d.ktc90_duoi), Math.abs(d.ktc90_tren)) + 0.3));

  return (
    <ChartContainer config={CAU_HINH} className="aspect-auto h-72 w-full">
      <ScatterChart margin={{ left: 8, right: 24, top: 16, bottom: 8 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="uoc_luong"
          domain={[-bien, bien]}
          label={{
            value: "Điểm log ×100",
            position: "insideBottom",
            offset: -4,
            fill: "var(--muted-foreground)",
          }}
          tickFormatter={(v: number) => dinhDangSo(v, 1)}
        />
        <YAxis type="category" dataKey="pp" width={150} tick={{ fontSize: 12 }} interval={0} />
        <ReferenceArea
          x1={-BIEN_TOST_RONG}
          x2={BIEN_TOST_RONG}
          fill="var(--muted-foreground)"
          fillOpacity={0.08}
          label={{ value: "vùng tương đương", position: "insideTop", fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <ReferenceLine x={-BIEN_TOST_RONG} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
        <ReferenceLine x={BIEN_TOST_RONG} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
        <ReferenceLine x={0} stroke="var(--muted-foreground)" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const d = item.payload as DiemTost;
                return (
                  <div className="grid gap-0.5">
                    <span className="font-medium text-foreground">{d.pp}</span>
                    <span>{dinhDangDiemLog(d.uoc_luong)}</span>
                    <span>{dinhDangKtc(d.ktc90_duoi, d.ktc90_tren, 90)}</span>
                  </div>
                );
              }}
            />
          }
        />
        <Scatter data={diem} dataKey="uoc_luong" fill="var(--color-uoc_luong)">
          <ErrorBar dataKey="ktc90" direction="x" width={6} strokeWidth={1.5} stroke="var(--color-uoc_luong)" />
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}

function BangThayThe({ hang }: { hang: UocLuongChinhRow[] }) {
  const diem = chuanBiDiem(hang);
  return (
    <BangSoThayThe<DiemTost>
      id="bang-tost"
      tieuDe="Biểu đồ tương đương TOST"
      cot={[
        { khoa: "pp", nhan: "Phương pháp" },
        { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
        { khoa: "ktc90", nhan: "KTC 90%", dinhDang: (h) => dinhDangKtc(h.ktc90_duoi, h.ktc90_tren, 90) },
      ]}
      hang={diem}
    />
  );
}
