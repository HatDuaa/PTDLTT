"use client";

/**
 * Love plot — SMD sau phân tầng (biểu đồ bắt buộc #3).
 *
 * Nguồn dữ liệu CHÍNH: `/api/smd-sau-phan-tang` — SMD của từng hiệp biến TRONG từng
 * tầng, SAU khi chia 5 tầng giá. Đây là dữ liệu chính thức cho Cổng 1 (chương
 * 4.8/5.5): 5 tầng × 3 hiệp biến = 15 cặp, ngưỡng ±0,25 đã khóa trước.
 *
 * Để so sánh, panel thứ hai vẽ SMD TRƯỚC phân tầng (`/api/eda/can-bang-tien-ky`),
 * ghi nhãn rõ ràng là "trước phân tầng". Điểm quan trọng không phải "phân tầng đã
 * cân bằng tốt hơn" — NGƯỢC LẠI: phân tầng theo giá làm SMD của log sản lượng và số
 * tuần xuất hiện TỆ HƠN ở nhiều tầng, đúng như phát hiện ở chương 4.8.
 */
import { CartesianGrid, Cell, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useEda, useSmdSauPhanTang } from "@/lib/hooks";
import { dinhDangPhanTram, dinhDangSmd, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";
import { NGUONG_SMD } from "@/lib/nguong-thiet-ke";
import type { EdaCanBangTienKyRow, SmdSauPhanTangRow } from "@/lib/types";

const NHAN_BIEN: Record<string, string> = {
  log_pre_p: "log(giá nền)",
  log1p_pre_q: "log(1+sản lượng)",
  pre_w: "số tuần xuất hiện",
};

const CAU_HINH: ChartConfig = {
  SMD: { label: "SMD", color: "var(--chart-3)" },
};

interface DiemLove {
  nhan: string;
  nhom: string;
  bien: string;
  SMD: number;
  vuotNguong: boolean;
}

export function LovePlot() {
  const sauPT = useSmdSauPhanTang();
  const truocPT = useEda("can-bang-tien-ky");

  const dangTai = sauPT.dangTai || truocPT.dangTai;
  const loi = sauPT.loi ?? truocPT.loi;
  const sanSang = sauPT.duLieu && truocPT.duLieu;
  const thuLai = () => {
    sauPT.thuLai();
    truocPT.thuLai();
  };

  return (
    <KhoiBieuDo
      tieuDe="Love plot — SMD sau phân tầng theo 5 tầng giá"
      moTa="SMD là thước đo hai nhóm khác nhau bao xa trước chính sách; càng gần 0 càng giống nhau. Love plot đặt các SMD cạnh nhau để nhìn nhanh chỗ nào còn mất cân bằng sau khi chia tầng giá."
      vaiTro="chan-doan"
      moTaChoBieuDo="Biểu đồ chấm thể hiện SMD của từng cặp (tầng, hiệp biến) sau phân tầng, cùng hai đường tham chiếu dọc tại ±0,25. Phần lớn điểm vượt ngưỡng. Panel thứ hai bên dưới vẽ SMD trước phân tầng để so sánh: phân tầng theo giá không làm cân bằng tốt hơn, mà ở nhiều tầng còn làm SMD của sản lượng và số tuần xuất hiện tệ hơn."
      ghiChu={
        sanSang ? (
          <GhiChuSoSanh sauPT={sauPT.duLieu!} truocPT={truocPT.duLieu!} />
        ) : undefined
      }
      bangThayThe={
        <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={sanSang} thuLai={thuLai}>
          {() => <BangThayThe sauPT={sauPT.duLieu!} truocPT={truocPT.duLieu!} />}
        </TrangThaiDuLieu>
      }
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={sanSang} thuLai={thuLai} chieuCaoTai="h-96">
        {() => (
          <div className="grid gap-6">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Sau phân tầng (chính — dùng cho Cổng 1)
              </p>
              <BieuDoSauPhanTang hang={sauPT.duLieu!} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Trước phân tầng (so sánh — không phải Cổng 1)
              </p>
              <BieuDoTruocPhanTang hang={truocPT.duLieu!} />
            </div>
          </div>
        )}
      </TrangThaiDuLieu>
    </KhoiBieuDo>
  );
}

function chuanBiDiemSau(hang: SmdSauPhanTangRow[]): DiemLove[] {
  return hang.map((h) => ({
    nhan: `Tầng ${h.tang} · ${NHAN_BIEN[h.bien] ?? h.bien}`,
    nhom: `Tầng ${h.tang}`,
    bien: NHAN_BIEN[h.bien] ?? h.bien,
    SMD: h.smd,
    vuotNguong: h.vuot_nguong,
  }));
}

function chuanBiDiemTruoc(hang: EdaCanBangTienKyRow[]): DiemLove[] {
  return hang.map((h) => ({
    nhan: `${h.doi_chung} · ${NHAN_BIEN[h.bien] ?? h.bien}`,
    nhom: h.doi_chung,
    bien: NHAN_BIEN[h.bien] ?? h.bien,
    SMD: h.SMD,
    vuotNguong: Math.abs(h.SMD) > NGUONG_SMD,
  }));
}

function BieuDoChung({ diem, chieuCaoNhan }: { diem: DiemLove[]; chieuCaoNhan: number }) {
  const bien = Math.max(NGUONG_SMD + 0.2, ...diem.map((d) => Math.abs(d.SMD) + 0.2));
  return (
    <ChartContainer config={CAU_HINH} className="aspect-auto w-full" style={{ height: chieuCaoNhan }}>
      <ScatterChart margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="SMD"
          domain={[-bien, bien]}
          label={{
            value: "SMD",
            position: "insideBottom",
            offset: -4,
            fill: "var(--muted-foreground)",
          }}
          tickFormatter={(v: number) => dinhDangSo(v, 2)}
        />
        <YAxis type="category" dataKey="nhan" width={190} tick={{ fontSize: 11 }} interval={0} />
        <ReferenceLine x={0} stroke="var(--muted-foreground)" />
        <ReferenceLine x={NGUONG_SMD} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
        <ReferenceLine x={-NGUONG_SMD} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => {
                const d = item.payload as DiemLove;
                return (
                  <div className="grid gap-0.5">
                    <span className="font-medium text-foreground">{d.nhan}</span>
                    <span>SMD = {dinhDangSmd(d.SMD)}</span>
                    <span>{d.vuotNguong ? "vượt ngưỡng ±0,25" : "trong ngưỡng ±0,25"}</span>
                  </div>
                );
              }}
            />
          }
        />
        <Scatter data={diem} dataKey="SMD">
          {diem.map((d) => (
            <Cell key={d.nhan} fill="var(--color-SMD)" />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}

function BieuDoSauPhanTang({ hang }: { hang: SmdSauPhanTangRow[] }) {
  return <BieuDoChung diem={chuanBiDiemSau(hang)} chieuCaoNhan={320} />;
}

function BieuDoTruocPhanTang({ hang }: { hang: EdaCanBangTienKyRow[] }) {
  return <BieuDoChung diem={chuanBiDiemTruoc(hang)} chieuCaoNhan={260} />;
}

function GhiChuSoSanh({
  sauPT,
  truocPT,
}: {
  sauPT: SmdSauPhanTangRow[];
  truocPT: EdaCanBangTienKyRow[];
}) {
  const soVuotSau = sauPT.filter((h) => h.vuot_nguong).length;
  const tyLeSau = soVuotSau / sauPT.length;
  const truocChinh = truocPT.filter((h) => h.doi_chung === "DC-A");
  const soVuotTruoc = truocChinh.filter((h) => Math.abs(h.SMD) > NGUONG_SMD).length;
  const tyLeTruoc = truocChinh.length > 0 ? soVuotTruoc / truocChinh.length : undefined;

  return (
    <div className="space-y-1">
      <p>
        Sau phân tầng: <strong>{dinhDangSoNguyen(soVuotSau)}/{dinhDangSoNguyen(sauPT.length)}</strong> cặp
        (tầng × hiệp biến) vượt ngưỡng ±0,25 ({dinhDangPhanTram(tyLeSau, 0)}).
        {tyLeTruoc !== undefined && (
          <>
            {" "}
            Trước phân tầng (đối chứng chính): <strong>{dinhDangSoNguyen(soVuotTruoc)}/{dinhDangSoNguyen(truocChinh.length)}</strong>{" "}
            biến vượt ngưỡng ({dinhDangPhanTram(tyLeTruoc, 0)}).
          </>
        )}
      </p>
      <p>
        Phân tầng theo giá <strong>không phải cách khắc phục mất cân bằng</strong> — ở nhiều tầng, SMD
        của log sản lượng và số tuần xuất hiện còn lớn hơn (tệ hơn) so với trước khi chia tầng. Đây là
        lý do Cổng 1 <strong>trượt</strong> theo đúng quy tắc đã khóa trước.
      </p>
    </div>
  );
}

function BangThayThe({
  sauPT,
  truocPT,
}: {
  sauPT: SmdSauPhanTangRow[];
  truocPT: EdaCanBangTienKyRow[];
}) {
  const diemSau = chuanBiDiemSau(sauPT);
  const diemTruoc = chuanBiDiemTruoc(truocPT);
  const cot = [
    { khoa: "nhan", nhan: "Nhóm · biến" },
    { khoa: "SMD", nhan: "SMD", dinhDang: (h: DiemLove) => dinhDangSmd(h.SMD) },
    {
      khoa: "vuotNguong",
      nhan: "So với ngưỡng ±0,25",
      dinhDang: (h: DiemLove) => (h.vuotNguong ? "Vượt ngưỡng" : "Trong ngưỡng"),
    },
  ];
  return (
    <div className="grid gap-4">
      <BangSoThayThe<DiemLove>
        id="bang-love-plot-sau"
        tieuDe="Love plot — SMD sau phân tầng (chính)"
        cot={cot}
        hang={diemSau}
      />
      <BangSoThayThe<DiemLove>
        id="bang-love-plot-truoc"
        tieuDe="Love plot — SMD trước phân tầng (so sánh)"
        cot={cot}
        hang={diemTruoc}
      />
    </div>
  );
}
