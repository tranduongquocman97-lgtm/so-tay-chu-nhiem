/**
 * ============================================================================
 * SỔ TAY CHỦ NHIỆM ĐIỆN TỬ 10A12 (K58-QT) - TRUNG TÂM ĐIỀU HÀNH RBAC
 * Tệp: app.js
 * Phiên bản: 10.0 (Tự động Phân quyền 3 Cấp RBAC, Sửa Lỗi Quỹ Lớp, Chạm Đổi Chỗ)
 * ============================================================================
 */

const GAS_API_URL = localStorage.getItem("10A12_SCRIPT_URL") || "https://script.google.com/macros/s/AKfycby1bzee0jofemhb1lTYoi_wIdFpd_jneRKW8TtzUDyrtKGdkfk6K0OGErPfyKsjlB9hfQ/exec";

// CƠ SỞ DỮ LIỆU GỐC 45 HỌC SINH 10A12
const DEFAULT_STUDENTS_10A12 = [
  // TỔ 1
  { id: "HS01", hoTen: "Nguyễn Tấn An", to: "Tổ 1", chucVu: "Lớp trưởng", diemThiDua: 100, soCCCD: "052206001234", ngayCapCCCD: "15/05/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Nguyễn Văn Hùng", ngheNghiepBa: "Cán bộ công chức", sdtBa: "0905123456", tenMe: "Trần Thị Mai", ngheNghiepMe: "Giáo viên", sdtMe: "0905123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS01", matKhau: "123456" },
  { id: "HS02", hoTen: "Võ Hiền Đức", to: "Tổ 1", chucVu: "Tổ trưởng T1", diemThiDua: 100, soCCCD: "052206001235", ngayCapCCCD: "10/08/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Võ Văn Nam", ngheNghiepBa: "Kinh doanh tự do", sdtBa: "0914123456", tenMe: "Lê Thị Lan", ngheNghiepMe: "Kế toán", sdtMe: "0914123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS02", matKhau: "123456" },
  { id: "HS03", hoTen: "Lê Thành Huy", to: "Tổ 1", chucVu: "Cờ đỏ", diemThiDua: 100, soCCCD: "052206001236", ngayCapCCCD: "12/06/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Lê Văn Tuấn", ngheNghiepBa: "Kỹ sư xây dựng", sdtBa: "0983123456", tenMe: "Phạm Thị Hoa", ngheNghiepMe: "Nội trợ", sdtMe: "0983123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS03", matKhau: "123456" },
  { id: "HS04", hoTen: "Trần Hiếu Trung", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001237", ngayCapCCCD: "20/09/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Trần Văn Bình", ngheNghiepBa: "Làm nông", sdtBa: "0977123456", tenMe: "Nguyễn Thị Thảo", ngheNghiepMe: "Làm nông", sdtMe: "0977123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS04", matKhau: "123456" },
  { id: "HS05", hoTen: "Đặng Thị Hiền Trân", to: "Tổ 1", chucVu: "Phó VTM", diemThiDua: 100, soCCCD: "052206001238", ngayCapCCCD: "14/04/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Đặng Văn Phúc", ngheNghiepBa: "Bác sĩ", sdtBa: "0935123456", tenMe: "Bùi Thị Ngọc", ngheNghiepMe: "Dược sĩ", sdtMe: "0935123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS05", matKhau: "123456" },
  { id: "HS06", hoTen: "Bùi Huỳnh Như Ý", to: "Tổ 1", chucVu: "Ban Thi đua", diemThiDua: 100, soCCCD: "052206001239", ngayCapCCCD: "18/07/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Bùi Văn Thành", ngheNghiepBa: "Kinh doanh", sdtBa: "0908123456", tenMe: "Trương Thị Thu", ngheNghiepMe: "Kinh doanh", sdtMe: "0908123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS06", matKhau: "123456" },
  { id: "HS07", hoTen: "Nguyễn Thị Thanh Trà", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001240", ngayCapCCCD: "22/11/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Đức", ngheNghiepBa: "Tài xế", sdtBa: "0918123456", tenMe: "Lê Thị Yến", ngheNghiepMe: "May mặc", sdtMe: "0918123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS07", matKhau: "123456" },
  { id: "HS08", hoTen: "Phan Thị Hà My", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001241", ngayCapCCCD: "05/03/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Phan Văn Long", ngheNghiepBa: "Làm nông", sdtBa: "0949123456", tenMe: "Đỗ Thị Phượng", ngheNghiepMe: "Nội trợ", sdtMe: "0949123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS08", matKhau: "123456" },
  { id: "HS09", hoTen: "Huỳnh Minh Đức", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001242", ngayCapCCCD: "11/09/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Huỳnh Văn Hải", ngheNghiepBa: "Thợ cơ khí", sdtBa: "0962123456", tenMe: "Ngô Thị Cúc", ngheNghiepMe: "Kinh doanh nhỏ", sdtMe: "0962123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS09", matKhau: "123456" },
  { id: "HS10", hoTen: "Nguyễn Văn Nhuận", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001243", ngayCapCCCD: "19/10/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Quang", ngheNghiepBa: "Làm vườn", sdtBa: "0972123456", tenMe: "Lý Thị Đào", ngheNghiepMe: "Nội trợ", sdtMe: "0972123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS10", matKhau: "123456" },
  { id: "HS11", hoTen: "Đinh Văn Khoa", to: "Tổ 1", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001244", ngayCapCCCD: "25/08/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Đinh Văn Sang", ngheNghiepBa: "Làm nông", sdtBa: "0989123456", tenMe: "Trần Thị Bé", ngheNghiepMe: "Làm nông", sdtMe: "0989123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS11", matKhau: "123456" },

  // TỔ 2
  { id: "HS12", hoTen: "Phan Ngọc Thuỳ", to: "Tổ 2", chucVu: "Tổ trưởng T2", diemThiDua: 100, soCCCD: "052206001245", ngayCapCCCD: "14/06/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Phan Văn Khoát", ngheNghiepBa: "Giáo viên", sdtBa: "0903123456", tenMe: "Võ Thị Lệ", ngheNghiepMe: "Y sĩ", sdtMe: "0903123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS12", matKhau: "123456" },
  { id: "HS13", hoTen: "Bùi Trần Khánh Nhi", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001246", ngayCapCCCD: "17/05/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Bùi Văn Thuận", ngheNghiepBa: "Kỹ sư điện", sdtBa: "0913123456", tenMe: "Trần Thị Xuân", ngheNghiepMe: "Kinh doanh", sdtMe: "0913123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS13", matKhau: "123456" },
  { id: "HS14", hoTen: "Trần Anh Thư", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001247", ngayCapCCCD: "09/02/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Trần Văn Hòa", ngheNghiepBa: "Làm nông", sdtBa: "0923123456", tenMe: "Nguyễn Thị Lài", ngheNghiepMe: "Nội trợ", sdtMe: "0923123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS14", matKhau: "123456" },
  { id: "HS15", hoTen: "Lê Thị Trúc Phượng", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001248", ngayCapCCCD: "18/03/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Lê Văn Tiến", ngheNghiepBa: "Thợ may", sdtBa: "0933123456", tenMe: "Đặng Thị Sen", ngheNghiepMe: "Buôn bán", sdtMe: "0933123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS15", matKhau: "123456" },
  { id: "HS16", hoTen: "Nguyễn Bảo Khôi", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001249", ngayCapCCCD: "29/07/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Dũng", ngheNghiepBa: "Xây dựng", sdtBa: "0943123456", tenMe: "Hà Thị Hồng", ngheNghiepMe: "Nội trợ", sdtMe: "0943123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS16", matKhau: "123456" },
  { id: "HS17", hoTen: "Trương Hà Quý", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001250", ngayCapCCCD: "12/12/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Trương Văn Bảy", ngheNghiepBa: "Làm nông", sdtBa: "0953123456", tenMe: "Vũ Thị Vân", ngheNghiepMe: "Làm nông", sdtMe: "0953123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS17", matKhau: "123456" },
  { id: "HS18", hoTen: "Ngô Văn Vỹ", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001251", ngayCapCCCD: "24/04/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Ngô Văn Kiệt", ngheNghiepBa: "Cơ khí", sdtBa: "0963123456", tenMe: "Dương Thị Huệ", ngheNghiepMe: "Buôn bán", sdtMe: "0963123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS18", matKhau: "123456" },
  { id: "HS19", hoTen: "Đỗ Huy Vũ", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001252", ngayCapCCCD: "08/06/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Đỗ Văn Toàn", ngheNghiepBa: "Kinh doanh", sdtBa: "0973123456", tenMe: "Lâm Thị Hạnh", ngheNghiepMe: "Kế toán", sdtMe: "0973123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS19", matKhau: "123456" },
  { id: "HS20", hoTen: "Nguyễn Thái Hoàng", to: "Tổ 2", chucVu: "Lớp phó Lao động", diemThiDua: 100, soCCCD: "052206001253", ngayCapCCCD: "16/01/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Nguyễn Văn Cường", ngheNghiepBa: "Công chức", sdtBa: "0984123456", tenMe: "Lê Thị Thảo", ngheNghiepMe: "Giáo viên", sdtMe: "0984123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS20", matKhau: "123456" },
  { id: "HS21", hoTen: "Võ Thị Kim Nhung", to: "Tổ 2", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001254", ngayCapCCCD: "21/05/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Võ Văn Thắng", ngheNghiepBa: "Làm nông", sdtBa: "0994123456", tenMe: "Trần Thị Diệu", ngheNghiepMe: "Nội trợ", sdtMe: "0994123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS21", matKhau: "123456" },
  { id: "HS22", hoTen: "Nguyễn My Su", to: "Tổ 2", chucVu: "Thủ quỹ lớp", diemThiDua: 100, soCCCD: "052206001255", ngayCapCCCD: "30/03/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Nguyễn Văn Lộc", ngheNghiepBa: "Kinh doanh vật tư", sdtBa: "0915123456", tenMe: "Phan Thị Loan", ngheNghiepMe: "Kế toán", sdtMe: "0915123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS22", matKhau: "123456" },

  // TỔ 3
  { id: "HS23", hoTen: "Trương Đức Tài", to: "Tổ 3", chucVu: "Tổ trưởng T3", diemThiDua: 100, soCCCD: "052206001256", ngayCapCCCD: "11/04/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Trương Văn Khang", ngheNghiepBa: "Cán bộ huyện", sdtBa: "0906123456", tenMe: "Lý Thị Trinh", ngheNghiepMe: "Nhân viên bưu điện", sdtMe: "0906123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS23", matKhau: "123456" },
  { id: "HS24", hoTen: "Đỗ Quyết Tâm", to: "Tổ 3", chucVu: "Lớp phó Học tập", diemThiDua: 100, soCCCD: "052206001257", ngayCapCCCD: "04/09/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Đỗ Văn Nghĩa", ngheNghiepBa: "Bác sĩ thú y", sdtBa: "0916123456", tenMe: "Vũ Thị Quỳnh", ngheNghiepMe: "Giáo viên mầm non", sdtMe: "0916123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS24", matKhau: "123456" },
  { id: "HS25", hoTen: "Lê Quốc Hưng", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001258", ngayCapCCCD: "14/10/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Lê Văn Sơn", ngheNghiepBa: "Thợ hàn", sdtBa: "0926123456", tenMe: "Tạ Thị Tuyết", ngheNghiepMe: "Làm nông", sdtMe: "0926123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS25", matKhau: "123456" },
  { id: "HS26", hoTen: "Nguyễn Hữu Phong", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001259", ngayCapCCCD: "20/06/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Hùng", ngheNghiepBa: "Lái xe tải", sdtBa: "0936123456", tenMe: "Trần Thị Thu", ngheNghiepMe: "Nội trợ", sdtMe: "0936123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS26", matKhau: "123456" },
  { id: "HS27", hoTen: "Vũ Đồng Tiến", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001260", ngayCapCCCD: "28/01/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Vũ Văn Lương", ngheNghiepBa: "Làm nông", sdtBa: "0946123456", tenMe: "Mai Thị Hằng", ngheNghiepMe: "Làm nông", sdtMe: "0946123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS27", matKhau: "123456" },
  { id: "HS28", hoTen: "Phạm Khởi Nghĩa", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001261", ngayCapCCCD: "07/07/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Phạm Văn Tân", ngheNghiepBa: "Xây dựng", sdtBa: "0956123456", tenMe: "Hồ Thị Nga", ngheNghiepMe: "Nội trợ", sdtMe: "0956123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS28", matKhau: "123456" },
  { id: "HS29", hoTen: "Hoàng Đức Quang", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001262", ngayCapCCCD: "16/03/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Hoàng Văn Tuấn", ngheNghiepBa: "Thợ mộc", sdtBa: "0966123456", tenMe: "Đoàn Thị Gấm", ngheNghiepMe: "Buôn bán nhỏ", sdtMe: "0966123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS29", matKhau: "123456" },
  { id: "HS30", hoTen: "Lý Bảo Nam", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001263", ngayCapCCCD: "13/05/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Lý Văn Minh", ngheNghiepBa: "Làm nông", sdtBa: "0976123456", tenMe: "Cao Thị Mận", ngheNghiepMe: "Làm nông", sdtMe: "0976123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS30", matKhau: "123456" },
  { id: "HS31", hoTen: "Trần Thảo Ngân", to: "Tổ 3", chucVu: "Bí thư Chi đoàn", diemThiDua: 100, soCCCD: "052206001264", ngayCapCCCD: "10/02/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Trần Văn Bình", ngheNghiepBa: "Kỹ sư nông nghiệp", sdtBa: "0986123456", tenMe: "Lê Thị Bích", ngheNghiepMe: "Cán bộ y tế", sdtMe: "0986123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS31", matKhau: "123456" },
  { id: "HS32", hoTen: "Đặng Nhã Trân", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001265", ngayCapCCCD: "24/11/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Đặng Văn Lâm", ngheNghiepBa: "Kinh doanh gia đình", sdtBa: "0996123456", tenMe: "Nguyễn Thị Diễm", ngheNghiepMe: "Kinh doanh", sdtMe: "0996123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS32", matKhau: "123456" },
  { id: "HS33", hoTen: "Võ Minh Trí", to: "Tổ 3", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001266", ngayCapCCCD: "03/08/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Võ Văn Kiên", ngheNghiepBa: "Làm nông", sdtBa: "0917123456", tenMe: "Hoàng Thị Huệ", ngheNghiepMe: "Nội trợ", sdtMe: "0917123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS33", matKhau: "123456" },

  // TỔ 4
  { id: "HS34", hoTen: "Trần Nguyễn Gia Bảo", to: "Tổ 4", chucVu: "Tổ trưởng T4", diemThiDua: 100, soCCCD: "052206001267", ngayCapCCCD: "25/03/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Trần Văn Trí", ngheNghiepBa: "Công an viên", sdtBa: "0907123456", tenMe: "Nguyễn Thị Phương", ngheNghiepMe: "Giáo viên", sdtMe: "0907123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS34", matKhau: "123456" },
  { id: "HS35", hoTen: "Huỳnh Minh Nhựt", to: "Tổ 4", chucVu: "Cờ đỏ", diemThiDua: 100, soCCCD: "052206001268", ngayCapCCCD: "19/04/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: true, ngayVaoDoan: "26/03/2026", tenBa: "Huỳnh Văn Thanh", ngheNghiepBa: "Thợ may", sdtBa: "0917223456", tenMe: "Võ Thị Hằng", ngheNghiepMe: "Làm nông", sdtMe: "0917223457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS35", matKhau: "123456" },
  { id: "HS36", hoTen: "Dương Thành Danh", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001269", ngayCapCCCD: "11/06/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Dương Văn Quyền", ngheNghiepBa: "Kỹ thuật viễn thông", sdtBa: "0927123456", tenMe: "Phan Thị Oanh", ngheNghiepMe: "Nội trợ", sdtMe: "0927123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS36", matKhau: "123456" },
  { id: "HS37", hoTen: "Nguyễn Quốc Phong", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001270", ngayCapCCCD: "18/09/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Hùng", ngheNghiepBa: "Làm vườn", sdtBa: "0937123456", tenMe: "Đinh Thị Thắm", ngheNghiepMe: "Nội trợ", sdtMe: "0937123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS37", matKhau: "123456" },
  { id: "HS38", hoTen: "Bùi Thị Bảo Trâm", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001271", ngayCapCCCD: "09/01/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Bùi Văn Hậu", ngheNghiepBa: "Lái xe", sdtBa: "0947123456", tenMe: "Lê Thị Hồng", ngheNghiepMe: "Làm nông", sdtMe: "0947123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS38", matKhau: "123456" },
  { id: "HS39", hoTen: "Lê Thảo Quyên", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001272", ngayCapCCCD: "15/07/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Lê Văn Tự", ngheNghiepBa: "Làm nông", sdtBa: "0957123456", tenMe: "Trần Thị Kim", ngheNghiepMe: "Làm nông", sdtMe: "0957123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS39", matKhau: "123456" },
  { id: "HS40", hoTen: "Đặng Bảo Sương", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001273", ngayCapCCCD: "21/08/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Đặng Văn Quý", ngheNghiepBa: "Cơ khí", sdtBa: "0967123456", tenMe: "Hồ Thị Nhung", ngheNghiepMe: "Nội trợ", sdtMe: "0967123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS40", matKhau: "123456" },
  { id: "HS41", hoTen: "Ngô Trí Dũng", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001274", ngayCapCCCD: "14/02/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Ngô Văn Thuận", ngheNghiepBa: "Thợ nề", sdtBa: "0977223456", tenMe: "Nguyễn Thị Lụa", ngheNghiepMe: "Làm nông", sdtMe: "0977223457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS41", matKhau: "123456" },
  { id: "HS42", hoTen: "Phan Tấn Sang", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001275", ngayCapCCCD: "02/10/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Phan Văn Trung", ngheNghiepBa: "Làm nông", sdtBa: "0987123456", tenMe: "Lâm Thị Cẩm", ngheNghiepMe: "Làm nông", sdtMe: "0987123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS42", matKhau: "123456" },
  { id: "HS43", hoTen: "Vũ Thanh Khiêm", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001276", ngayCapCCCD: "27/05/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Vũ Văn Lộc", ngheNghiepBa: "Tài xế", sdtBa: "0997123456", tenMe: "Bùi Thị Mai", ngheNghiepMe: "Nội trợ", sdtMe: "0997123457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS43", matKhau: "123456" },
  { id: "HS44", hoTen: "Trần Minh Quân", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001277", ngayCapCCCD: "19/12/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Trần Văn Huy", ngheNghiepBa: "Làm nông", sdtBa: "0908223456", tenMe: "Võ Thị Bích", ngheNghiepMe: "Làm nông", sdtMe: "0908223457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS44", matKhau: "123456" },
  { id: "HS45", hoTen: "Nguyễn Xuân Đông", to: "Tổ 4", chucVu: "Thành viên", diemThiDua: 100, soCCCD: "052206001278", ngayCapCCCD: "08/11/2023", noiCapCCCD: "Cục Cảnh sát QLHC về TTXH", laDoanVien: false, ngayVaoDoan: "", tenBa: "Nguyễn Văn Chiến", ngheNghiepBa: "Kinh doanh tự do", sdtBa: "0918223456", tenMe: "Dương Thị Thuỷ", ngheNghiepMe: "Kế toán", sdtMe: "0918223457", diaChi: "Tây Sơn, Gia Lai", taiKhoan: "HS45", matKhau: "123456" }
];

const DEFAULT_PERIODS_LOG = [
  { period: "Tiết 1", subject: "Toán hình học", teacher: "Thầy Trần Dương Quốc Mẫn", topic: "Vectơ trong không gian & Hệ trục Oxyz", rating: "A", note: "Lớp học tập nghiêm túc, chuẩn bị bài tốt." },
  { period: "Tiết 2", subject: "Ngữ Văn", teacher: "Cô Nguyễn Thị Mai", topic: "Chiến thắng Mtao Mxây (Sử thi Đăm Săn)", rating: "A", note: "Phát biểu xây dựng bài sôi nổi." },
  { period: "Tiết 3", subject: "Tiếng Anh", teacher: "Cô Lê Thị Phương", topic: "Unit 3: Music - Listening & Reading", rating: "B", note: "Một vài bạn còn quên mang từ điển." },
  { period: "Tiết 4", subject: "Hóa học", teacher: "Thầy Lê Văn Hoàng", topic: "Cấu tạo bảng tuần hoàn các nguyên tố", rating: "A", note: "Thực hành thí nghiệm đảm bảo an toàn." },
  { period: "Tiết 5", subject: "Lịch sử", teacher: "Cô Phạm Thị Thu", topic: "Khái niệm và các hình thức văn minh nhân loại", rating: "A", note: "Trật tự, ghi chép bài đầy đủ." }
];

const DEFAULT_SEATING_LAYOUT = [
  [
    { name: "Lê Quốc Hưng", role: "" }, { name: "Nguyễn Hữu Phong", role: "" },
    { name: "Đỗ Quyết Tâm", role: "Phó HT" }, { name: "Trương Đức Tài", role: "TT T3" },
    { name: "Vũ Đồng Tiến", role: "" }, { name: "Phạm Khởi Nghĩa", role: "" },
    { name: "Hoàng Đức Quang", role: "" }, { name: "Lý Bảo Nam", role: "" }
  ],
  [
    { name: "Ngô Văn Vỹ", role: "" }, { name: "Đỗ Huy Vũ", role: "" },
    { name: "Nguyễn Bảo Khôi", role: "" }, { name: "Trương Hà Quý", role: "" },
    { name: "Bùi Trần Khánh Nhi", role: "" }, { name: "Trần Anh Thư", role: "" },
    { name: "Lê Thị Trúc Phượng", role: "" }, { name: "Phan Ngọc Thuỳ", role: "TT T2" }
  ],
  [
    { name: "Nguyễn My Su", role: "Thủ quỹ" }, { name: "Đặng Nhã Trân", role: "" },
    { name: "Trần Thảo Ngân", role: "Bí thư" }, { name: "Võ Thị Kim Nhung", role: "" },
    { name: "Đinh Văn Khoa", role: "" }, { name: "Nguyễn Thái Hoàng", role: "Phó LĐ" },
    { name: "Huỳnh Minh Đức", role: "" }, { name: "Nguyễn Văn Nhuận", role: "" }
  ],
  [
    { name: "Đặng Thị Hiền Trân", role: "Phó VTM" }, { name: "Bùi Huỳnh Như Ý", role: "Thi đua" },
    { name: "Nguyễn Thị Thanh Trà", role: "" }, { name: "Phan Thị Hà My", role: "" },
    { name: "Võ Hiền Đức", role: "TT T1" }, { name: "Lê Thành Huy", role: "Cờ đỏ" },
    { name: "Nguyễn Tấn An", role: "Lớp trưởng" }, { name: "Trần Hiếu Trung", role: "" }
  ],
  [
    { name: "Trần Nguyễn Gia Bảo", role: "TT T4" }, { name: "Huỳnh Minh Nhựt", role: "Cờ đỏ" },
    { name: "Dương Thành Danh", role: "" }, { name: "Nguyễn Quốc Phong", role: "" },
    { name: "Bùi Thị Bảo Trâm", role: "" }, { name: "Lê Thảo Quyên", role: "" },
    { name: "Võ Minh Trí", role: "" }, { name: "Đặng Bảo Sương", role: "" }
  ],
  [
    { name: "Ngô Trí Dũng", role: "" }, { name: "", role: "" },
    { name: "Phan Tấn Sang", role: "" }, { name: "Vũ Thanh Khiêm", role: "" },
    { name: "Trần Minh Quân", role: "" }, { name: "", role: "" },
    { name: "", role: "" }, { name: "Nguyễn Xuân Đông", role: "" }
  ]
];

// TRẠNG THÁI HỆ THỐNG & PHÂN QUYỀN RBAC
let appState = {
  currentUser: JSON.parse(localStorage.getItem("10A12_SESSION_USER")) || null,
  roleLevel: "GUEST", // GVCN | LEADER | TREASURER | LABOR | STUDENT
  allowStudentLeaderEdit: localStorage.getItem("10A12_ALLOW_EDIT") !== "false",
  
  currentSessionKey: "T4_SANG",
  currentSessionLabel: "Sáng Thứ 4",
  currentCampaignId: "KY1_100K",
  currentFundTeamFilter: "ALL",
  
  students: JSON.parse(localStorage.getItem("10A12_STUDENTS_V9")) || DEFAULT_STUDENTS_10A12,
  violations: JSON.parse(localStorage.getItem("10A12_VIOLATIONS_V9")) || [],
  campaigns: JSON.parse(localStorage.getItem("10A12_CAMPAIGNS_V9")) || [
    { id: "KY1_100K", title: "Quỹ Lớp Học Kỳ 1 (100k)", target: 100000, status: "Đang thu" }
  ],
  fundPayments: JSON.parse(localStorage.getItem("10A12_PAYMENTS_V9")) || [],
  cashbook: JSON.parse(localStorage.getItem("10A12_CASHBOOK_V9")) || [
    { code: "CHI_01", time: "15/10/2026", type: "CHI", category: "Vệ sinh & Cơ sở vật chất", amount: 150000, author: "Thủ quỹ lớp", note: "Mua 2 chổi quét lớp và nước lau sàn" }
  ],
  periodLogs: JSON.parse(localStorage.getItem("10A12_PERIODS_V9")) || DEFAULT_PERIODS_LOG,
  fundSummary: { totalIncome: 0, totalExpense: 150000, balance: -150000 },
  selectedLeaveSupplementRow: null
};

let currentSeatingLayout = JSON.parse(localStorage.getItem("classroom_10A12_glass_v9")) || DEFAULT_SEATING_LAYOUT;
let isTeacherPerspective = false;
let selectedSeatFirst = null;

const SCHEDULE_CONFIG = [
  { key: 'T2_SANG', day: 1, isMorning: true, dayName: 'Thứ 2', session: 'Sáng', time: '06:45 - 11:20', team: 'Tổ 1' },
  { key: 'T2_CHIEU', day: 1, isMorning: false, dayName: 'Thứ 2', session: 'Chiều', time: '13:45 - 16:40', team: 'Tổ 2' },
  { key: 'T3_SANG', day: 2, isMorning: true, dayName: 'Thứ 3', session: 'Sáng', time: '06:45 - 11:20', team: 'Tổ 3' },
  { key: 'T3_CHIEU', day: 2, isMorning: false, dayName: 'Thứ 3', session: 'Chiều', time: '13:45 - 16:40', team: 'Tổ 4' },
  { key: 'T4_SANG', day: 3, isMorning: true, dayName: 'Thứ 4', session: 'Sáng', time: '06:45 - 11:20', team: 'Tổ 1' },
  { key: 'T5_SANG', day: 4, isMorning: true, dayName: 'Thứ 5', session: 'Sáng', time: '06:45 - 11:20', team: 'Tổ 2' },
  { key: 'T6_SANG', day: 5, isMorning: true, dayName: 'Thứ 6', session: 'Sáng', time: '06:45 - 11:20', team: 'Tổ 3 & 4' }
];

const DETAILED_PERIODS = [
  { name: "Sinh hoạt 15 phút", start: 6 * 60 + 45, end: 7 * 60 + 0 },
  { name: "Tiết 1 (Sáng)", start: 7 * 60 + 0, end: 7 * 60 + 45 },
  { name: "Tiết 2 (Sáng)", start: 7 * 60 + 50, end: 8 * 60 + 35 },
  { name: "Ra chơi sáng (15p)", start: 8 * 60 + 35, end: 8 * 60 + 50 },
  { name: "Tiết 3 (Sáng)", start: 8 * 60 + 55, end: 9 * 60 + 40 },
  { name: "Tiết 4 (Sáng)", start: 9 * 60 + 45, end: 10 * 60 + 30 },
  { name: "Tiết 5 (Sáng)", start: 10 * 60 + 35, end: 11 * 60 + 20 },
  { name: "Vào lớp chiều (15p)", start: 13 * 60 + 45, end: 14 * 60 + 0 },
  { name: "Tiết 1 (Chiều)", start: 14 * 60 + 0, end: 14 * 60 + 45 },
  { name: "Tiết 2 (Chiều)", start: 14 * 60 + 50, end: 15 * 60 + 35 },
  { name: "Ra chơi chiều (15p)", start: 15 * 60 + 35, end: 15 * 60 + 50 },
  { name: "Tiết 3 (Chiều)", start: 15 * 60 + 55, end: 16 * 60 + 40 }
];

function saveStateToLocal() {
  localStorage.setItem("10A12_STUDENTS_V9", JSON.stringify(appState.students));
  localStorage.setItem("10A12_VIOLATIONS_V9", JSON.stringify(appState.violations));
  localStorage.setItem("10A12_CAMPAIGNS_V9", JSON.stringify(appState.campaigns));
  localStorage.setItem("10A12_PAYMENTS_V9", JSON.stringify(appState.fundPayments));
  localStorage.setItem("10A12_CASHBOOK_V9", JSON.stringify(appState.cashbook));
  localStorage.setItem("10A12_PERIODS_V9", JSON.stringify(appState.periodLogs));
  localStorage.setItem("classroom_10A12_glass_v9", JSON.stringify(currentSeatingLayout));
  localStorage.setItem("10A12_ALLOW_EDIT", String(appState.allowStudentLeaderEdit));
}

// 1. ĐĂNG NHẬP PHÂN QUYỀN RBAC
function initAuthSession() {
  const authScreen = document.getElementById("authScreen");
  if (!appState.currentUser) {
    if (authScreen) authScreen.classList.remove("hidden");
  } else {
    if (authScreen) authScreen.classList.add("hidden");
    applyRolePermissions();
  }
}

function setQuickLogin(username) {
  const uInput = document.getElementById("authUsernameInput");
  const pInput = document.getElementById("authPasswordInput");
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = "123456";
}

function handleUserLogin(e) {
  e.preventDefault();
  const username = document.getElementById("authUsernameInput").value.trim();
  const password = document.getElementById("authPasswordInput").value.trim();
  const errorBox = document.getElementById("loginErrorMsg");

  errorBox.classList.add("hidden");

  // 1. Tài khoản GVCN
  if (username.toLowerCase() === "gvcn" && password === "123456") {
    appState.currentUser = {
      username: "gvcn",
      fullName: "Thầy Trần Dương Quốc Mẫn",
      role: "GVCN",
      roleLevel: "GVCN"
    };
    finishLogin();
    return;
  }

  // 2. Tài khoản Học sinh & Cán sự lớp
  const matchedStudent = appState.students.find(s => 
    (s.taiKhoan && s.taiKhoan.toUpperCase() === username.toUpperCase()) || 
    (s.id.toUpperCase() === username.toUpperCase())
  );

  if (matchedStudent) {
    const studentPass = matchedStudent.matKhau || "123456";
    if (password === studentPass) {
      let roleLevel = "STUDENT";
      const chucVu = (matchedStudent.chucVu || "").toLowerCase();

      if (chucVu.includes("lớp trưởng") || chucVu.includes("lớp phó học tập") || chucVu.includes("bí thư")) {
        roleLevel = "LEADER";
      } else if (chucVu.includes("thủ quỹ")) {
        roleLevel = "TREASURER";
      } else if (chucVu.includes("lao động")) {
        roleLevel = "LABOR";
      } else if (chucVu.includes("tổ trưởng") || chucVu.includes("cờ đỏ") || chucVu.includes("thi đua")) {
        roleLevel = "LEADER";
      }

      appState.currentUser = {
        username: matchedStudent.id,
        studentId: matchedStudent.id,
        fullName: matchedStudent.hoTen,
        role: matchedStudent.chucVu || "Học sinh",
        roleLevel: roleLevel,
        team: matchedStudent.to
      };

      finishLogin();
      return;
    }
  }

  errorBox.innerText = "Tài khoản hoặc mật khẩu không chính xác!";
  errorBox.classList.remove("hidden");
}

function finishLogin() {
  localStorage.setItem("10A12_SESSION_USER", JSON.stringify(appState.currentUser));
  document.getElementById("authScreen").classList.add("hidden");
  applyRolePermissions();
  renderAllSections();
  alert(`Đăng nhập thành công! Chào mừng ${appState.currentUser.fullName} (${appState.currentUser.role}).`);
}

function handleUserLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
    appState.currentUser = null;
    localStorage.removeItem("10A12_SESSION_USER");
    location.reload();
  }
}

function applyRolePermissions() {
  if (!appState.currentUser) return;

  const role = appState.currentUser.roleLevel;
  appState.roleLevel = role;

  const nameEl = document.getElementById("currentUserNameText");
  const roleEl = document.getElementById("currentUserRoleBadge");
  if (nameEl) nameEl.innerText = appState.currentUser.fullName;
  if (roleEl) roleEl.innerText = appState.currentUser.role;

  const btnMasterSwitch = document.getElementById("btnMasterSwitch");
  const btnImportExcel = document.getElementById("btnImportExcel");
  const btnAddNewStudent = document.getElementById("btnAddNewStudent");
  const btnSaveSeating = document.getElementById("btnSaveSeating");
  const btnOpenNewCampaign = document.getElementById("btnOpenNewCampaign");
  const btnOpenExpenseModal = document.getElementById("btnOpenExpenseModal");
  const btnSaveFundState = document.getElementById("btnSaveFundState");
  const btnTabCaNhan = document.getElementById("btn-tab-ca-nhan");

  if (role === "GVCN") {
    if (btnMasterSwitch) btnMasterSwitch.classList.remove("hidden");
    if (btnImportExcel) btnImportExcel.classList.remove("hidden");
    if (btnAddNewStudent) btnAddNewStudent.classList.remove("hidden");
    if (btnSaveSeating) btnSaveSeating.classList.remove("hidden");
    if (btnOpenNewCampaign) btnOpenNewCampaign.classList.remove("hidden");
    if (btnOpenExpenseModal) btnOpenExpenseModal.classList.remove("hidden");
    if (btnSaveFundState) btnSaveFundState.classList.remove("hidden");
    if (btnTabCaNhan) btnTabCaNhan.classList.add("hidden");
  } else if (role === "STUDENT") {
    if (btnMasterSwitch) btnMasterSwitch.classList.add("hidden");
    if (btnImportExcel) btnImportExcel.classList.add("hidden");
    if (btnAddNewStudent) btnAddNewStudent.classList.add("hidden");
    if (btnSaveSeating) btnSaveSeating.classList.add("hidden");
    if (btnOpenNewCampaign) btnOpenNewCampaign.classList.add("hidden");
    if (btnOpenExpenseModal) btnOpenExpenseModal.classList.add("hidden");
    if (btnSaveFundState) btnSaveFundState.classList.add("hidden");
    if (btnTabCaNhan) btnTabCaNhan.classList.remove("hidden");
    
    switchTab('tab-ca-nhan');
    renderStudentPortal();
  } else {
    if (btnMasterSwitch) btnMasterSwitch.classList.add("hidden");
    if (btnImportExcel) btnImportExcel.classList.add("hidden");
    if (btnAddNewStudent) btnAddNewStudent.classList.add("hidden");
    if (btnTabCaNhan) btnTabCaNhan.classList.remove("hidden");

    if (role === "TREASURER") {
      if (btnOpenNewCampaign) btnOpenNewCampaign.classList.remove("hidden");
      if (btnOpenExpenseModal) btnOpenExpenseModal.classList.remove("hidden");
      if (btnSaveFundState) btnSaveFundState.classList.remove("hidden");
    } else {
      if (btnOpenNewCampaign) btnOpenNewCampaign.classList.add("hidden");
      if (btnOpenExpenseModal) btnOpenExpenseModal.classList.add("hidden");
      if (btnSaveFundState) btnSaveFundState.classList.add("hidden");
    }
  }
}

// 2. KHỞI CHẠY HỆ THỐNG
document.addEventListener("DOMContentLoaded", () => {
  initAuthSession();
  
  const searchInput = document.getElementById("searchStudentInput");
  if (searchInput) searchInput.value = "";

  recalculateFundSummary();
  renderAllSections();
  
  updateLiveDashboardEngine();
  setInterval(updateLiveDashboardEngine, 1000);

  syncWithCloud();
});

function renderAllSections() {
  renderOverviewDashboard();
  renderAttendanceSession();
  renderTeamLeaderboard();
  renderSeatingChart();
  renderLaborSection();
  renderPeriodCards();
  renderFundCampaigns();
  renderFundChecklist();
  renderStudentCards(appState.students);
  populateStudentSelects();
  if (appState.roleLevel === "STUDENT") renderStudentPortal();
}

async function callApi(action, data = {}, method = "POST") {
  try {
    if (method === "GET") {
      const query = new URLSearchParams({ action, ...data }).toString();
      const res = await fetch(`${GAS_API_URL}?${query}`);
      return await res.json();
    } else {
      const res = await fetch(GAS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ...data })
      });
      return await res.json();
    }
  } catch (err) {
    console.warn(`[Offline Mode] Không thể gọi API ${action}:`, err);
    return { status: "offline", message: "Đang chạy chế độ lưu trữ ngoại tuyến." };
  }
}

async function syncWithCloud() {
  const res = await callApi("getInitialData", {}, "GET");
  if (res && res.status === "success" && res.students && res.students.length > 0) {
    appState.students = res.students;
    if (res.violations) appState.violations = res.violations;
    if (res.campaigns) appState.campaigns = res.campaigns;
    if (res.fundPayments) appState.fundPayments = res.fundPayments;
    if (res.cashbook) appState.cashbook = res.cashbook;

    saveStateToLocal();
    renderAllSections();
  }
}

async function refreshData() {
  renderAllSections();
  await syncWithCloud();
  alert("Dữ liệu đã được nạp và làm mới thành công!");
}

// 3. GÓC HỌC SINH CÁ NHÂN HÓA
function renderStudentPortal() {
  if (!appState.currentUser || !appState.currentUser.studentId) return;

  const st = appState.students.find(s => s.id === appState.currentUser.studentId);
  if (!st) return;

  const nameEl = document.getElementById("studentPortalName");
  const subEl = document.getElementById("studentPortalSub");
  if (nameEl) nameEl.innerText = `${st.hoTen} (${st.id})`;
  if (subEl) subEl.innerText = `${st.to} • Chức vụ: ${st.chucVu || "Thành viên"} • CCCD: ${st.soCCCD || "Chưa nộp"}`;
  
  const scoreEl = document.getElementById("studentPortalScore");
  if (scoreEl) {
    scoreEl.innerText = `${st.diemThiDua || 100}đ`;
    scoreEl.className = `text-3xl font-black ${st.diemThiDua >= 90 ? 'text-emerald-400' : (st.diemThiDua >= 80 ? 'text-amber-400' : 'text-rose-400')}`;
  }

  let seatFound = "Chưa xếp chỗ";
  currentSeatingLayout.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell && cell.name && st.hoTen.includes(cell.name)) {
        seatFound = `Dãy ${Math.floor(c / 2) + 1} • Bàn ${6 - r} • Ghế ${c % 2 === 0 ? "Trái" : "Phải"}`;
      }
    });
  });
  const seatEl = document.getElementById("studentPortalSeat");
  if (seatEl) seatEl.innerText = seatFound;

  const curCampaign = appState.campaigns.find(c => c.id === appState.currentCampaignId);
  const curTarget = curCampaign ? curCampaign.target : 100000;
  const pay = appState.fundPayments.find(p => p.campaignId === appState.currentCampaignId && p.studentId === st.id);
  const isPaid = pay ? pay.isPaid : false;

  const fundEl = document.getElementById("studentPortalFund");
  if (fundEl) {
    if (isPaid) {
      fundEl.innerHTML = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check mr-1"></i>Đã đóng đủ (${curTarget.toLocaleString()}đ)</span>`;
    } else {
      fundEl.innerHTML = `<span class="text-rose-400 font-bold"><i class="fa-solid fa-clock mr-1"></i>Chưa nộp (${curTarget.toLocaleString()}đ)</span>`;
    }
  }

  const personalVio = appState.violations.filter(v => v.studentId === st.id);
  const vioContainer = document.getElementById("studentPortalViolations");
  if (vioContainer) {
    if (personalVio.length === 0) {
      vioContainer.innerHTML = `<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 font-semibold"><i class="fa-solid fa-circle-check mr-1.5"></i>Bạn thực hiện nề nếp rất xuất sắc, không có vi phạm trong tuần!</div>`;
    } else {
      vioContainer.innerHTML = personalVio.map(v => `
        <div class="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div>
            <span class="font-bold text-white">${v.criteria}</span>
            <span class="text-[10px] text-slate-400 ml-1">(${v.time})</span>
          </div>
          <span class="font-black ${v.points < 0 ? 'text-rose-400' : 'text-emerald-400'}">${v.points > 0 ? '+' : ''}${v.points}đ</span>
        </div>
      `).join("");
    }
  }
}

// 4. TIẾN ĐỘ TIẾT HỌC THỜI GIAN THỰC
function updateLiveDashboardEngine() {
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const clockEl = document.getElementById("digitalClockText");
  if (clockEl) clockEl.innerText = now.toLocaleTimeString('vi-VN');

  const isMorning = currentMinutes <= 720;
  const match = SCHEDULE_CONFIG.find(s => s.day === day && s.isMorning === isMorning);

  const bannerSub = document.getElementById("liveBannerSub");
  const bannerTitle = document.getElementById("liveBannerTitle");
  const dutyTeam = document.getElementById("liveDutyTeam");

  if (match) {
    if (bannerSub) bannerSub.innerText = `${match.dayName.toUpperCase()} • ${match.session.toUpperCase()}`;
    if (bannerTitle) bannerTitle.innerText = `${match.session} ${match.dayName} • Giờ học: ${match.time}`;
    if (dutyTeam) dutyTeam.innerText = match.team.toUpperCase();
  } else {
    if (bannerSub) bannerSub.innerText = "NGOÀI GIỜ LÊN LỚP";
    if (bannerTitle) bannerTitle.innerText = "Hiện tại không có ca học chính khóa";
    if (dutyTeam) dutyTeam.innerText = "Nghỉ";
  }

  const curPeriod = DETAILED_PERIODS.find(p => currentMinutes >= p.start && currentMinutes < p.end);
  const progressBar = document.getElementById("periodProgressBar");
  const progressLabel = document.getElementById("currentPeriodLabel");
  const progressRemaining = document.getElementById("periodTimeRemaining");

  if (curPeriod) {
    const total = curPeriod.end - curPeriod.start;
    const elapsed = currentMinutes - curPeriod.start;
    const percent = Math.min(100, Math.round((elapsed / total) * 100));
    const remainMins = curPeriod.end - currentMinutes;

    if (progressLabel) progressLabel.innerText = `Đang học: ${curPeriod.name}`;
    if (progressRemaining) progressRemaining.innerText = `Còn ${remainMins}p (${percent}%)`;
    if (progressBar) progressBar.style.width = `${percent}%`;
  } else {
    if (progressLabel) progressLabel.innerText = "Đang ngoài giờ tiết học";
    if (progressRemaining) progressRemaining.innerText = "0%";
    if (progressBar) progressBar.style.width = "0%";
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.add("hidden"));
  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("nav-active");
    btn.classList.add("text-slate-400");
  });

  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add("nav-active");
    activeBtn.classList.remove("text-slate-400");
  }

  if (tabId === 'tab-so-do-lop') renderSeatingChart();
}

function toggleMasterEditSwitch() {
  if (appState.roleLevel !== "GVCN") {
    alert("Chỉ GVCN mới có quyền bật/tắt công tắc nề nếp của Ban cán sự!");
    return;
  }
  appState.allowStudentLeaderEdit = !appState.allowStudentLeaderEdit;
  saveStateToLocal();
  const btn = document.getElementById("btnMasterSwitch");
  if (btn) {
    btn.innerHTML = appState.allowStudentLeaderEdit
      ? `<i class="fa-solid fa-toggle-on text-emerald-400 text-sm"></i><span class="hidden lg:inline">Cán sự: Mở ghi</span>`
      : `<i class="fa-solid fa-toggle-off text-rose-400 text-sm"></i><span class="hidden lg:inline">Cán sự: Khóa ghi</span>`;
  }
  callApi("saveConfig", { allowStudentLeaderEdit: appState.allowStudentLeaderEdit ? "TRUE" : "FALSE" });
}

function copyParentLookupPortalLink() {
  const currentUrl = window.location.href;
  const lookupUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/tracuu.html";
  const msg = `Kính gửi Quý Phụ huynh học sinh lớp 10A12 (K58-QT),
` +
              `Để theo dõi nề nếp, chuyên cần và tình trạng quỹ lớp của học sinh, kính mời Quý Phụ huynh truy cập Cổng tra cứu điện tử:
` +
              `${lookupUrl}
` +
              `👉 Cách tra cứu: Nhập Mã học sinh (VD: HS01) hoặc Số CCCD 12 số của học sinh.
` +
              `GVCN: Thầy Trần Dương Quốc Mẫn. Trân trọng!`;

  navigator.clipboard.writeText(msg).then(() => {
    alert("Đã sao chép link Cổng Tra Cứu kèm tin nhắn mẫu gửi nhóm Zalo!");
  }).catch(() => {
    prompt("Sao chép link gửi Zalo Phụ huynh:", lookupUrl);
  });
}

// 5. NỀ NẾP & ĐIỂM DANH
function renderOverviewDashboard() {
  const avg = appState.students.length > 0
    ? (appState.students.reduce((acc, s) => acc + (Number(s.diemThiDua) || 0), 0) / appState.students.length).toFixed(1)
    : "100.0";
  const avgEl = document.getElementById("dashAvgScore");
  if (avgEl) avgEl.innerText = `${avg}đ`;

  const fundEl = document.getElementById("dashFundBalance");
  if (fundEl) fundEl.innerText = `${(appState.fundSummary.balance || 0).toLocaleString()} đ`;

  const tbody = document.getElementById("violationTableBody");
  if (!tbody) return;

  if (appState.violations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-emerald-400 font-bold italic"><i class="fa-solid fa-circle-check mr-1.5"></i>Lớp chấp hành nề nếp rất tốt, không có lỗi vi phạm trong tuần!</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.violations.map((v, idx) => {
    const isAbsence = v.criteria && v.criteria.includes("[Chuyên cần]");
    const isPenalty = v.points < 0;
    const canDelete = appState.roleLevel === "GVCN";

    return `
      <tr class="hover:bg-white/5 transition">
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">${v.time}</td>
        <td class="py-2.5 px-3 font-black text-white">${v.studentName}</td>
        <td class="py-2.5 px-3"><span class="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-400/20 text-[10px] font-bold">${getStudentTeam(v.studentId)}</span></td>
        <td class="py-2.5 px-3 text-slate-300">${v.criteria} ${v.note ? `<span class="text-slate-500 italic">(${v.note})</span>` : ""}</td>
        <td class="py-2.5 px-3 text-center font-black ${isPenalty ? "text-rose-400" : (v.points > 0 ? "text-emerald-400" : "text-sky-300")}">${v.points > 0 ? "+" : ""}${v.points}đ</td>
        <td class="py-2.5 px-3 text-slate-400 text-[11px]">${v.sender || "Cán sự"}</td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          ${isAbsence && v.points < 0 && appState.roleLevel === "GVCN" ? `
            <button onclick="openLeaveSupplementModal('${v.rowId || idx}', '${v.studentId}', '${v.studentName}')" class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold text-[10px] mr-1">
              Duyệt phép
            </button>
          ` : ""}
          ${canDelete ? `
            <button onclick="deleteViolationRecord('${v.rowId || idx}', '${v.studentId}', ${v.points}, ${idx})" class="text-rose-400 hover:underline text-[11px] font-bold">Xóa</button>
          ` : `<span class="text-slate-600 text-[10px]">-</span>`}
        </td>
      </tr>
    `;
  }).join("");
}

function getStudentTeam(stId) {
  const st = appState.students.find(s => s.id === stId);
  return st ? st.to : "Tổ 1";
}

function exportWeeklyShlReport() {
  const dateStr = new Date().toLocaleDateString("vi-VN");
  let msg = `📋 [BIÊN BẢN SINH HOẠT LỚP 10A12 - NGÀY ${dateStr}]
` +
            `GVCN: Thầy Trần Dương Quốc Mẫn • Sĩ số: 45/45

` +
            `1. ĐIỂM THI ĐUA 4 TỔ:
`;

  const teams = ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"];
  teams.forEach(t => {
    const list = appState.students.filter(s => s.to === t);
    const avg = list.length > 0 ? (list.reduce((acc, s) => acc + (Number(s.diemThiDua) || 0), 0) / list.length).toFixed(1) : 100;
    msg += ` • ${t}: ${avg} điểm
`;
  });

  msg += `
2. CÁC HỌC SINH CẦN KHẮC PHỤC NỀ NẾP TUẦN TỚI:
`;
  const penalized = appState.students.filter(s => Number(s.diemThiDua) < 100);
  if (penalized.length === 0) {
    msg += ` (Không có - Cả lớp thực hiện xuất sắc)
`;
  } else {
    penalized.forEach((s, idx) => {
      msg += ` ${idx + 1}. ${s.hoTen} (${s.to}): ${s.diemThiDua}đ
`;
    });
  }

  msg += `
Đề nghị các bạn hoàn thành lịch trực nhật bù theo phân công.`;
  navigator.clipboard.writeText(msg).then(() => {
    alert("Đã sao chép nội dung Biên bản SHL để gửi Zalo lớp!");
  });
}

function selectAttendanceSession(sessionKey, sessionName) {
  appState.currentSessionKey = sessionKey;
  appState.currentSessionLabel = sessionName;

  const lbl = document.getElementById("currentSessionLabel");
  if (lbl) lbl.innerText = sessionName;

  document.querySelectorAll(".att-btn").forEach(btn => {
    if (btn.innerText.includes(sessionName)) {
      btn.className = "att-btn px-2.5 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold text-left shadow-lg shadow-sky-500/25";
    } else {
      btn.className = "att-btn px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-left border border-white/10 text-slate-300";
    }
  });

  const laborSess = document.getElementById("laborCurrentSession");
  if (laborSess) laborSess.innerText = sessionName;

  renderAttendanceSession();
}

function renderAttendanceSession() {
  const container = document.getElementById("attendanceStudentList");
  if (!container) return;

  const canEdit = (appState.roleLevel === "GVCN") || (appState.roleLevel === "LEADER" && appState.allowStudentLeaderEdit);

  container.innerHTML = appState.students.map(st => `
    <div class="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center">${st.id.replace("HS", "")}</span>
        <div>
          <span class="font-bold text-white text-xs">${st.hoTen}</span>
          <span class="text-[10px] text-slate-400 ml-1">(${st.to})</span>
        </div>
      </div>
      <div class="flex items-center gap-1 ${canEdit ? '' : 'opacity-40 pointer-events-none'}">
        <button onclick="markAttendance('${st.id}', '${st.hoTen}', 'CO_MAT')" class="px-2 py-1 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">Có mặt</button>
        <button onclick="markAttendance('${st.id}', '${st.hoTen}', 'DI_TRE')" class="px-2 py-1 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">Trễ (-10)</button>
        <button onclick="markAttendance('${st.id}', '${st.hoTen}', 'VANG_PHEP')" class="px-2 py-1 rounded text-[11px] font-bold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30">Phép (0)</button>
        <button onclick="markAttendance('${st.id}', '${st.hoTen}', 'KHONG_PHEP')" class="px-2 py-1 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">K.Phép (-20)</button>
      </div>
    </div>
  `).join("");
}

async function markAttendance(studentId, studentName, status) {
  if (appState.roleLevel !== "GVCN" && !appState.allowStudentLeaderEdit) {
    alert("GVCN đang tạm khóa quyền cập nhật nề nếp của Ban cán sự!");
    return;
  }

  let delta = 0;
  let label = "Có mặt";
  if (status === "DI_TRE") { delta = -10; label = "Đi học trễ"; }
  else if (status === "VANG_PHEP") { delta = 0; label = "Nghỉ học (Có phép)"; }
  else if (status === "KHONG_PHEP") { delta = -20; label = "Vắng học (Không phép)"; }

  const st = appState.students.find(s => s.id === studentId);
  if (st && delta !== 0) {
    st.diemThiDua = Math.max(0, (Number(st.diemThiDua) || 100) + delta);
  }

  const dateStr = new Date().toLocaleDateString("vi-VN");
  if (status !== "CO_MAT") {
    appState.violations.unshift({
      time: `${appState.currentSessionLabel} (${dateStr})`,
      studentId,
      studentName,
      criteria: `[Chuyên cần] ${label}`,
      points: delta,
      note: "Ghi nhận chuyên cần buổi học",
      sender: appState.currentUser ? appState.currentUser.fullName : "Cán sự"
    });
  }

  saveStateToLocal();
  renderOverviewDashboard();
  renderTeamLeaderboard();
  renderLaborSection();

  callApi("saveAttendance", {
    sessionKey: appState.currentSessionKey,
    sessionName: appState.currentSessionLabel,
    date: dateStr,
    studentId,
    studentName,
    status,
    sender: appState.currentUser ? appState.currentUser.fullName : "Cán sự"
  });
}

function renderTeamLeaderboard() {
  const container = document.getElementById("teamLeaderboard");
  if (!container) return;

  const teams = [
    { name: "Tổ 1", leader: "Võ Hiền Đức" },
    { name: "Tổ 2", leader: "Phan Ngọc Thuỳ" },
    { name: "Tổ 3", leader: "Trương Đức Tài" },
    { name: "Tổ 4", leader: "Trần Nguyễn Gia Bảo" }
  ];

  const calculated = teams.map(t => {
    const list = appState.students.filter(s => s.to === t.name);
    const avg = list.length > 0 ? (list.reduce((acc, s) => acc + (Number(s.diemThiDua) || 0), 0) / list.length).toFixed(1) : 100;
    return { ...t, score: Number(avg) };
  }).sort((a, b) => b.score - a.score);

  container.innerHTML = calculated.map((t, idx) => `
    <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? "bg-amber-500 text-black font-extrabold" : "bg-white/10 text-slate-300"}">${idx + 1}</span>
        <div>
          <p class="text-xs font-bold text-white">${t.name} <span class="text-[10px] text-slate-400 font-normal">(${t.leader})</span></p>
          <span class="text-[10px] text-slate-400">${idx === 0 ? "Dẫn đầu thi đua" : "Hạng " + (idx + 1)}</span>
        </div>
      </div>
      <span class="text-sm font-black ${t.score >= 90 ? "text-emerald-400" : (t.score >= 80 ? "text-amber-400" : "text-rose-400")}">${t.score}đ</span>
    </div>
  `).join("");
}

// 6. SƠ ĐỒ CHỖ NGỒI (CHẠM 2 GHẾ ĐỔI CHỖ TRÊN MOBILE)
function togglePerspective() {
  isTeacherPerspective = !isTeacherPerspective;
  const badge = document.getElementById("perspectiveLabelBadge");
  const podium = document.getElementById("podiumArea");

  if (isTeacherPerspective) {
    if (badge) badge.innerText = "Góc nhìn: Giáo viên";
    if (podium) podium.className = "w-full max-w-2xl flex items-center justify-center gap-4 py-2 mb-4 bg-sky-500/10 border border-sky-400/20 rounded-xl text-xs font-black text-sky-300 order-first";
  } else {
    if (badge) badge.innerText = "Góc nhìn: Học sinh";
    if (podium) podium.className = "w-full max-w-2xl flex items-center justify-center gap-4 py-2 mt-4 bg-sky-500/10 border border-sky-400/20 rounded-xl text-xs font-black text-sky-300 order-last";
  }
  renderSeatingChart();
}

function renderSeatingChart() {
  const container = document.getElementById("seatingGridRows");
  if (!container) return;
  container.innerHTML = "";

  const rowIndices = isTeacherPerspective ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];

  rowIndices.forEach(rIndex => {
    const rowData = currentSeatingLayout[rIndex];
    const rowNumber = 6 - rIndex;

    const rowDiv = document.createElement("div");
    rowDiv.className = "grid grid-cols-12 gap-1.5 sm:gap-4 items-center";

    const leftDeskGroup = document.createElement("div");
    leftDeskGroup.className = "col-span-5 grid grid-cols-2 gap-1.5 sm:gap-2";
    leftDeskGroup.appendChild(createDeskElement(rowData[0], rowData[1], rIndex, 0, 1));
    leftDeskGroup.appendChild(createDeskElement(rowData[2], rowData[3], rIndex, 2, 3));
    rowDiv.appendChild(leftDeskGroup);

    const aisleDiv = document.createElement("div");
    aisleDiv.className = "col-span-2 text-center text-[10px] font-black uppercase text-slate-500 flex items-center justify-center";
    aisleDiv.innerHTML = `<span class="px-2 py-0.5 rounded-md glass-card text-sky-300">H${rowNumber}</span>`;
    rowDiv.appendChild(aisleDiv);

    const rightDeskGroup = document.createElement("div");
    rightDeskGroup.className = "col-span-5 grid grid-cols-2 gap-1.5 sm:gap-2";
    rightDeskGroup.appendChild(createDeskElement(rowData[4], rowData[5], rIndex, 4, 5));
    rightDeskGroup.appendChild(createDeskElement(rowData[6], rowData[7], rIndex, 6, 7));
    rowDiv.appendChild(rightDeskGroup);

    container.appendChild(rowDiv);
  });
}

function createDeskElement(seat1, seat2, rIndex, c1, c2) {
  const desk = document.createElement("div");
  desk.className = "glass-card rounded-2xl grid grid-cols-2 divide-x divide-sky-400/20 overflow-hidden shadow-sm";
  desk.appendChild(createSeatCell(seat1, rIndex, c1));
  desk.appendChild(createSeatCell(seat2, rIndex, c2));
  return desk;
}

function createSeatCell(student, rIndex, cIndex) {
  const cell = document.createElement("div");
  const isEmpty = !student || !student.name;
  
  const isSelected = selectedSeatFirst && selectedSeatFirst.r === rIndex && selectedSeatFirst.c === cIndex;

  cell.className = `seat-cell p-1.5 sm:p-2 min-h-[50px] sm:min-h-[56px] flex flex-col justify-center items-center text-center cursor-pointer select-none ${isSelected ? 'selected-seat' : (isEmpty ? 'bg-white/[0.01]' : 'bg-white/[0.03]')}`;

  if (!isEmpty) {
    cell.innerHTML = `
      <div class="flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
        <span class="text-[11px] sm:text-xs font-black text-white leading-tight">${student.name}</span>
      </div>
      ${student.role ? `<span class="text-[8.5px] font-bold text-sky-300 mt-0.5 leading-none">(${student.role})</span>` : ''}
    `;
  } else {
    cell.innerHTML = `<span class="text-[9px] text-slate-600 font-bold">+ Trống</span>`;
  }

  cell.addEventListener("click", () => {
    if (appState.roleLevel !== "GVCN" && appState.roleLevel !== "LEADER") {
      return;
    }

    if (!selectedSeatFirst) {
      selectedSeatFirst = { r: rIndex, c: cIndex, student };
      renderSeatingChart();
    } else {
      const firstR = selectedSeatFirst.r;
      const firstC = selectedSeatFirst.c;

      const temp = currentSeatingLayout[rIndex][cIndex];
      currentSeatingLayout[rIndex][cIndex] = currentSeatingLayout[firstR][firstC];
      currentSeatingLayout[firstR][firstC] = temp;

      selectedSeatFirst = null;
      saveStateToLocal();
      renderSeatingChart();
    }
  });

  return cell;
}

async function syncSeatingToSheets() {
  if (appState.roleLevel !== "GVCN") {
    alert("Chỉ GVCN mới có quyền lưu sơ đồ chỗ ngồi lên Google Sheets!");
    return;
  }
  const flatLayout = [];
  currentSeatingLayout.forEach((row, r) => {
    row.forEach((seat, c) => {
      if (seat && seat.name) {
        flatLayout.push({
          day: Math.floor(c / 2) + 1,
          ban: 6 - r,
          viTri: (c % 2 === 0) ? "Trái" : "Phải",
          id: "",
          hoTen: seat.name,
          ghiChu: seat.role || ""
        });
      }
    });
  });

  saveStateToLocal();
  const res = await callApi("saveSeatingChart", { layout: flatLayout });
  alert(res.status === "success" ? "Đã đồng bộ sơ đồ chỗ ngồi lên Google Sheets!" : "Đã lưu sơ đồ vào bộ nhớ máy!");
}

// 7. LAO ĐỘNG & SỔ ĐẦU BÀI
function renderLaborSection() {
  const container = document.getElementById("laborPunishmentList");
  if (!container) return;

  const penalizedMap = {};
  appState.violations.forEach(v => {
    if (v.points < 0) {
      if (!penalizedMap[v.studentId]) {
        penalizedMap[v.studentId] = { id: v.studentId, name: v.studentName, points: 0, count: 0 };
      }
      penalizedMap[v.studentId].points += Math.abs(v.points);
      penalizedMap[v.studentId].count += 1;
    }
  });

  const penalizedList = Object.values(penalizedMap);
  if (penalizedList.length === 0) {
    container.innerHTML = `<p class="text-xs text-emerald-400 font-bold italic py-2"><i class="fa-solid fa-circle-check mr-1.5"></i>Không có học sinh nào bị phạt lao động tuần này.</p>`;
    return;
  }

  const canAction = (appState.roleLevel === "GVCN") || (appState.roleLevel === "LABOR") || (appState.roleLevel === "LEADER");

  container.innerHTML = penalizedList.map(st => {
    const level = st.points >= 20 ? "Mức 2: Quét sân & đổ rác" : "Mức 1: Lau bảng & giặt khăn";
    return `
      <div class="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
        <div>
          <p class="font-black text-white">${st.name} <span class="text-rose-400 font-bold">(-${st.points}đ)</span></p>
          <p class="text-[10px] text-slate-400">${level}</p>
        </div>
        ${canAction ? `
          <button onclick="markLaborDone('${st.id}')" class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold hover:bg-emerald-500/30">
            Đã hoàn thành
          </button>
        ` : `<span class="text-slate-500 text-[10px]">Đang theo dõi</span>`}
      </div>
    `;
  }).join("");
}

function markLaborDone(studentId) {
  alert(`Đã nghiệm thu hoàn thành ca trực phạt cho học sinh ${studentId}!`);
}

async function gradeLaborSession(status) {
  const team = document.getElementById("laborCurrentTeam").innerText;
  alert(status === "DAT" ? `Đã nghiệm thu: Trực nhật ${team} Đạt!` : `Đã ghi nhận: ${team} Chưa Đạt (-20đ Tổ)!`);
  
  if (status === "CHUA_DAT") {
    appState.students.filter(s => s.to === team).forEach(s => {
      s.diemThiDua = Math.max(0, s.diemThiDua - 5);
    });
    saveStateToLocal();
    renderOverviewDashboard();
    renderTeamLeaderboard();
  }

  callApi("saveLaborInspection", {
    sessionKey: appState.currentSessionLabel,
    team: team,
    status: status,
    inspector: appState.currentUser ? appState.currentUser.fullName : "Cán sự Lao động"
  });
}

function openDeskSanitationModal() {
  document.getElementById("deskSanitationModal").classList.remove("hidden");
}
function closeDeskSanitationModal() {
  document.getElementById("deskSanitationModal").classList.add("hidden");
}

async function submitDeskSanitation() {
  const desk = document.getElementById("deskSanitationSelect").value;
  const type = document.getElementById("deskSanitationType").value;
  const pts = type.includes("-20đ") ? -20 : -10;

  alert(`Đã ghi nhận lỗi vệ sinh tại [${desk}]: ${type}`);
  closeDeskSanitationModal();

  callApi("recordDeskSanitationViolation", {
    deskPosition: desk,
    errorType: type,
    points: pts,
    sender: appState.currentUser ? appState.currentUser.fullName : "Cán sự Lao động"
  });
}

function renderPeriodCards() {
  const grid = document.getElementById("periodCardGrid");
  if (!grid) return;

  grid.innerHTML = appState.periodLogs.map(p => `
    <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-black text-sky-300 uppercase">${p.period}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded ${p.rating === 'A' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}">Loại ${p.rating}</span>
      </div>
      <p class="text-xs font-bold text-white truncate">${p.subject}</p>
      <p class="text-[11px] text-slate-300 truncate">GV: ${p.teacher}</p>
      <p class="text-[10px] text-slate-400 italic line-clamp-2">${p.topic || p.note}</p>
    </div>
  `).join("");
}

function openClassSessionLogModal() {
  document.getElementById("sessionLogModal").classList.remove("hidden");
}
function closeClassSessionLogModal() {
  document.getElementById("sessionLogModal").classList.add("hidden");
}

async function submitClassSessionLog() {
  const period = document.getElementById("logPeriodSelect").value;
  const subject = document.getElementById("logSubjectInput").value.trim();
  const teacher = document.getElementById("logTeacherInput").value.trim();
  const rating = document.getElementById("logRatingSelect").value;
  const topic = document.getElementById("logTopicInput").value.trim();
  const note = document.getElementById("logNoteInput").value.trim();

  if (!subject) {
    alert("Vui lòng nhập tên môn học!");
    return;
  }

  const existingIdx = appState.periodLogs.findIndex(p => p.period === period);
  const logItem = { period, subject, teacher, rating, topic, note };
  
  if (existingIdx >= 0) appState.periodLogs[existingIdx] = logItem;
  else appState.periodLogs.push(logItem);

  saveStateToLocal();
  renderPeriodCards();
  closeClassSessionLogModal();
  alert("Đã ghi sổ đầu bài tiết học thành công!");

  callApi("saveClassSessionLog", {
    date: new Date().toLocaleDateString("vi-VN"),
    session: appState.currentSessionLabel,
    period, subject, teacher, rating, topic, note,
    sender: appState.currentUser ? appState.currentUser.fullName : "Ban Cán sự"
  });
}

// 8. QUẢN LÝ QUỸ LỚP
function recalculateFundSummary() {
  let totalIncome = 0;
  
  appState.fundPayments.forEach(p => {
    if (p.isPaid) {
      const camp = appState.campaigns.find(c => c.id === p.campaignId);
      const campTarget = camp ? Number(camp.target) || 0 : 100000;
      totalIncome += (Number(p.amountPaid) || campTarget);
    }
  });
  
  let totalExpense = 0;
  appState.cashbook.forEach(tx => {
    if (tx.type === "CHI") totalExpense += Number(tx.amount) || 0;
    else totalIncome += Number(tx.amount) || 0;
  });

  appState.fundSummary = {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
}

function renderFundCampaigns() {
  const select = document.getElementById("campaignSelect");
  if (!select) return;

  select.innerHTML = appState.campaigns.map(c => `
    <option value="${c.id}">${c.title} (${(c.target || 0).toLocaleString()}đ)</option>
  `).join("");
  appState.currentCampaignId = select.value || "KY1_100K";
}

function switchFundCampaign(campaignId) {
  appState.currentCampaignId = campaignId;
  renderFundChecklist();
}

function renderFundChecklist() {
  recalculateFundSummary();

  const incomeEl = document.getElementById("fundIncomeDisplay");
  const expenseEl = document.getElementById("fundExpenseDisplay");
  const balanceEl = document.getElementById("fundBalanceDisplay");
  const countEl = document.getElementById("fundPaidRatio");

  if (incomeEl) incomeEl.innerText = `${appState.fundSummary.totalIncome.toLocaleString()} đ`;
  if (expenseEl) expenseEl.innerText = `${appState.fundSummary.totalExpense.toLocaleString()} đ`;
  if (balanceEl) balanceEl.innerText = `${appState.fundSummary.balance.toLocaleString()} đ`;

  const paymentsForCampaign = appState.fundPayments.filter(p => p.campaignId === appState.currentCampaignId);
  const paidCount = paymentsForCampaign.filter(p => p.isPaid).length;
  if (countEl) countEl.innerText = `Đã thu: ${paidCount}/45 HS`;

  const grid = document.getElementById("fundStudentGrid");
  if (!grid) return;

  const canEditFund = (appState.roleLevel === "GVCN") || (appState.roleLevel === "TREASURER");

  const filtered = (appState.currentFundTeamFilter === "ALL")
    ? appState.students
    : appState.students.filter(s => s.to === appState.currentFundTeamFilter);

  grid.innerHTML = filtered.map(st => {
    const pay = paymentsForCampaign.find(p => p.studentId === st.id);
    const isPaid = pay ? pay.isPaid : false;

    return `
      <div class="p-2.5 rounded-xl bg-white/5 border ${isPaid ? "border-emerald-400/40 bg-emerald-500/10" : "border-white/5"} flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input 
            type="checkbox" 
            ${isPaid ? "checked" : ""} 
            ${canEditFund ? "" : "disabled cursor-not-allowed opacity-50"}
            onchange="toggleFundLocal('${st.id}', this.checked)" 
            class="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
          >
          <div>
            <p class="text-xs font-bold text-white leading-tight">${st.hoTen}</p>
            <span class="text-[10px] text-slate-400 font-mono">${st.id} • ${st.to}</span>
          </div>
        </div>
        <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${isPaid ? "text-emerald-300 bg-emerald-500/20" : "text-rose-400 bg-rose-500/20"}">
          ${isPaid ? "Đã nộp" : "Chưa nộp"}
        </span>
      </div>
    `;
  }).join("");
}

function toggleFundLocal(studentId, isChecked) {
  const camp = appState.campaigns.find(c => c.id === appState.currentCampaignId);
  const target = camp ? Number(camp.target) || 0 : 100000;

  let pay = appState.fundPayments.find(p => p.campaignId === appState.currentCampaignId && p.studentId === studentId);
  if (pay) {
    pay.isPaid = isChecked;
    pay.amountPaid = isChecked ? target : 0;
  } else {
    appState.fundPayments.push({
      campaignId: appState.currentCampaignId,
      studentId: studentId,
      isPaid: isChecked,
      amountPaid: isChecked ? target : 0
    });
  }
  saveStateToLocal();
  renderFundChecklist();
}

function filterFundTeam(team) {
  appState.currentFundTeamFilter = team;
  const buttons = document.querySelectorAll("#fundTeamFilters button");
  buttons.forEach(b => {
    if (b.innerText === (team === "ALL" ? "Tất cả" : team.replace("Tổ ", "T"))) {
      b.className = "px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white";
    } else {
      b.className = "px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300";
    }
  });
  renderFundChecklist();
}

async function saveCurrentFundState() {
  saveStateToLocal();
  const camp = appState.campaigns.find(c => c.id === appState.currentCampaignId);
  const target = camp ? Number(camp.target) || 0 : 100000;

  const currentPayments = appState.students.map(st => {
    const pay = appState.fundPayments.find(p => p.campaignId === appState.currentCampaignId && p.studentId === st.id);
    return {
      studentId: st.id,
      studentName: st.hoTen,
      isPaid: pay ? pay.isPaid : false,
      amountPaid: pay && pay.isPaid ? target : 0
    };
  });

  const res = await callApi("saveFundPaymentBatch", {
    campaignId: appState.currentCampaignId,
    payments: currentPayments
  });
  alert(res.status === "success" ? "Đã đồng bộ quỹ lớp lên Google Sheets!" : "Đã lưu trạng thái quỹ vào bộ nhớ!");
}

function openNewCampaignModal() {
  document.getElementById("newCampaignModal").classList.remove("hidden");
}
function closeNewCampaignModal() {
  document.getElementById("newCampaignModal").classList.add("hidden");
}

async function submitNewCampaign() {
  const title = document.getElementById("campaignTitleInput").value.trim();
  const target = Number(document.getElementById("campaignTargetInput").value) || 0;

  if (!title) {
    alert("Vui lòng nhập tên đợt thu!");
    return;
  }

  const newId = `KY_${Date.now()}`;
  appState.campaigns.push({ id: newId, title, target, status: "Đang thu" });
  appState.currentCampaignId = newId;

  saveStateToLocal();
  renderFundCampaigns();
  renderFundChecklist();
  closeNewCampaignModal();
  alert("Đã khởi tạo đợt thu quỹ mới thành công!");

  callApi("createFundCampaign", { title, target });
}

function openAddExpenseModal() {
  document.getElementById("addExpenseModal").classList.remove("hidden");
}
function closeAddExpenseModal() {
  document.getElementById("addExpenseModal").classList.add("hidden");
}

async function submitAddExpense() {
  const category = document.getElementById("expenseCategorySelect").value;
  const amount = Number(document.getElementById("expenseAmountInput").value) || 0;
  const note = document.getElementById("expenseNoteInput").value.trim();

  if (amount <= 0) {
    alert("Số tiền chi phải lớn hơn 0 đ!");
    return;
  }
  if (!note) {
    alert("Vui lòng nhập nội dung chi tiết!");
    return;
  }

  appState.cashbook.unshift({
    code: `CHI_${Date.now()}`,
    time: new Date().toLocaleDateString("vi-VN"),
    type: "CHI",
    category,
    amount,
    author: appState.currentUser ? appState.currentUser.fullName : "Thủ quỹ lớp",
    note
  });

  saveStateToLocal();
  renderFundChecklist();
  closeAddExpenseModal();
  alert("Đã lập phiếu xuất quỹ thành công!");

  callApi("saveFundExpense", {
    category, amount, note, author: appState.currentUser ? appState.currentUser.fullName : "Thủ quỹ lớp"
  });
}

// 9. QUẢN LÝ DANH SÁCH 45 HỌC SINH
function renderStudentCards(list) {
  const grid = document.getElementById("studentCardsGrid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<p class="col-span-full py-8 text-center text-xs text-slate-500 italic">Không tìm thấy học sinh phù hợp.</p>`;
    return;
  }

  grid.innerHTML = list.map(st => {
    const score = Number(st.diemThiDua) || 100;
    const scoreColor = score >= 90 
      ? "text-emerald-300 bg-emerald-500/20 border-emerald-400/30" 
      : (score >= 80 ? "text-amber-300 bg-amber-500/20 border-amber-400/30" : "text-rose-300 bg-rose-500/20 border-rose-400/30");

    return `
      <div class="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between gap-3 hover:border-white/20 transition shadow-sm">
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
              ${st.hoTen.split(" ").pop().charAt(0)}
            </div>
            <div class="min-w-0">
              <h3 class="text-xs sm:text-sm font-black text-white truncate">${st.hoTen}</h3>
              <p class="text-[10px] text-slate-400 font-mono mt-0.5">
                <span>${st.id}</span> • <span>${st.to}</span>
                ${st.chucVu && st.chucVu !== 'Thành viên' ? `• <span class="text-sky-300 font-bold">${st.chucVu}</span>` : ''}
              </p>
            </div>
          </div>
          <span class="text-xs font-black px-2 py-0.5 rounded-lg border ${scoreColor} shrink-0">
            ${score}đ
          </span>
        </div>

        <button onclick="openStudentDetailModal('${st.id}')" class="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-[11px] font-bold transition flex items-center justify-center gap-1.5 active:scale-98">
          <i class="fa-solid fa-address-card text-sky-400"></i>
          <span>Xem lý lịch chi tiết</span>
        </button>
      </div>
    `;
  }).join("");
}

function handleSearchStudent(query) {
  const q = query.toLowerCase().trim();
  const filtered = appState.students.filter(s =>
    s.hoTen.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    (s.soCCCD && s.soCCCD.includes(q)) ||
    s.to.toLowerCase().includes(q)
  );
  renderStudentCards(filtered);
}

function exportStudentProfilesExcel() {
  let csv = "Mã HS,Họ và Tên,Tổ,Chức Vụ,Số CCCD,Ngày Cấp,Nơi Cấp,Đoàn Viên,Ngày Vào Đoàn,Địa Chỉ,Họ Tên Ba,Nghề Nghiệp Ba,SĐT Ba,Họ Tên Mẹ,Nghề Nghiệp Mẹ,SĐT Mẹ,Tài Khoản,Mật Khẩu,Điểm Thi Đua\n";
  appState.students.forEach(s => {
    csv += `"${s.id}","${s.hoTen}","${s.to}","${s.chucVu}","${s.soCCCD || ''}","${s.ngayCapCCCD || ''}","${s.noiCapCCCD || ''}","${s.laDoanVien ? 'Đoàn viên' : 'Thanh niên'}","${s.ngayVaoDoan || ''}","${s.diaChi || ''}","${s.tenBa || ''}","${s.ngheNghiepBa || ''}","${s.sdtBa || ''}","${s.tenMe || ''}","${s.ngheNghiepMe || ''}","${s.sdtMe || ''}","${s.taiKhoan || s.id}","${s.matKhau || '123456'}",${s.diemThiDua}\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Danh_Sach_10A12_K58_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// 10. MODAL CHI TIẾT HỒ SƠ
let editingStudentId = null;

function openStudentDetailModal(studentId) {
  const st = appState.students.find(s => s.id === studentId);
  if (!st) return;

  editingStudentId = studentId;
  const isGVCN = appState.roleLevel === "GVCN";

  const form = document.getElementById("modalStudentForm");
  const title = document.getElementById("modalStudentTitle");
  if (title) title.innerText = `Hồ Sơ Toàn Diện: ${st.hoTen} (${st.id})`;

  const btnSave = document.getElementById("btnSaveStudentChanges");
  if (btnSave) {
    if (isGVCN) btnSave.classList.remove("hidden");
    else btnSave.classList.add("hidden");
  }

  if (form) {
    form.innerHTML = `
      <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
        <h4 class="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
          <i class="fa-solid fa-user-graduate"></i> Thông tin học sinh & Định danh
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Mã học sinh:</label>
            <input type="text" value="${st.id}" disabled class="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-mono text-xs cursor-not-allowed">
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Tổ sinh hoạt:</label>
            <select id="editStudentTeam" ${isGVCN ? "" : "disabled"} class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
              <option value="Tổ 1" ${st.to === "Tổ 1" ? "selected" : ""}>Tổ 1</option>
              <option value="Tổ 2" ${st.to === "Tổ 2" ? "selected" : ""}>Tổ 2</option>
              <option value="Tổ 3" ${st.to === "Tổ 3" ? "selected" : ""}>Tổ 3</option>
              <option value="Tổ 4" ${st.to === "Tổ 4" ? "selected" : ""}>Tổ 4</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Chức vụ trong lớp:</label>
            <input type="text" id="editStudentRole" ${isGVCN ? "" : "disabled"} value="${st.chucVu || "Thành viên"}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Số CCCD (12 số):</label>
            <input type="text" id="editStudentCCCD" ${isGVCN ? "" : "disabled"} value="${st.soCCCD || ""}" maxlength="12" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono">
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Ngày cấp CCCD:</label>
            <input type="text" id="editStudentNgayCapCCCD" ${isGVCN ? "" : "disabled"} value="${st.ngayCapCCCD || ""}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono">
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Nơi cấp CCCD:</label>
            <input type="text" id="editStudentNoiCapCCCD" ${isGVCN ? "" : "disabled"} value="${st.noiCapCCCD || "Cục Cảnh sát QLHC về TTXH"}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
          </div>
        </div>
      </div>

      <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
        <h4 class="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <i class="fa-solid fa-people-roof"></i> Quan hệ gia đình & Liên hệ
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Họ tên Ba:</label>
            <input type="text" id="editStudentFather" ${isGVCN ? "" : "disabled"} value="${st.tenBa || ""}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold">
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Nghề nghiệp Ba:</label>
            <input type="text" id="editStudentJobFather" ${isGVCN ? "" : "disabled"} value="${st.ngheNghiepBa || ""}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
          </div>
          <div>
            <label class="text-[10px] text-slate-400 block mb-1">Số điện thoại Ba:</label>
            <input type="tel" id="editStudentFatherPhone" ${isGVCN ? "" : "disabled"} value="${st.sdtBa || ""}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono">
          </div>
        </div>
      </div>

      ${isGVCN ? `
        <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/20 space-y-2.5">
          <h4 class="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <i class="fa-solid fa-key"></i> Tài khoản học sinh
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">Tài khoản đăng nhập:</label>
              <input type="text" id="editStudentAccountUser" value="${st.taiKhoan || st.id}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold">
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">Mật khẩu:</label>
              <input type="text" id="editStudentAccountPass" value="${st.matKhau || "123456"}" class="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold">
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
  document.getElementById("studentDetailModal").classList.remove("hidden");
}

function closeStudentModal() {
  document.getElementById("studentDetailModal").classList.add("hidden");
  editingStudentId = null;
}

async function saveStudentProfileChanges() {
  if (!editingStudentId || appState.roleLevel !== "GVCN") return;

  const st = appState.students.find(s => s.id === editingStudentId);
  if (st) {
    st.to = document.getElementById("editStudentTeam").value;
    st.chucVu = document.getElementById("editStudentRole").value.trim();
    st.soCCCD = document.getElementById("editStudentCCCD").value.trim();
    st.ngayCapCCCD = document.getElementById("editStudentNgayCapCCCD").value.trim();
    st.noiCapCCCD = document.getElementById("editStudentNoiCapCCCD").value.trim();
    
    st.tenBa = document.getElementById("editStudentFather").value.trim();
    st.ngheNghiepBa = document.getElementById("editStudentJobFather").value.trim();
    st.sdtBa = document.getElementById("editStudentFatherPhone").value.trim();

    const accUser = document.getElementById("editStudentAccountUser");
    const accPass = document.getElementById("editStudentAccountPass");
    if (accUser) st.taiKhoan = accUser.value.trim();
    if (accPass) st.matKhau = accPass.value.trim();
  }

  saveStateToLocal();
  renderStudentCards(appState.students);
  closeStudentModal();
  alert("Đã cập nhật toàn bộ lý lịch học sinh thành công!");

  callApi("updateStudentProfile", { ...st });
}

// XÓA VI PHẠM
async function deleteViolationRecord(rowId, studentId, points, arrayIndex) {
  if (appState.roleLevel !== "GVCN") {
    alert("Chỉ GVCN mới có quyền xóa bản ghi nề nếp!");
    return;
  }
  if (!confirm("Thầy có chắc chắn muốn xóa bản ghi nề nếp này và hoàn lại điểm?")) return;

  const st = appState.students.find(s => s.id === studentId);
  if (st && points < 0) {
    st.diemThiDua = Math.min(100, (Number(st.diemThiDua) || 100) + Math.abs(points));
  }

  appState.violations.splice(arrayIndex, 1);

  saveStateToLocal();
  renderOverviewDashboard();
  renderTeamLeaderboard();
  renderLaborSection();

  callApi("deleteViolation", { rowId, studentId, points });
}

function openAddNewStudentModal() {
  document.getElementById("addStudentModal").classList.remove("hidden");
}
function closeAddNewStudentModal() {
  document.getElementById("addStudentModal").classList.add("hidden");
}

async function submitAddNewStudent() {
  const hoTen = document.getElementById("newStudentName").value.trim();
  const to = document.getElementById("newStudentTeam").value;
  const chucVu = document.getElementById("newStudentRole").value.trim();
  const soCCCD = document.getElementById("newStudentCCCD").value.trim();
  const hoTenBa = document.getElementById("newStudentFather").value.trim();
  const sdtBa = document.getElementById("newStudentFatherPhone").value.trim();

  if (!hoTen) {
    alert("Vui lòng nhập họ tên học sinh!");
    return;
  }

  const nextIdx = appState.students.length + 1;
  const nextId = "HS" + (nextIdx < 10 ? "0" + nextIdx : nextIdx);

  appState.students.push({
    id: nextId, hoTen, to, chucVu: chucVu || "Thành viên",
    soCCCD, tenBa: hoTenBa, sdtBa, diemThiDua: 100, laDoanVien: false,
    taiKhoan: nextId, matKhau: "123456"
  });

  saveStateToLocal();
  renderStudentCards(appState.students);
  populateStudentSelects();
  closeAddNewStudentModal();
  alert(`Đã tiếp nhận học sinh ${hoTen} (${nextId}) vào lớp!`);

  callApi("addNewStudent", { hoTen, to, chucVu, soCCCD, hoTenBa, sdtBa });
}

function openLeaveSupplementModal(rowId, studentId, studentName) {
  appState.selectedLeaveSupplementRow = { rowId, studentId };
  const info = document.getElementById("supplementStudentInfo");
  if (info) info.innerText = `Học sinh: ${studentName} (${studentId})`;
  document.getElementById("leaveSupplementModal").classList.remove("hidden");
}
function closeLeaveSupplementModal() {
  document.getElementById("leaveSupplementModal").classList.add("hidden");
  appState.selectedLeaveSupplementRow = null;
}

async function submitLeaveSupplement() {
  if (!appState.selectedLeaveSupplementRow) return;
  const reason = document.getElementById("supplementReasonInput").value.trim();

  const st = appState.students.find(s => s.id === appState.selectedLeaveSupplementRow.studentId);
  if (st) {
    st.diemThiDua = Math.min(100, (Number(st.diemThiDua) || 100) + 20);
  }

  saveStateToLocal();
  renderOverviewDashboard();
  renderTeamLeaderboard();
  closeLeaveSupplementModal();
  alert("Đã duyệt bổ sung giấy phép và hoàn điểm rèn luyện!");

  callApi("approveLeaveSupplement", {
    rowId: appState.selectedLeaveSupplementRow.rowId,
    studentId: appState.selectedLeaveSupplementRow.studentId,
    note: reason
  });
}

function openRecordViolationModal() {
  document.getElementById("recordViolationModal").classList.remove("hidden");
}
function closeRecordViolationModal() {
  document.getElementById("recordViolationModal").classList.add("hidden");
}

function populateStudentSelects() {
  const sel = document.getElementById("violationStudentSelect");
  if (!sel) return;

  sel.innerHTML = appState.students.map(s => `
    <option value="${s.id}|${s.hoTen}">${s.id} - ${s.hoTen} (${s.to})</option>
  `).join("");
}

async function submitRecordViolation() {
  const studentVal = document.getElementById("violationStudentSelect").value.split("|");
  const studentId = studentVal[0];
  const studentName = studentVal[1];

  const criteriaVal = document.getElementById("violationCriteriaSelect").value.split("|");
  const criteriaCode = criteriaVal[0];
  const points = Number(criteriaVal[1]) || 0;
  const note = document.getElementById("violationNoteInput").value.trim();

  const st = appState.students.find(s => s.id === studentId);
  if (st) {
    st.diemThiDua = Math.max(0, (Number(st.diemThiDua) || 100) + points);
  }

  const dateStr = new Date().toLocaleDateString("vi-VN");
  appState.violations.unshift({
    time: `${appState.currentSessionLabel} (${dateStr})`,
    studentId,
    studentName,
    criteria: `${criteriaCode}: ${document.getElementById("violationCriteriaSelect").selectedOptions[0].text}`,
    points,
    note,
    sender: appState.currentUser ? appState.currentUser.fullName : "Ban Cán sự"
  });

  saveStateToLocal();
  renderOverviewDashboard();
  renderTeamLeaderboard();
  renderLaborSection();
  closeRecordViolationModal();
  alert("Đã ghi nhận nề nếp thành công!");

  callApi("recordViolation", {
    displayTime: `${appState.currentSessionLabel} (${dateStr})`,
    studentId,
    studentName,
    criteria: `${criteriaCode}: ${document.getElementById("violationCriteriaSelect").selectedOptions[0].text}`,
    points,
    note,
    sender: appState.currentUser ? appState.currentUser.fullName : "Ban Cán sự"
  });
}

// 11. NHẬP EXCEL VNEDU / SMAS
function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  event.target.value = "";

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (!rows || rows.length === 0) {
        alert("File Excel được chọn không chứa dữ liệu!");
        return;
      }

      let headerRowIndex = -1;
      for (let r = 0; r < Math.min(rows.length, 12); r++) {
        const rowStr = rows[r].map(c => String(c || "").toLowerCase()).join(" ");
        if (rowStr.includes("họ") || rowStr.includes("tên") || rowStr.includes("hoten") || rowStr.includes("stt")) {
          headerRowIndex = r;
          break;
        }
      }

      if (headerRowIndex === -1) {
        alert("Không nhận diện được hàng tiêu đề trong file Excel!");
        return;
      }

      const headers = rows[headerRowIndex].map(c => String(c || "").trim().toLowerCase());
      const findCol = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));

      const colHoTen = findCol(["họ và tên", "họ tên", "hoten"]);
      const colHoDem = findCol(["họ đệm", "họ lót", "họ"]);
      const colTen = findCol(["tên"]);
      const colId = findCol(["mã hs", "mã học sinh", "mã định danh", "id"]);
      const colTo = findCol(["tổ", "nhóm"]);
      const colChucVu = findCol(["chức vụ", "nhiệm vụ"]);
      const colNgaySinh = findCol(["ngày sinh", "ngaysinh", "ns"]);
      const colCCCD = findCol(["cccd", "cmnd", "định danh"]);
      const colNgayCapCCCD = findCol(["ngày cấp"]);
      const colNoiCapCCCD = findCol(["nơi cấp"]);
      const colDoan = findCol(["đoàn viên", "đoàn"]);
      const colNgayVaoDoan = findCol(["ngày vào đoàn"]);
      const colDiaChi = findCol(["địa chỉ", "thường trú"]);
      const colTenBa = findCol(["họ tên ba", "họ tên cha", "họ tên bố", "tên ba"]);
      const colJobBa = findCol(["nghề nghiệp ba", "nghề ba"]);
      const colSdtBa = findCol(["sđt ba", "sđt cha", "đt ba"]);
      const colTenMe = findCol(["họ tên mẹ", "tên mẹ"]);
      const colJobMe = findCol(["nghề nghiệp mẹ", "nghề mẹ"]);
      const colSdtMe = findCol(["sđt mẹ", "đt mẹ"]);

      const parsedStudents = [];
      let studentIndex = 1;

      for (let r = headerRowIndex + 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length === 0) continue;

        let fullName = "";
        if (colHoTen !== -1 && row[colHoTen]) {
          fullName = String(row[colHoTen]).trim();
        } else if (colHoDem !== -1 && colTen !== -1 && (row[colHoDem] || row[colTen])) {
          fullName = `${row[colHoDem] || ""} ${row[colTen] || ""}`.trim();
        }

        if (!fullName || fullName.toLowerCase().includes("tổng số") || fullName.toLowerCase().includes("người lập")) continue;

        const idStr = (colId !== -1 && row[colId])
          ? String(row[colId]).trim()
          : ("HS" + (studentIndex < 10 ? "0" + studentIndex : studentIndex));

        const teamStr = (colTo !== -1 && row[colTo])
          ? (String(row[colTo]).includes("Tổ") ? String(row[colTo]).trim() : `Tổ ${String(row[colTo]).replace(/\D/g, '') || 1}`)
          : `Tổ ${Math.floor((studentIndex - 1) / 11) + 1}`;

        parsedStudents.push({
          id: idStr,
          hoTen: fullName,
          to: teamStr,
          chucVu: (colChucVu !== -1 && row[colChucVu]) ? String(row[colChucVu]).trim() : "Thành viên",
          diemThiDua: 100,
          ngaySinh: (colNgaySinh !== -1 && row[colNgaySinh]) ? String(row[colNgaySinh]).trim() : "",
          soCCCD: (colCCCD !== -1 && row[colCCCD]) ? String(row[colCCCD]).replace(/\D/g, '').trim() : "",
          ngayCapCCCD: (colNgayCapCCCD !== -1 && row[colNgayCapCCCD]) ? String(row[colNgayCapCCCD]).trim() : "",
          noiCapCCCD: (colNoiCapCCCD !== -1 && row[colNoiCapCCCD]) ? String(row[colNoiCapCCCD]).trim() : "Cục Cảnh sát QLHC về TTXH",
          laDoanVien: (colDoan !== -1 && row[colDoan]) ? String(row[colDoan]).toLowerCase().includes("đoàn") : false,
          ngayVaoDoan: (colNgayVaoDoan !== -1 && row[colNgayVaoDoan]) ? String(row[colNgayVaoDoan]).trim() : "",
          diaChi: (colDiaChi !== -1 && row[colDiaChi]) ? String(row[colDiaChi]).trim() : "Tây Sơn, Gia Lai",
          tenBa: (colTenBa !== -1 && row[colTenBa]) ? String(row[colTenBa]).trim() : "",
          ngheNghiepBa: (colJobBa !== -1 && row[colJobBa]) ? String(row[colJobBa]).trim() : "",
          sdtBa: (colSdtBa !== -1 && row[colSdtBa]) ? String(row[colSdtBa]).replace(/\D/g, '').trim() : "",
          tenMe: (colTenMe !== -1 && row[colTenMe]) ? String(row[colTenMe]).trim() : "",
          ngheNghiepMe: (colJobMe !== -1 && row[colJobMe]) ? String(row[colJobMe]).trim() : "",
          sdtMe: (colSdtMe !== -1 && row[colSdtMe]) ? String(row[colSdtMe]).replace(/\D/g, '').trim() : "",
          taiKhoan: idStr,
          matKhau: "123456"
        });

        studentIndex++;
      }

      if (parsedStudents.length === 0) {
        alert("Không tìm thấy dòng dữ liệu học sinh hợp lệ nào trong file!");
        return;
      }

      appState.students = parsedStudents;
      saveStateToLocal();
      renderAllSections();

      alert(`✅ Đã bóc tách thành công ${parsedStudents.length} học sinh! Đang đồng bộ lên Google Sheets...`);
      await callApi("saveAllStudentsBatch", { students: parsedStudents });
      alert("🎉 Đã lưu danh sách toàn bộ lớp lên Google Sheets thành công!");
    } catch (err) {
      console.error("[Excel Parse Error]", err);
      alert("Lỗi khi đọc file Excel: " + err.message);
    }
  };

  reader.readAsArrayBuffer(file);
}
