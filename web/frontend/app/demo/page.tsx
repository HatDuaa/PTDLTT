"use client";

/**
 * Trang Demo — cho người xem TỰ TRA vào kết quả phân tích.
 *
 * Vì sao trang này tồn tại, và vì sao nó khác sáu trang còn lại: sáu trang kia
 * là trang PHÂN TÍCH — trang nào cũng kèm diễn giải, giả định và cảnh báo. Người
 * xem đọc thụ động.
 *
 * Bên AI, demo nghĩa là "đưa ảnh vào, nhận nhãn ra" — người xem tự đưa đầu vào
 * và thấy hệ thống làm việc. Phân tích dữ liệu không có mô hình phục vụ như vậy,
 * nhưng cái tương đương thì có: cho người xem HỎI và nhận câu trả lời do chính
 * phân tích tính ra.
 *
 * Ba khối, cố ý KHÔNG có câu nào về phương pháp hay giả định:
 *   1. Tra một mặt hàng  — gõ tên, nhận toàn bộ kết quả cho mặt hàng đó
 *   2. Máy tính giá      — nhập giá bất kỳ, xem giá lẽ ra phải có
 *   3. Độ nhạy           — gạt công tắc, xem ước lượng nhúc nhích tới đâu
 *
 * Khối 1 làm con số "1 trên 135" thành thứ sờ được: thay vì đọc một tỉ lệ, người
 * xem gõ tên món mình biết rồi thấy "lẽ ra 94.000, thực tế 96.000".
 */
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ErrorBar,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { SearchIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { ThanhTiLe } from "@/components/site/thanh-ti-le";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useBamChuan, useBamChuanChiTiet, useDoNhay } from "@/lib/hooks";
import {
  MOC_CHUYEN_HOAN_TOAN,
  THUE_SUAT_SAU_CHINH_SACH,
  THUE_SUAT_TRUOC_CHINH_SACH,
} from "@/lib/hang-so-chinh-sach";
import { dinhDangDiemLog, dinhDangP, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";
import type { BamChuanChiTietRow, DoNhayRow } from "@/lib/types";

/** Bước làm tròn giá của cửa hàng — cùng giá trị pipeline dùng ở `b5_suy_dien`. */
const BUOC_LAM_TRON = 1000;

/**
 * Tỉ lệ giá gồm thuế sau chính sách so với trước, khi giá CHƯA thuế giữ nguyên.
 *
 * 🔴 Phải là `(1 + thuế_sau) / (1 + thuế_trước)` = 1,08/1,10 ≈ 0,9818, KHÔNG phải
 * `thuế_sau / thuế_trước` = 0,08/0,10 = 0,8. Bản đầu viết nhầm vế thứ hai nên máy
 * tính cho ra "50.000đ → 40.000đ", tức giảm 20% thay vì 1,8% — sai lệch hơn mười
 * lần, mà công thức hiển thị ngay bên cạnh vẫn ghi đúng `× 1,08 ÷ 1,10` nên nhìn
 * lướt không thấy. Cùng phép tính này ở `b5_suy_dien.bam_chuan_co_hoc`.
 */
const TI_LE_THUE =
  (1 + THUE_SUAT_SAU_CHINH_SACH) / (1 + THUE_SUAT_TRUOC_CHINH_SACH);

/** Làm tròn về bội gần nhất; điểm hòa làm tròn LÊN — khớp `_lam_tron` của b5. */
function lamTron(gia: number, buoc = BUOC_LAM_TRON) {
  return Math.floor(gia / buoc + 0.5) * buoc;
}

function dong(gia: number) {
  return `${dinhDangSoNguyen(Math.round(gia))}đ`;
}

/* ═══════════════════════════ KHỐI 1 ═══════════════════════════ */

function TraMatHang({ hang }: { hang: BamChuanChiTietRow[] }) {
  const [tuKhoa, datTuKhoa] = useState("");
  const [chon, datChon] = useState<BamChuanChiTietRow | null>(null);

  // Gợi ý sẵn vài mặt hàng đáng xem để người mở trang lần đầu có chỗ bắt đầu:
  // món DUY NHẤT đạt chuẩn, và vài món giữ nguyên giá y hệt.
  const noiBat = useMemo(() => {
    const datChuan = hang.filter((h) => h.Z === 1 && h.du_bao_doi_muc && h.bam_chuan);
    const giuGia = hang.filter(
      (h) => h.Z === 1 && h.du_bao_doi_muc && Math.abs(h.pg_hau - h.pre_p) < 1
    );
    return [...datChuan, ...giuGia.slice(0, 3)];
  }, [hang]);

  const ketQua = useMemo(() => {
    const k = tuKhoa.trim().toLowerCase();
    if (!k) return [];
    return hang.filter((h) => h.ten_hang.toLowerCase().includes(k)).slice(0, 8);
  }, [tuKhoa, hang]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="o-tim" className="text-sm font-medium">
          Gõ tên một mặt hàng
        </label>
        <div className="relative">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="o-tim"
            type="search"
            value={tuKhoa}
            onChange={(e) => datTuKhoa(e.target.value)}
            placeholder="ví dụ: sunlight, comfort, dao cạo, bia…"
            className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-base
                       outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Có {dinhDangSoNguyen(hang.length)} mặt hàng trong mẫu so sánh. Hoặc bấm thử một trong
          những món dưới đây:
        </p>
        <div className="flex flex-wrap gap-2">
          {noiBat.map((h) => (
            <button
              key={h.sku}
              type="button"
              onClick={() => {
                datChon(h);
                datTuKhoa("");
              }}
              className="rounded-full border px-3 py-1 text-sm hover:bg-muted
                         focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {h.ten_hang.length > 42 ? `${h.ten_hang.slice(0, 42)}…` : h.ten_hang}
            </button>
          ))}
        </div>
      </div>

      {ketQua.length > 0 && (
        <ul className="grid divide-y rounded-md border">
          {ketQua.map((h) => (
            <li key={h.sku}>
              <button
                type="button"
                onClick={() => {
                  datChon(h);
                  datTuKhoa("");
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left
                           text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring
                           focus-visible:outline-none"
              >
                <span>{h.ten_hang}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{dong(h.pre_p)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {tuKhoa.trim() && ketQua.length === 0 && (
        <p className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
          Không có mặt hàng nào khớp &ldquo;{tuKhoa}&rdquo; trong mẫu so sánh.
        </p>
      )}

      {chon && <TheMatHang h={chon} />}
    </div>
  );
}

/** Thẻ kết quả cho một mặt hàng — đây là "đầu ra" của khối demo thứ nhất. */
function TheMatHang({ h }: { h: BamChuanChiTietRow }) {
  const doiGia = h.pg_hau - h.pre_p;
  const giuNguyen = Math.abs(doiGia) < 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{h.ten_hang}</CardTitle>
          <Badge variant="outline" className="font-normal">
            {h.Z === 1 ? "Luật cho giảm thuế" : "Luật loại trừ — thuế TTĐB"}
          </Badge>
        </div>
        <CardDescription>Mã vạch {h.sku}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <OSo nhan="Giá trước 01/07" gt={dong(h.pre_p)} />
          <OSo nhan="Giá sau 01/07" gt={dong(h.pg_hau)} />
          <OSo
            nhan="Giá lẽ ra phải có"
            gt={dong(h.gia_chuan)}
            noiBat
            phu={
              h.du_bao_doi_muc
                ? "sau khi giảm thuế và làm tròn nghìn"
                : "làm tròn xong vẫn về đúng mức cũ"
            }
          />
        </div>

        {h.Z === 0 ? (
          <p className="rounded-md border-l-4 border-l-foreground/30 bg-muted/30 px-3 py-2 text-sm leading-snug">
            Mặt hàng này <strong>không</strong> được luật cho giảm thuế, nên cột &ldquo;giá lẽ ra
            phải có&rdquo; chỉ là con số giả định dùng để đối chiếu.
          </p>
        ) : !h.du_bao_doi_muc ? (
          <p className="rounded-md border-l-4 border-l-foreground/30 bg-muted/30 px-3 py-2 text-sm leading-snug">
            Giảm thuế rồi làm tròn nghìn thì giá món này quay về <strong>đúng mức cũ</strong>. Giữ
            nguyên giá là hợp lệ, nên món này không nằm trong phép đếm.
          </p>
        ) : (
          <div
            className={`rounded-md border-l-4 px-3 py-2 text-sm leading-snug ${
              h.bam_chuan ? "border-l-foreground bg-muted/50" : "border-l-foreground/30 bg-muted/30"
            }`}
          >
            {h.bam_chuan ? (
              <>
                <strong>Giá thực tế rơi đúng mức lẽ ra phải có.</strong> Đây là một trong số rất ít
                mặt hàng đạt được điều đó.
              </>
            ) : (
              <>
                <strong>
                  Giá thực tế cao hơn mức lẽ ra {dong(Math.abs(h.sai_lech_voi_chuan))}.
                </strong>{" "}
                {giuNguyen
                  ? "Cửa hàng giữ nguyên giá cũ, không đổi một đồng nào."
                  : `Giá có đổi ${dong(Math.abs(doiGia))} nhưng không tới mức lẽ ra.`}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OSo({
  nhan,
  gt,
  phu,
  noiBat = false,
}: {
  nhan: string;
  gt: string;
  phu?: string;
  noiBat?: boolean;
}) {
  return (
    <div className={`grid gap-0.5 rounded-md border p-3 ${noiBat ? "bg-muted/50" : ""}`}>
      <span className="text-sm text-muted-foreground">{nhan}</span>
      <span className="text-xl font-semibold tabular-nums">{gt}</span>
      {phu && <span className="text-xs text-muted-foreground">{phu}</span>}
    </div>
  );
}

/* ═══════════════════════════ KHỐI 2 ═══════════════════════════ */

function MayTinhGia() {
  const [oGia, datOGia] = useState("50000");
  const gia = Number(oGia.replace(/[^\d]/g, ""));
  const hopLe = Number.isFinite(gia) && gia > 0;

  const chuaLamTron = gia * TI_LE_THUE;
  const chuan = lamTron(chuaLamTron);
  const doiMuc = chuan !== lamTron(gia);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="o-gia" className="text-sm font-medium">
          Nhập một mức giá bất kỳ (đồng)
        </label>
        <input
          id="o-gia"
          inputMode="numeric"
          value={oGia}
          onChange={(e) => datOGia(e.target.value)}
          className="h-11 w-full max-w-xs rounded-md border bg-background px-3 text-base
                     tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-sm text-muted-foreground">
          Không cần là mặt hàng có trong dữ liệu — đây thuần là phép tính.
        </p>
      </div>

      {hopLe && (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <OSo nhan="Giá cũ" gt={dong(gia)} />
            <OSo
              nhan="Sau khi giảm thuế"
              gt={dong(chuaLamTron)}
              phu={`nhân ${dinhDangSo(TI_LE_THUE, 4)}`}
            />
            <OSo
              nhan="Làm tròn nghìn"
              gt={dong(chuan)}
              noiBat
              phu={doiMuc ? "giá buộc phải đổi mức" : "quay về đúng mức cũ"}
            />
          </div>
          <p className="rounded-md border bg-muted/40 p-3 text-center font-mono text-sm">
            {dinhDangSoNguyen(gia)} × {dinhDangSo(THUE_SUAT_SAU_CHINH_SACH + 1, 2)} ÷{" "}
            {dinhDangSo(THUE_SUAT_TRUOC_CHINH_SACH + 1, 2)} ={" "}
            {dinhDangSo(chuaLamTron, 0)} → làm tròn → {dinhDangSoNguyen(chuan)}
          </p>
          {!doiMuc && (
            <p className="text-sm leading-snug text-muted-foreground">
              Ở mức giá này, phần thuế được giảm nhỏ hơn nửa bước làm tròn, nên sau khi làm tròn
              giá quay về đúng chỗ cũ. Thử một mức giá cao hơn để thấy giá buộc phải đổi.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ KHỐI 3 ═══════════════════════════ */

const CAU_HINH_BIEU_DO: ChartConfig = {
  uoc_luong: { label: "Ước lượng", color: "var(--chart-3)" },
};

function BangDieuKhienDoNhay({ hang }: { hang: DoNhayRow[] }) {
  const truc = useMemo(() => [...new Set(hang.map((h) => h.truc))], [hang]);
  const [dangChon, datDangChon] = useState(truc[0] ?? "");

  const muc = useMemo(
    () => hang.filter((h) => h.truc === dangChon),
    [hang, dangChon]
  );

  const diem = muc.map((h) => ({
    muc: h.muc,
    n: h.n,
    uoc_luong: h.uoc_luong,
    p: h.p,
    ktc_duoi: h.ktc_duoi,
    ktc_tren: h.ktc_tren,
    ktc: [h.uoc_luong - h.ktc_duoi, h.ktc_tren - h.uoc_luong] as [number, number],
  }));

  const duoi = Math.min(...diem.map((d) => d.ktc_duoi), MOC_CHUYEN_HOAN_TOAN);
  const tren = Math.max(...diem.map((d) => d.ktc_tren), 0);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="o-truc" className="text-sm font-medium">
          Đổi một lựa chọn trong phân tích
        </label>
        <select
          id="o-truc"
          value={dangChon}
          onChange={(e) => datDangChon(e.target.value)}
          className="h-11 w-full max-w-md rounded-md border bg-background px-3 text-base
                     outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {truc.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ChartContainer config={CAU_HINH_BIEU_DO} className="aspect-auto h-64 w-full">
        <ScatterChart margin={{ left: 8, right: 24, top: 16, bottom: 8 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="uoc_luong"
            domain={[Math.floor(duoi - 0.3), Math.ceil(tren + 0.3)]}
            tickFormatter={(v: number) => dinhDangSo(v, 1)}
            label={{
              value: "Điểm log ×100",
              position: "insideBottom",
              offset: -4,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis type="category" dataKey="muc" width={170} tick={{ fontSize: 12 }} interval={0} />
          <ReferenceLine x={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
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
                formatter={(_v, _n, item) => {
                  const d = item.payload as (typeof diem)[number];
                  return (
                    <div className="grid gap-0.5">
                      <span className="font-medium text-foreground">{d.muc}</span>
                      <span>{dinhDangDiemLog(d.uoc_luong)}</span>
                      <span>n = {dinhDangSoNguyen(d.n)}</span>
                      <span>{dinhDangP(d.p)}</span>
                    </div>
                  );
                }}
              />
            }
          />
          <Scatter data={diem} dataKey="uoc_luong" fill="var(--color-uoc_luong)">
            <ErrorBar
              dataKey="ktc"
              direction="x"
              width={6}
              strokeWidth={1.5}
              stroke="var(--color-uoc_luong)"
            />
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      <BangDuLieu<(typeof diem)[number]>
        cot={[
          { khoa: "muc", nhan: "Mức" },
          { khoa: "n", nhan: "n", dinhDang: (d) => dinhDangSoNguyen(d.n) },
          { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (d) => dinhDangSo(d.uoc_luong, 3) },
          {
            khoa: "ktc_duoi",
            nhan: "KTC 95%",
            dinhDang: (d) => `[${dinhDangSo(d.ktc_duoi, 2)} · ${dinhDangSo(d.ktc_tren, 2)}]`,
          },
          { khoa: "p", nhan: "p", dinhDang: (d) => dinhDangSo(d.p, 3) },
        ]}
        hang={diem}
        chuThich="Mỗi trục đổi MỘT lựa chọn tại một thời điểm, giữ nguyên mọi thứ còn lại — không phải tổ hợp mọi lựa chọn với nhau."
      />
    </div>
  );
}

/* ═══════════════════════════ TRANG ═══════════════════════════ */

export default function TrangDemo() {
  const chiTiet = useBamChuanChiTiet();
  const tongHop = useBamChuan();
  const doNhay = useDoNhay();

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Demo</h1>
        <p className="text-muted-foreground">
          Tự tra vào kết quả phân tích: chọn một mặt hàng để xem giá của nó lẽ ra phải là bao nhiêu,
          nhập một mức giá bất kỳ để tự tính, và gạt thử các lựa chọn phân tích để xem kết quả đổi
          tới đâu.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1 · Tra một mặt hàng</CardTitle>
          <CardDescription>
            Chọn một mặt hàng bất kỳ trong mẫu so sánh để xem giá trước, giá sau và giá lẽ ra phải
            có nếu cửa hàng giảm đúng theo phần thuế được giảm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrangThaiDuLieu
            dangTai={chiTiet.dangTai}
            loi={chiTiet.loi}
            duLieu={chiTiet.duLieu}
            thuLai={chiTiet.thuLai}
            chieuCaoTai="h-64"
          >
            {(hang) => <TraMatHang hang={hang} />}
          </TrangThaiDuLieu>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">2 · Tự tính thử một mức giá</CardTitle>
          <CardDescription>
            Cùng phép tính mà phân tích áp cho cả {dinhDangSoNguyen(287)} mặt hàng: nhân tỉ lệ thuế
            rồi làm tròn đến {dinhDangSoNguyen(BUOC_LAM_TRON)} đồng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MayTinhGia />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3 · Kết quả tổng hợp trên toàn bộ mặt hàng</CardTitle>
          <CardDescription>
            Áp phép tính ở trên cho từng mặt hàng rồi đếm xem bao nhiêu món rơi đúng mức.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrangThaiDuLieu
            dangTai={tongHop.dangTai}
            loi={tongHop.loi}
            duLieu={tongHop.duLieu}
            thuLai={tongHop.thuLai}
            chieuCaoTai="h-32"
          >
            {(hang) => {
              const z1 = hang.find((h) => h.Z === 1);
              const z0 = hang.find((h) => h.Z === 0);
              if (!z1) return null;
              return (
                <div className="grid gap-4">
                  <ThanhTiLe
                    nhan="Nhóm được giảm thuế — giá rơi đúng mức lẽ ra phải có"
                    tuSo={z1.n_bam_chuan}
                    mauSo={z1.n_du_bao_doi_muc}
                    noiBat
                    ghiChu={`${dinhDangSoNguyen(z1.n_giu_nguyen_gia)} mặt hàng giữ nguyên giá cũ, không đổi một đồng nào.`}
                  />
                  {z0 && (
                    <ThanhTiLe
                      nhan="Nhóm không được giảm thuế — để đối chiếu"
                      tuSo={z0.n_bam_chuan}
                      mauSo={z0.n_du_bao_doi_muc}
                    />
                  )}
                </div>
              );
            }}
          </TrangThaiDuLieu>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">4 · Đổi lựa chọn phân tích, xem kết quả đổi theo</CardTitle>
          <CardDescription>
            Chọn một trục để xem kết quả thay đổi ra sao khi đổi cửa sổ thời gian, cách xử lý các
            mặt hàng chưa phân loại được, hay ngưỡng số tuần bán tối thiểu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrangThaiDuLieu
            dangTai={doNhay.dangTai}
            loi={doNhay.loi}
            duLieu={doNhay.duLieu}
            thuLai={doNhay.thuLai}
            chieuCaoTai="h-64"
          >
            {(hang) => <BangDieuKhienDoNhay hang={hang} />}
          </TrangThaiDuLieu>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Mọi con số trên trang này lấy trực tiếp từ kết quả pipeline sinh ra. Phần giải thích phương
        pháp, giả định và giới hạn nằm ở các trang{" "}
        <a href="/thiet-ke" className="underline underline-offset-4">Thiết kế</a>,{" "}
        <a href="/ket-qua" className="underline underline-offset-4">Kết quả</a> và{" "}
        <a href="/han-che" className="underline underline-offset-4">Hạn chế</a>.
      </p>
    </div>
  );
}
