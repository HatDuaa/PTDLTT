/** Danh sách route của ứng dụng — dùng chung cho thanh điều hướng và footer. */
export interface MucDieuHuong {
  href: string;
  nhan: string;
  moTaNgan: string;
}

export const DANH_SACH_TUYEN: MucDieuHuong[] = [
  { href: "/", nhan: "Tóm tắt", moTaNgan: "Hạn chế và câu hỏi nghiên cứu" },
  { href: "/du-lieu", nhan: "Dữ liệu", moTaNgan: "Luồng mẫu, độ phủ, cân bằng tiền kỳ" },
  { href: "/thiet-ke", nhan: "Thiết kế", moTaNgan: "Khung Z/D, DAG, giả định" },
  { href: "/ket-qua", nhan: "Kết quả", moTaNgan: "Bốn ước lượng, cổng chẩn đoán, độ nhạy" },
  { href: "/suc-manh", nhan: "Sức mạnh & cơ chế", moTaNgan: "MDE, TOST, làm tròn, sản lượng" },
  { href: "/han-che", nhan: "Hạn chế", moTaNgan: "Danh sách hạn chế và câu cấm viết" },
  { href: "/trinh-bay", nhan: "Trình bày", moTaNgan: "Slide tóm tắt cho buổi báo cáo" },
];
