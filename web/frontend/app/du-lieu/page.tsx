"use client";

/**
 * Trang Dữ liệu — luồng mẫu, độ phủ theo tháng, ma trận chuyển thuế, cân bằng tiền
 * kỳ. Toàn bộ nguồn: `/api/luong-mau`, `/api/manifest`, `/api/theo-tang`,
 * `/api/eda/do-phu-theo-thang`, `/api/eda/ma-tran-chuyen-thue`.
 */
import { SoDoLuongMau } from "@/components/charts/so-do-luong-mau";
import { LovePlot } from "@/components/charts/love-plot";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { DienGiai } from "@/components/site/dien-giai";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useEda, useLuongMau } from "@/lib/hooks";
import { dinhDangPhanTram, dinhDangSoNguyen } from "@/lib/format";
import type { EdaDoPhuThangRow, EdaMaTranChuyenTheRow, LuongMauRow } from "@/lib/types";

export default function TrangDuLieu() {
  const luongMau = useLuongMau();
  const doPhu = useEda("do-phu-theo-thang");
  const chuyenThue = useEda("ma-tran-chuyen-thue");

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Dữ liệu</h1>
        <p className="text-muted-foreground">
          Nguồn: file bán hàng <code>60.xlsx</code> của một cửa hàng tiện lợi TP.HCM, sheet chi
          tiết hóa đơn nối với sheet danh mục SKU theo <code>soid</code>. Toàn bộ số liệu dưới đây
          lấy trực tiếp qua API, không có con số nào gõ tay.
        </p>
        <DienGiai tieuDe="Trang này để làm gì">
          <p>
            Trước khi tin bất kỳ kết quả nào, cần biết dữ liệu từ đâu mà ra và nó có lỗ hổng gì.
            Trang này trả lời đúng hai câu đó. Các trang kết quả phía sau chỉ đáng đọc nếu phần
            này đứng vững.
          </p>
        </DienGiai>
      </header>

      <div className="grid gap-3">
        <DienGiai kieu="vi-du">
          <p>
            Hai biểu đồ dưới đây đọc như một cái phễu. Đổ vào miệng phễu là toàn bộ dòng hóa đơn
            thô; chảy ra ở đáy là phần dữ liệu đủ sạch để so sánh giá cùng một mặt hàng trước và
            sau chính sách. Mỗi lần phễu hẹp lại là một quy tắc lọc đã được áp.
          </p>
        </DienGiai>
        <SoDoLuongMau />
      </div>

      <KhoiKetQua
        tieuDe="Bảng luồng lọc dòng hàng — đầy đủ các bước"
        moTa="Mỗi dòng là một quy tắc lọc áp dụng tuần tự trên toàn bộ dòng hàng, từ dữ liệu thô tới dữ liệu đưa vào phân tích."
        vaiTro="chinh"
      >
        <div className="grid gap-4">
          <DienGiai>
            <p>
              Đây là bản chi tiết của cái phễu ở trên. Mỗi dòng là một bước loại bớt dữ liệu, và
              cột &laquo;Quy tắc&raquo; nói rõ loại vì lý do gì, cột &laquo;Mất&raquo; nói rõ mất
              bao nhiêu. Nhờ vậy ai cũng kiểm lại được từng bước — không có bước nào giấu.
            </p>
          </DienGiai>
          <TrangThaiDuLieu dangTai={luongMau.dangTai} loi={luongMau.loi} duLieu={luongMau.duLieu} thuLai={luongMau.thuLai} chieuCaoTai="h-64">
          {(hang: LuongMauRow[]) => (
            <BangDuLieu<LuongMauRow>
              cot={[
                { khoa: "buoc", nhan: "Bước" },
                { khoa: "quy_tac", nhan: "Quy tắc" },
                { khoa: "dong_vao", nhan: "Dòng vào", dinhDang: (h) => dinhDangSoNguyen(h.dong_vao) },
                { khoa: "dong_ra", nhan: "Dòng ra", dinhDang: (h) => dinhDangSoNguyen(h.dong_ra) },
                { khoa: "mat", nhan: "Mất", dinhDang: (h) => dinhDangSoNguyen(h.mat) },
                { khoa: "ghi_chu", nhan: "Ghi chú", dinhDang: (h) => h.ghi_chu ?? "—" },
              ]}
              hang={hang}
            />
          )}
          </TrangThaiDuLieu>
        </div>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Độ phủ dữ liệu theo tháng"
        moTa="Số ngày có dữ liệu, số hóa đơn, số dòng hàng và tỉ lệ có mã vạch mỗi tháng. Mã vạch chỉ được điền đầy đủ từ 21/04/2025 — đây là lý do cửa sổ chính bắt đầu từ 01/05/2025."
        vaiTro="chan-doan"
      >
        <div className="grid gap-4">
          <DienGiai>
            <p>
              Bảng này cho thấy tháng nào có dữ liệu và tháng nào không. Cửa hàng không ghi nhận
              liên tục suốt cả giai đoạn, nên trước khi so sánh giá phải biết đoạn nào trống để
              không chọn nhầm khoảng thời gian làm mốc.
            </p>
          </DienGiai>
          <TrangThaiDuLieu dangTai={doPhu.dangTai} loi={doPhu.loi} duLieu={doPhu.duLieu} thuLai={doPhu.thuLai} chieuCaoTai="h-64">
          {(hang: EdaDoPhuThangRow[]) => (
            <BangDuLieu<EdaDoPhuThangRow>
              cot={[
                { khoa: "thang", nhan: "Tháng" },
                { khoa: "so_ngay_co_du_lieu", nhan: "Số ngày có dữ liệu" },
                { khoa: "so_hoa_don", nhan: "Số hóa đơn", dinhDang: (h) => dinhDangSoNguyen(h.so_hoa_don) },
                { khoa: "so_dong_hang", nhan: "Số dòng hàng", dinhDang: (h) => dinhDangSoNguyen(h.so_dong_hang) },
                { khoa: "ti_le_co_ma_vach", nhan: "Tỉ lệ có mã vạch", dinhDang: (h) => dinhDangPhanTram(h.ti_le_co_ma_vach / 100, 0) },
                { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => (h.so_sku === null ? "—" : dinhDangSoNguyen(h.so_sku)) },
              ]}
              hang={hang}
            />
          )}
          </TrangThaiDuLieu>
          <DienGiai kieu="canh-bao" tieuDe="Hai lỗ hổng phải nói thẳng">
            <p>
              Một, dữ liệu đứt hẳn một đoạn dài từ 13/03 đến 20/04/2025 — cột &laquo;Số ngày có dữ
              liệu&raquo; của hai tháng đó cho thấy rõ. Hai, mã vạch chỉ bắt đầu được điền từ
              21/04/2025; trước mốc đó không nhận diện được mặt hàng nào, nên các tháng đầu file
              không dùng để theo dõi giá cùng một mặt hàng được.
            </p>
            <p>
              Tháng 06 còn mất thêm một đoạn liên tiếp đầu tháng, từ 02/06 đến 10/06. Đây là lý do
              cửa sổ phân tích chính không kéo về đầu file.
            </p>
          </DienGiai>
        </div>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Ma trận chuyển thuế suất (tiền kỳ → hậu kỳ)"
        moTa="Số SKU theo từng cặp thuế suất quan sát được ở tiền kỳ và hậu kỳ. Nhóm 8%→8% áp đảo về số lượng, nhưng phần lớn là hàng chưa phân loại được nên không dùng làm đối chứng chính. Nhóm hàng chịu thuế tiêu thụ đặc biệt — rượu, bia, thuốc lá — nằm ở dòng 10%→10%."
        vaiTro="chinh"
      >
        <div className="grid gap-4">
          <DienGiai>
            <p>
              Bảng này đếm xem mỗi mặt hàng được xuất hóa đơn ở mức thuế nào trước chính sách và ở
              mức nào sau chính sách. Nó tách rõ hai câu hỏi khác nhau: luật có cho mặt hàng đó
              giảm thuế không, và cửa hàng có thật sự đổi mức thuế trên hóa đơn không. Mặt hàng lẽ
              ra được giảm mà vẫn nằm ở dòng giữ nguyên mức cũ chính là chỗ lộ ra việc cập nhật
              chưa đầy đủ.
            </p>
          </DienGiai>
          <TrangThaiDuLieu dangTai={chuyenThue.dangTai} loi={chuyenThue.loi} duLieu={chuyenThue.duLieu} thuLai={chuyenThue.thuLai} chieuCaoTai="h-48">
          {(hang: EdaMaTranChuyenTheRow[]) => (
            <BangDuLieu<EdaMaTranChuyenTheRow>
              cot={[
                { khoa: "tien", nhan: "Thuế suất tiền kỳ" },
                { khoa: "hau", nhan: "Thuế suất hậu kỳ" },
                { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
              ]}
              hang={hang}
            />
          )}
          </TrangThaiDuLieu>
        </div>
      </KhoiKetQua>

      <div className="grid gap-3">
        <DienGiai>
          <p>
            Trước khi so hai nhóm mặt hàng với nhau, phải xem chúng có giống nhau từ đầu không.
            Mỗi điểm trên biểu đồ là một đặc điểm của mặt hàng, ví dụ giá nền hay sức bán. Điểm
            càng xa vạch giữa thì hai nhóm càng lệch nhau ở đặc điểm đó.
          </p>
        </DienGiai>
        <LovePlot />
        <DienGiai kieu="canh-bao">
          <p>
            Hai nhóm khác nhau đáng kể về sức bán ngay từ trước chính sách. Nghĩa là mọi so sánh
            về sau phải đọc là &laquo;có điều chỉnh&raquo;, chứ không phải hai nhóm giống hệt nhau
            đem đặt cạnh nhau. Điều này ảnh hưởng tới việc nói tác động lớn bao nhiêu, và trang
            kết quả phải nêu kèm giới hạn đó.
          </p>
        </DienGiai>
      </div>
    </div>
  );
}
