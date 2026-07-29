"use client";

/**
 * Sơ đồ luồng mẫu & chọn lọc (biểu đồ bắt buộc #2): từ dòng hóa đơn thô tới SKU
 * sống sót ở cả hai kỳ theo Z. Toàn bộ số liệu lấy từ `/api/luong-mau`,
 * `/api/manifest` và `/api/theo-tang` — chỉ mô tả HÌNH DẠNG của chuỗi lọc, không có
 * con số nào gõ tay. Vì hai đoạn (dòng hàng vs. SKU) chênh nhau nhiều bậc độ lớn,
 * tách thành hai biểu đồ riêng để cột không bị "nuốt" — mỗi cột luôn có nhãn số
 * chính xác nên không gây hiểu lầm về tỉ lệ.
 */
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useLuongMau, useManifest, useTheoTang } from "@/lib/hooks";
import { dinhDangSoNguyen } from "@/lib/format";
import { dungSoDoLuongMau, tinhTongTheoZ, type BuocLuong } from "@/lib/derive";

const CAU_HINH: ChartConfig = {
  giaTri: { label: "Số dòng / số SKU", color: "var(--chart-3)" },
};

export function SoDoLuongMau() {
  const luongMau = useLuongMau();
  const manifest = useManifest();
  const theoTang = useTheoTang();

  const dangTai = luongMau.dangTai || manifest.dangTai || theoTang.dangTai;
  const loi = luongMau.loi ?? manifest.loi ?? theoTang.loi;
  const sanSang = luongMau.duLieu && manifest.duLieu && theoTang.duLieu;

  const thuLai = () => {
    luongMau.thuLai();
    manifest.thuLai();
    theoTang.thuLai();
  };

  return (
    <KhoiBieuDo
      tieuDe="Sơ đồ luồng mẫu & chọn lọc"
      moTa="Từ toàn bộ dòng hóa đơn thô tới SKU đủ điều kiện còn giá quan sát được ở cả hai kỳ, tách theo Z. Đây là mô tả HÌNH DẠNG luồng lọc; các số liệu lấy trực tiếp từ pipeline."
      vaiTro="chinh"
      moTaChoBieuDo="Hai biểu đồ cột ngang nối tiếp: (1) từ dòng hóa đơn thô tới dòng hàng đưa vào phân tích; (2) từ SKU trong danh mục phân tích tới số SKU sống sót ở cả hai kỳ, tách theo Z=1 (đủ điều kiện theo luật) và Z=0 (luật loại trừ)."
      bangThayThe={
        <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={sanSang} thuLai={thuLai}>
          {() => (
            <BangThayThe
              buoc={dungSoDoLuongMau(luongMau.duLieu!, manifest.duLieu!, tinhTongTheoZ(theoTang.duLieu!))}
            />
          )}
        </TrangThaiDuLieu>
      }
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={sanSang} thuLai={thuLai} chieuCaoTai="h-96">
        {() => (
          <NoiDungBieuDo
            buoc={dungSoDoLuongMau(luongMau.duLieu!, manifest.duLieu!, tinhTongTheoZ(theoTang.duLieu!))}
          />
        )}
      </TrangThaiDuLieu>
    </KhoiBieuDo>
  );
}

function NoiDungBieuDo({ buoc }: { buoc: BuocLuong[] }) {
  const doanDongHang = buoc.filter((b) => b.nhan.includes("Dòng") || b.nhan.includes("dòng"));
  const doanSku = buoc.filter((b) => !doanDongHang.includes(b));

  return (
    <div className="grid gap-6">
      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Giai đoạn 1 — lọc dòng hàng
        </p>
        <ChartContainer config={CAU_HINH} className="aspect-auto h-40 w-full">
          <BarChart data={doanDongHang} layout="vertical" margin={{ left: 8, right: 48 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis type="category" dataKey="nhan" width={160} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="nhan" />} />
            <Bar dataKey="giaTri" fill="var(--color-giaTri)" radius={3}>
              <LabelList
                dataKey="giaTri"
                position="right"
                formatter={(v) => dinhDangSoNguyen(Number(v))}
                fontSize={12}
                fill="var(--foreground)"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Giai đoạn 2 — từ danh mục SKU tới SKU sống sót theo Z
        </p>
        <ChartContainer config={CAU_HINH} className="aspect-auto h-40 w-full">
          <BarChart data={doanSku} layout="vertical" margin={{ left: 8, right: 48 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis type="category" dataKey="nhan" width={190} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="nhan" />} />
            <Bar dataKey="giaTri" radius={3}>
              {doanSku.map((b) => (
                <Cell key={b.nhan} fill="var(--color-giaTri)" />
              ))}
              <LabelList
                dataKey="giaTri"
                position="right"
                formatter={(v) => dinhDangSoNguyen(Number(v))}
                fontSize={12}
                fill="var(--foreground)"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function BangThayThe({ buoc }: { buoc: BuocLuong[] }) {
  return (
    <BangSoThayThe<BuocLuong>
      id="bang-luong-mau"
      tieuDe="Sơ đồ luồng mẫu & chọn lọc"
      cot={[
        { khoa: "nhan", nhan: "Bước" },
        { khoa: "giaTri", nhan: "Số dòng / số SKU", dinhDang: (h) => dinhDangSoNguyen(h.giaTri) },
        { khoa: "ghiChu", nhan: "Ghi chú", dinhDang: (h) => h.ghiChu ?? "—" },
      ]}
      hang={buoc}
    />
  );
}
