"use client";

/**
 * Trang Sức mạnh & cơ chế — MDE, sức mạnh TOST, mô phỏng làm tròn, sản lượng.
 * Toàn bộ nhánh sản lượng và cơ chế là KHÁM PHÁ, không phải nhân quả (chương 6).
 */
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DuongCongSucManh } from "@/components/charts/duong-cong-suc-manh";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { DienGiai } from "@/components/site/dien-giai";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useLamTron, useMde, useSanLuong } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangP, dinhDangPhanTram, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";
import { tachDuLieuMde } from "@/lib/derive";
import { BIEN_TOST_RONG } from "@/lib/hang-so-chinh-sach";
import type { LamTronRow, MdeDacTaRow, MdeRawRow, SanLuongRow } from "@/lib/types";

/**
 * `/api/san-luong` trộn hai đơn vị khác nhau trong cùng bảng: "biên độ tăng cường"
 * (sản lượng) đo bằng điểm log ×100, còn "biên độ mở rộng" (còn bán hay không) đo
 * bằng điểm phần trăm xác suất sống sót. Không được dùng chung một formatter.
 */
function donViNhanh(nhanh: string): string {
  return nhanh === "biên độ mở rộng" ? "điểm phần trăm" : "điểm log ×100";
}

/**
 * Điểm log ×100 → tỉ lệ thay đổi giá, chỉ dùng cho câu diễn giải bằng lời thường.
 * Bảng số vẫn giữ nguyên đơn vị gốc; đây chỉ là cách nói dễ hình dung hơn cho cùng
 * một con số lấy từ API.
 */
function tiLeTuDiemLog(diem: number | undefined): number | undefined {
  return diem === undefined ? undefined : Math.expm1(diem / 100);
}

const CAU_HINH_LAM_TRON: ChartConfig = {
  ti_le_doi_muc: { label: "Tỉ lệ SKU đổi mức giá", color: "var(--chart-3)" },
};

