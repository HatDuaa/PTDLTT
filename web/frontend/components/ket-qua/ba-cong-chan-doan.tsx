"use client";

/**
 * Ba cổng chẩn đoán — luôn hiện RIÊNG từng cổng, không gộp thành điểm tổng hợp và
 * không dùng đèn xanh/đỏ. Ba cổng không phải ba lá phiếu (chương 5.5): cổng 2 đạt
 * không bù được cổng 1 trượt và cổng 3 không đạt.
 */
import { Badge } from "@/components/ui/badge";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useCongChanDoan, useSmdSauPhanTang } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangP, dinhDangPhanTram, dinhDangSmd, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";
import { BIEN_TOST_RONG } from "@/lib/hang-so-chinh-sach";
import { NGUONG_SMD, TY_LE_TOI_DA_VUOT_NGUONG_SMD } from "@/lib/nguong-thiet-ke";
import type { CongChanDoanRow, SmdSauPhanTangRow } from "@/lib/types";

function TrangThaiCong({ dat }: { dat: boolean | undefined }) {
  if (dat === undefined) return <Badge variant="outline">—</Badge>;
  // Cố ý dùng chữ, không dùng đèn xanh/đỏ — vẫn cùng một kiểu badge viền trung tính.
  return <Badge variant="outline">{dat ? "đạt" : "không đạt"}</Badge>;
}

export function BaCongChanDoan() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <CongMot />
      <CongHai />
      <CongBa />
    </div>
  );
}

const NHAN_BIEN_SMD: Record<string, string> = {
  log_pre_p: "log(giá nền)",
  log1p_pre_q: "log(1+sản lượng)",
  pre_w: "số tuần xuất hiện",
};

function CongMot() {
  const { duLieu, dangTai, loi, thuLai } = useSmdSauPhanTang();
  return (
    <KhoiKetQua
      tieuDe="Cổng 1 — Cân bằng"
      moTa={`Tiêu chí khóa trước: ≤ ${dinhDangPhanTram(TY_LE_TOI_DA_VUOT_NGUONG_SMD, 0)} cặp |SMD| > ${dinhDangSo(NGUONG_SMD, 2)} SAU phân tầng theo 5 tầng giá.`}
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai} chieuCaoTai="h-40">
        {(hang) => {
          const soCap = hang.length;
          const soVuot = hang.filter((h) => h.vuot_nguong).length;
          const dat = soVuot / soCap <= TY_LE_TOI_DA_VUOT_NGUONG_SMD;
          return (
            <div className="grid gap-3 text-sm">
              <p>
                <strong>
                  {dinhDangSoNguyen(soVuot)}/{dinhDangSoNguyen(soCap)}
                </strong>{" "}
                cặp (tầng × hiệp biến) vượt ngưỡng SAU phân tầng → <TrangThaiCong dat={dat} />.
              </p>
              <BangDuLieu<SmdSauPhanTangRow>
                cot={[
                  { khoa: "tang", nhan: "Tầng" },
                  { khoa: "bien", nhan: "Hiệp biến", dinhDang: (h) => NHAN_BIEN_SMD[h.bien] ?? h.bien },
                  { khoa: "smd", nhan: "SMD", dinhDang: (h) => dinhDangSmd(h.smd) },
                  { khoa: "vuot_nguong", nhan: "Vượt ngưỡng", dinhDang: (h) => (h.vuot_nguong ? "có" : "không") },
                ]}
                hang={hang}
              />
            </div>
          );
        }}
      </TrangThaiDuLieu>
    </KhoiKetQua>
  );
}

function CongHai() {
  const { duLieu, dangTai, loi, thuLai } = useCongChanDoan();
  return (
    <KhoiKetQua
      tieuDe="Cổng 2 — Giả dược 05→06"
      moTa={`Tiêu chí khóa trước: |ước lượng giả dược| ≤ ${dinhDangDiemLog(BIEN_TOST_RONG)}.`}
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai} chieuCaoTai="h-40">
        {(hang) => (
          <BangDuLieu<CongChanDoanRow>
            cot={[
              { khoa: "mau", nhan: "Mẫu" },
              { khoa: "dac_ta", nhan: "Đặc tả" },
              { khoa: "uoc_luong", nhan: "Ước lượng giả dược", dinhDang: (h) => dinhDangDiemLog(h.uoc_luong) },
              {
                khoa: "truot_cong2",
                nhan: "Trạng thái",
                dinhDang: (h) => (h.truot_cong2 ? "trượt" : "đạt"),
              },
            ]}
            hang={hang}
          />
        )}
      </TrangThaiDuLieu>
    </KhoiKetQua>
  );
}

function CongBa() {
  const { duLieu, dangTai, loi, thuLai } = useCongChanDoan();
  return (
    <KhoiKetQua
      tieuDe="Cổng 3 — TOST tiền xu hướng"
      moTa={`Tiêu chí khóa trước: p < 0,05 ở biên ±${dinhDangSo(BIEN_TOST_RONG, 3)}.`}
    >
      <TrangThaiDuLieu dangTai={dangTai} loi={loi} duLieu={duLieu} thuLai={thuLai} chieuCaoTai="h-40">
        {(hang) => (
          <BangDuLieu<CongChanDoanRow>
            cot={[
              { khoa: "mau", nhan: "Mẫu" },
              { khoa: "dac_ta", nhan: "Đặc tả" },
              { khoa: "tost_p", nhan: "TOST p", dinhDang: (h) => dinhDangP(h.tost_p) },
              {
                khoa: "tuong_duong_cong3",
                nhan: "Trạng thái",
                dinhDang: (h) => (h.tuong_duong_cong3 ? "đạt" : "không đạt"),
              },
            ]}
            hang={hang}
          />
        )}
      </TrangThaiDuLieu>
    </KhoiKetQua>
  );
}