export default function TrangSucManh() {
  const mde = useMde();
  const lamTron = useLamTron();
  const sanLuong = useSanLuong();

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Sức mạnh thống kê &amp; cơ chế</h1>
        <p className="text-muted-foreground">
          Chương 5 cho ước lượng điểm. Trang này trả lời: dữ liệu có đủ sức phát hiện tác động
          không, và cơ chế nào giải thích kết quả. Toàn bộ nhánh sản lượng và cơ chế là{" "}
          <strong>khám phá</strong>, không phải nhân quả.
        </p>
      </header>

      <KhoiKetQua
        tieuDe="Độ lớn tối thiểu phát hiện được (MDE)"
        moTa="MDE là thay đổi nhỏ nhất mà dữ liệu có khả năng phát hiện đủ tin cậy. Mỗi đặc tả là một cách đặt mô hình và điều chỉnh khác nhau, nên có MDE riêng."
        vaiTro="chan-doan"
      >
        <TrangThaiDuLieu dangTai={mde.dangTai} loi={mde.loi} duLieu={mde.duLieu} thuLai={mde.thuLai} chieuCaoTai="h-48">
          {(hang: MdeRawRow[]) => {
            const { dacTa } = tachDuLieuMde(hang);
            const mdeSapXep = dacTa.map((h) => h.mde).sort((a, b) => a - b);
            const mdeNhoNhat = mdeSapXep[0];
            const mdeLonNhat = mdeSapXep[mdeSapXep.length - 1];
            return (
              <>
                <BangDuLieu<MdeDacTaRow>
                  cot={[
                    { khoa: "dac_ta", nhan: "Đặc tả" },
                    { khoa: "se", nhan: "SE", dinhDang: (h) => dinhDangSo(h.se, 3) },
                    { khoa: "mde", nhan: "MDE", dinhDang: (h) => dinhDangDiemLog(h.mde) },
                    {
                      khoa: "suc_manh_tai_moc_chuyen_hoan_toan",
                      nhan: "Sức mạnh tại mốc chuyển hoàn toàn",
                      dinhDang: (h) => dinhDangPhanTram(h.suc_manh_tai_moc_chuyen_hoan_toan, 0),
                    },
                  ]}
                  hang={dacTa}
                />
                <DienGiai kieu="vi-du" className="mt-3">
                  <p>
                    Hãy hình dung một cái cân chỉ có vạch chia 1 kg. Người tăng 3 kg thì cân thấy
                    ngay, còn người tăng 400 g thì cân vẫn báo &ldquo;không đổi&rdquo; — không phải
                    họ không tăng, mà cân không đủ mịn.
                  </p>
                  {mdeSapXep.length > 0 && (
                    <p>
                      Cột MDE chính là vạch chia của phép đo này: {dinhDangSo(mdeNhoNhat, 2)}–
                      {dinhDangSo(mdeLonNhat, 2)} điểm log ×100, tức khoảng{" "}
                      {dinhDangPhanTram(tiLeTuDiemLog(mdeNhoNhat), 1)} đến{" "}
                      {dinhDangPhanTram(tiLeTuDiemLog(mdeLonNhat), 1)} của giá. Mức thay đổi giá nhỏ
                      hơn vạch chia đó thì dữ liệu này không tách được khỏi trường hợp giá giữ
                      nguyên. Mỗi đặc tả đo bằng một cái cân khác nhau nên vạch chia cũng khác.
                    </p>
                  )}
                </DienGiai>
              </>
            );
          }}
        </TrangThaiDuLieu>
        <p className="mt-2 text-xs text-muted-foreground">
          Không tính &ldquo;sức mạnh hậu kiểm&rdquo; (observed power) — nó chỉ là một phép biến đổi
          đơn điệu của p-value, không thêm thông tin.
        </p>
      </KhoiKetQua>

      <DuongCongSucManh />

      <DienGiai>
        <p>
          Đường cong trên không nói chính sách đã gây ra điều gì. Nó chỉ trả lời một câu: nếu chênh
          lệch thật lớn dần lên thì khả năng phương pháp nhìn thấy được nó tăng ra sao — chênh lệch
          càng lớn, càng khó bỏ sót.
        </p>
        <p>
          Điểm cần chú ý: ngay tại mức tương ứng với chuyển hoàn toàn, khả năng nhìn thấy vẫn chưa
          đạt ngưỡng mục tiêu của thiết kế. Đây là bài kiểm tra cho thấy cách tính sức mạnh chạy
          đúng, không phải một kết quả mới về tác động.
        </p>
      </DienGiai>

      <KhoiKetQua
        tieuDe="Sức mạnh của TOST — biên đã chọn có khả thi không"
        moTa={`TOST hỏi chênh lệch có đủ nhỏ để xem là gần như tương đương không. Biên ±${dinhDangSo(BIEN_TOST_RONG, 3)} đang dùng nhỏ hơn mức cần cho 80% sức mạnh ở cả bốn đặc tả.`}
        vaiTro="chan-doan"
      >
        <TrangThaiDuLieu dangTai={mde.dangTai} loi={mde.loi} duLieu={mde.duLieu} thuLai={mde.thuLai} chieuCaoTai="h-48">
          {(hang: MdeRawRow[]) => {
            const { dacTa } = tachDuLieuMde(hang);
            return (
              <BangDuLieu<MdeDacTaRow>
                cot={[
                  { khoa: "dac_ta", nhan: "Đặc tả" },
                  {
                    khoa: "bien_tost_du_80",
                    nhan: "Biên cần cho 80% sức mạnh",
                    dinhDang: (h) => `±${dinhDangSo(h.bien_tost_du_80, 3)}`,
                  },
                  {
                    khoa: "suc_manh_tost_bien_dang_dung",
                    nhan: "Sức mạnh tại biên đang dùng",
                    dinhDang: (h) => dinhDangPhanTram(h.suc_manh_tost_bien_dang_dung, 0),
                  },
                ]}
                hang={dacTa}
              />
            );
          }}
        </TrangThaiDuLieu>
        <DienGiai kieu="canh-bao" className="mt-3">
          <p>
            Muốn chứng minh &ldquo;giá gần như không đổi&rdquo; thì phải đặt trước một mức sai lệch
            còn xem là chấp nhận được — đó chính là biên của TOST. Biên đã chọn hẹp hơn nhiều so với
            độ chính xác mà dữ liệu này đạt tới, nên phép kiểm không có cơ hội thành công, kể cả khi
            tác động thật đúng bằng không.
          </p>
          <p>
            Vì vậy việc TOST thất bại <strong>không</strong> phải bằng chứng chống lại chuyện giá
            gần như không đổi. Nó chỉ cho biết thước đo chưa đủ mịn cho cái biên đã đặt ra.
          </p>
        </DienGiai>
      </KhoiKetQua>

      <KhoiBieuDo
        tieuDe="Mô phỏng làm tròn giá — chuẩn cơ học"
        moTa="Câu hỏi duy nhất: NẾU cửa hàng chuyển hoàn toàn phần giảm thuế VÀ làm tròn theo quy tắc R, giá niêm yết có phải đổi mức không? Đây là phép tính cơ học, không suy luận về hành vi định giá thật."
        vaiTro="co-hoc"
        moTaChoBieuDo="Biểu đồ cột thể hiện tỉ lệ SKU sẽ đổi mức giá niêm yết dưới giả định chuyển hoàn toàn, tại ba lưới làm tròn 1.000đ, 500đ và 100đ. Tỉ lệ tăng dần khi lưới làm tròn mịn hơn."
        ghiChu={
          <div className="space-y-2">
            <DienGiai className="text-foreground">
              <p>
                Câu hỏi ở đây rất hẹp: nếu cửa hàng giảm giá đúng theo phần thuế rồi làm tròn cho
                đẹp con số, giá niêm yết có buộc phải đổi mức không? Với phần lớn mặt hàng thì có,
                và lưới làm tròn càng mịn thì tỉ lệ buộc phải đổi càng cao.
              </p>
              <p>
                Nghĩa là riêng thói quen làm tròn giá không đủ để giải thích việc giá đứng im. Nhưng
                đây mới chỉ là phép tính trên giấy, chưa nói gì về lý do cửa hàng đặt giá như đã đặt.
              </p>
            </DienGiai>
            <p>
              Giá dùng để tính là <strong>giá giao dịch trung vị</strong> — mức giá ở giữa trong
              các lần bán của mặt hàng đó, lấy từ hóa đơn. Nó không chắc trùng với giá dán trên
              kệ; mô phỏng giả định hai thứ trùng nhau.
            </p>
            <p>
              ⚠️ Không được suy ra: SKU thực tế phải giảm giá · cửa hàng cố tình không chuyển thuế ·
              quy tắc làm tròn &ldquo;bị bác bỏ&rdquo; · chi phí thực đơn không tồn tại.
            </p>
          </div>
        }
        bangThayThe={
          <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} thuLai={lamTron.thuLai}>
            {(hang: LamTronRow[]) => (
              <BangSoThayThe<LamTronRow>
                id="bang-lam-tron"
                tieuDe="Mô phỏng làm tròn giá"
                cot={[
                  { khoa: "buoc_lam_tron", nhan: "Lưới làm tròn", dinhDang: (h) => `${dinhDangSoNguyen(h.buoc_lam_tron)}đ` },
                  { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
                  { khoa: "so_doi_muc", nhan: "Số đổi mức", dinhDang: (h) => dinhDangSoNguyen(h.so_doi_muc) },
                  { khoa: "ti_le_doi_muc", nhan: "Tỉ lệ", dinhDang: (h) => dinhDangPhanTram(h.ti_le_doi_muc, 1) },
                ]}
                hang={hang}
              />
            )}
          </TrangThaiDuLieu>
        }
      >
        <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} thuLai={lamTron.thuLai} chieuCaoTai="h-56">
          {(hang: LamTronRow[]) => (
            <ChartContainer config={CAU_HINH_LAM_TRON} className="aspect-auto h-56 w-full">
              <BarChart data={hang} margin={{ left: 8, right: 8, top: 16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="buoc_lam_tron" tickFormatter={(v: number) => `${dinhDangSoNguyen(v)}đ`} />
                <YAxis domain={[0, 1]} tickFormatter={(v: number) => dinhDangPhanTram(v, 0)} width={56} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => `Lưới ${dinhDangSoNguyen(Number(v))}đ`}
                      formatter={(value) => [dinhDangPhanTram(Number(value), 1), "tỉ lệ đổi mức"]}
                    />
                  }
                />
                <Bar dataKey="ti_le_doi_muc" fill="var(--color-ti_le_doi_muc)" radius={4}>
                  <LabelList dataKey="ti_le_doi_muc" position="top" formatter={(v) => dinhDangPhanTram(Number(v), 1)} fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </TrangThaiDuLieu>
      </KhoiBieuDo>

      <KhoiKetQua
        tieuDe="Biên độ mở rộng và tăng cường — sản lượng và việc còn bán"
        moTa="Biên độ tăng cường hỏi món còn bán thì bán nhiều hay ít; biên độ mở rộng hỏi món có còn được bán không. Đây là khám phá, không phải nhân quả."
        vaiTro="kham-pha"
      >
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} thuLai={sanLuong.thuLai} chieuCaoTai="h-40">
          {(hang: SanLuongRow[]) => (
            <BangDuLieu<SanLuongRow>
              cot={[
                { khoa: "nhanh", nhan: "Nhánh" },
                { khoa: "donVi", nhan: "Đơn vị", dinhDang: (h) => donViNhanh(h.nhanh) },
                { khoa: "n", nhan: "n", dinhDang: (h) => dinhDangSoNguyen(h.n) },
                { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => `${dinhDangSo(h.uoc_luong, 2)} ${donViNhanh(h.nhanh)}` },
                { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                {
                  khoa: "ktc",
                  nhan: "KTC 95%",
                  dinhDang: (h) => `[${dinhDangSo(h.ktc_duoi, 2)}; ${dinhDangSo(h.ktc_tren, 2)}] ${donViNhanh(h.nhanh)}`,
                },
                { khoa: "mde", nhan: "MDE 80%", dinhDang: (h) => `${dinhDangSo(h.mde, 2)} ${donViNhanh(h.nhanh)}` },
              ]}
              hang={hang}
            />
          )}
        </TrangThaiDuLieu>
        <DienGiai kieu="vi-du" className="mt-3">
          <p>
            Tìm chênh lệch sản lượng ở đây giống như đo một tiếng thì thầm: trong thư viện thì nghe
            rõ, giữa chợ thì không. Micro không hỏng, chợ ồn.
          </p>
          <p>
            Ở cả hai nhánh, cột MDE 80% — mức nhỏ nhất mà thiết kế đủ sức phát hiện — đều lớn hơn
            con số ước lượng. Nói cách khác, con số quan sát được nằm trong vùng mù của chính thiết
            kế, nên dữ liệu này không cho kết luận theo cả hai chiều.
          </p>
        </DienGiai>
        <DienGiai kieu="vi-du" tieuDe="Chỉ đo được ai còn ở lại" className="mt-3">
          <p>
            Nhánh biên độ mở rộng còn một cái bẫy riêng. Giống như muốn biết chiều cao trung bình cả
            trường nhưng chỉ đo được những em còn ở lại lớp bóng rổ — số đo lệch không phải vì đo
            sai, mà vì chọn nhầm người để đo.
          </p>
          <p>
            Ở đây giá kỳ sau chỉ nhìn thấy được ở những mặt hàng còn được bán. Mọi con số về giá vì
            thế chỉ mô tả nhóm mặt hàng đó, không mô tả toàn bộ danh mục ban đầu.
          </p>
        </DienGiai>
        <p className="mt-2 text-xs text-muted-foreground">
          Không cộng hai nhánh thành &ldquo;tổng tác động&rdquo; — một bên là log sản lượng có điều
          kiện sống sót, bên kia là xác suất sống sót, hai đại lượng khác nhau. Cấm đọc &ldquo;gần có
          ý nghĩa&rdquo; hay &ldquo;có xu hướng giảm&rdquo; khi MDE lớn hơn nhiều so với ước lượng
          điểm.
        </p>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Phạm vi của bất định"
        vaiTro="chan-doan"
      >
        <p className="text-sm">
          HC3 là cách tính sai số chuẩn chịu được mức biến động khác nhau giữa các SKU. Bootstrap là
          lấy mẫu lặp lại nhiều lần để xem ước lượng dao động ra sao. Cả hai chỉ đo bất định có điều
          kiện ở cấp SKU; bất định ở cấp chính sách — một cửa hàng, một ngày, một người ra quyết
          định giá — không ước lượng được bằng dữ liệu này. Hai chẩn đoán bổ sung (gộp cụm theo nhóm
          hàng, hoán vị nhãn trong tầng) cũng không giải quyết được giới hạn đó.
        </p>
        <DienGiai className="mt-3">
          <p>
            Hai cách tính trên chỉ trả lời một câu hỏi hẹp: nếu bốc lại một mẻ mặt hàng khác ở đúng
            cửa hàng này thì con số sẽ nhảy cỡ nào.
          </p>
          <p>
            Câu hỏi rộng hơn — một cửa hàng khác, một ngày khác, một người quyết giá khác thì sao —
            dữ liệu của một cửa hàng không trả lời được. Vì vậy kết quả mô tả đúng cửa hàng này, và
            chỉ cửa hàng này.
          </p>
        </DienGiai>
      </KhoiKetQua>
    </div>
  );
}
