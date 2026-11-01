/**
 * ============================================================================
 * SỔ TAY CHỦ NHIỆM ĐIỆN TỬ 10A12 (K58-QT) - GOOGLE APPS SCRIPT BACKEND
 * Tác giả: GVCN ThS. Trần Dương Quốc Mẫn
 * Phiên bản: 5.0 (Bổ sung đầy đủ 100% API, Tra cứu thông minh, Tự tính quỹ, Nhập Excel)
 * ============================================================================
 */

const SHEET_NAMES = {
  DANH_SACH: "DanhSach",
  NHAT_KY: "NhatKy",
  DIEM_DANH: "DiemDanh",
  SO_DAU_BAI: "SoDauBai",
  CAC_KY_THU: "CacKyThu",
  THU_QUY_CHI_TIET: "ThuQuyChiTiet",
  SO_QUY: "SoQuy",
  SO_DO_LOP: "SoDoLop",
  CAU_HINH: "CauHinh"
};

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(25000);

  try {
    const params = (e && e.parameter) ? e.parameter : {};
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); } catch (err) { postData = {}; }
    }

    const action = params.action || postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Khởi tạo bảng tính chuẩn hóa tự động nếu chưa có
    ensureSystemSchema(ss);

    let result = { status: "error", message: "Action không hợp lệ: " + action };

    switch (action) {
      // 1. Đồng bộ & Tra cứu
      case "getInitialData":
        result = getInitialData(ss);
        break;
      case "lookupStudent":
        result = lookupStudent(ss, params.code || postData.code);
        break;

      // 2. Chuyên cần & Nề nếp thi đua
      case "saveAttendance":
        result = saveAttendance(ss, postData);
        break;
      case "recordViolation":
        result = recordViolation(ss, postData);
        break;
      case "deleteViolation":
        result = deleteViolation(ss, postData);
        break;
      case "approveLeaveSupplement":
        result = approveLeaveSupplement(ss, postData);
        break;

      // 3. Sơ đồ lớp & Sổ đầu bài
      case "saveSeatingChart":
        result = saveSeatingChart(ss, postData);
        break;
      case "rotateSeatingChart":
        result = rotateSeatingChart(ss);
        break;
      case "saveClassSessionLog":
        result = saveClassSessionLog(ss, postData);
        break;

      // 4. Lao động & Trực nhật
      case "saveLaborInspection":
        result = saveLaborInspection(ss, postData);
        break;
      case "updateLaborPunishmentStatus":
        result = updateLaborPunishmentStatus(ss, postData);
        break;
      case "recordDeskSanitationViolation":
        result = recordDeskSanitationViolation(ss, postData);
        break;

      // 5. Quản lý Quỹ lớp
      case "createFundCampaign":
        result = createFundCampaign(ss, postData);
        break;
      case "saveFundPaymentBatch":
        result = saveFundPaymentBatch(ss, postData);
        break;
      case "saveFundExpense":
        result = saveFundExpense(ss, postData);
        break;

      // 6. Quản trị Học sinh (Cá nhân & Hàng loạt từ Excel)
      case "addNewStudent":
        result = addNewStudent(ss, postData);
        break;
      case "updateStudentProfile":
        result = updateStudentProfile(ss, postData);
        break;
      case "deleteStudent":
        result = deleteStudent(ss, postData);
        break;
      case "saveAllStudentsBatch":
        result = saveAllStudentsBatch(ss, postData);
        break;

      // 7. Cấu hình hệ thống & Reset tuần
      case "saveConfig":
        result = saveConfig(ss, postData);
        break;
      case "resetWeeklyScores":
        result = resetWeeklyScores(ss);
        break;

      default:
        result = { status: "error", message: "Chưa định nghĩa handler cho action: " + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// I. KHỞI TẠO CẤU TRÚC SHEETS TỰ ĐỘNG
// ============================================================================
function ensureSystemSchema(ss) {
  const schemas = [
    { 
      name: SHEET_NAMES.DANH_SACH, 
      headers: [
        "id", "hoTen", "to", "chucVu", "ngaySinh", "soCCCD", "ngayCapCCCD", 
        "noiCapCCCD", "laDoanVien", "ngayVaoDoan", "diaChi", "tenBa", 
        "ngheNghiepBa", "sdtBa", "tenMe", "ngheNghiepMe", "sdtMe", 
        "taiKhoan", "matKhau", "diemThiDua"
      ] 
    },
    { 
      name: SHEET_NAMES.NHAT_KY, 
      headers: ["Thời Gian", "Mã HS", "Họ Tên", "Nội Dung", "Điểm", "Ghi Chú", "Người Ghi", "IncidentKey"] 
    },
    { 
      name: SHEET_NAMES.DIEM_DANH, 
      headers: ["Thời Gian", "Ca Học", "Mã HS", "Họ Tên", "Trạng Thái", "Lý Do", "Người Ghi", "IncidentKey"] 
    },
    { 
      name: SHEET_NAMES.CAC_KY_THU, 
      headers: ["Mã Đợt", "Tên Đợt Thu", "Định Mức", "Ngày Tạo", "Trạng Thái", "Ghi Chú"] 
    },
    { 
      name: SHEET_NAMES.THU_QUY_CHI_TIET, 
      headers: ["Mã Đợt", "Mã HS", "Họ Tên", "Số Tiền Nộp", "Đã Nộp", "Ngày Nộp", "Ghi Chú"] 
    },
    { 
      name: SHEET_NAMES.SO_QUY, 
      headers: ["Mã GD", "Thời Gian", "Loại", "Khoản Mục", "Số Tiền", "Người Thực Hiện", "Nội Dung"] 
    },
    { 
      name: SHEET_NAMES.SO_DAU_BAI, 
      headers: ["Ngày_Buổi", "Tiết", "Môn Học", "Giáo Viên", "Tên Bài Dạy", "Xếp Loại", "HS Tuyên Dương", "HS Vi Phạm", "Nhận Xét", "Người Ghi"] 
    },
    { 
      name: SHEET_NAMES.SO_DO_LOP, 
      headers: ["Dãy", "Bàn", "Vị Trí (Trái/Phải)", "Mã HS", "Họ Tên", "Ghi Chú"] 
    },
    { 
      name: SHEET_NAMES.CAU_HINH, 
      headers: ["Khóa", "Giá Trị", "Mô Tả"],
      initRows: [
        ["allowStudentLeaderEdit", "TRUE", "Công tắc cho phép Ban cán sự ghi nề nếp"],
        ["currentAcademicWeek", "Tuần 1", "Tuần học hiện tại"],
        ["showPointsToParents", "TRUE", "Hiển thị điểm thi đua lên cổng tra cứu"]
      ]
    }
  ];

  schemas.forEach(item => {
    let sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
      sheet.appendRow(item.headers);
      if (item.initRows) item.initRows.forEach(r => sheet.appendRow(r));
    }
  });
}

function getHeaderMap(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) return {};
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headers.forEach((h, idx) => { map[String(h).trim()] = idx; });
  return map;
}

// ============================================================================
// II. TRUY XUẤT DỮ LIỆU BAN ĐẦU & TỔNG HỢP QUỸ
// ============================================================================
function getInitialData(ss) {
  const sheetDS = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  if (!sheetDS) return { status: "error", message: "Chưa khởi tạo danh sách lớp." };

  const dataDS = sheetDS.getDataRange().getValues();
  const hMap = getHeaderMap(sheetDS);
  const students = [];
  
  for (let i = 1; i < dataDS.length; i++) {
    const row = dataDS[i];
    if (!row[hMap["id"]]) continue;
    students.push({
      id: String(row[hMap["id"]] || ""),
      hoTen: String(row[hMap["hoTen"]] || ""),
      to: String(row[hMap["to"]] || "Tổ 1"),
      chucVu: String(row[hMap["chucVu"]] || "Thành viên"),
      ngaySinh: row[hMap["ngaySinh"]] ? formatDateValue(row[hMap["ngaySinh"]]) : "",
      soCCCD: (hMap["soCCCD"] !== undefined && row[hMap["soCCCD"]]) ? String(row[hMap["soCCCD"]]) : "",
      ngayCapCCCD: (hMap["ngayCapCCCD"] !== undefined && row[hMap["ngayCapCCCD"]]) ? formatDateValue(row[hMap["ngayCapCCCD"]]) : "",
      noiCapCCCD: (hMap["noiCapCCCD"] !== undefined && row[hMap["noiCapCCCD"]]) ? String(row[hMap["noiCapCCCD"]]) : "",
      laDoanVien: (hMap["laDoanVien"] !== undefined) ? (row[hMap["laDoanVien"]] === true || String(row[hMap["laDoanVien"]]).toLowerCase().includes("đoàn")) : false,
      ngayVaoDoan: (hMap["ngayVaoDoan"] !== undefined && row[hMap["ngayVaoDoan"]]) ? formatDateValue(row[hMap["ngayVaoDoan"]]) : "",
      diaChi: String(row[hMap["diaChi"]] || ""),
      tenBa: String(row[hMap["tenBa"]] || row[hMap["hoTenBa"]] || ""),
      ngheNghiepBa: String(row[hMap["ngheNghiepBa"]] || ""),
      sdtBa: String(row[hMap["sdtBa"]] || ""),
      tenMe: String(row[hMap["tenMe"]] || row[hMap["hoTenMe"]] || ""),
      ngheNghiepMe: String(row[hMap["ngheNghiepMe"]] || ""),
      sdtMe: String(row[hMap["sdtMe"]] || ""),
      taiKhoan: String(row[hMap["taiKhoan"]] || row[hMap["id"]] || ""),
      matKhau: String(row[hMap["matKhau"]] || "123456"),
      diemThiDua: Number(row[hMap["diemThiDua"]]) || 100
    });
  }

  // Nhật ký nề nếp
  const dataNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY).getDataRange().getValues();
  const violations = [];
  for (let i = 1; i < dataNK.length; i++) {
    if (!dataNK[i][0]) continue;
    violations.push({
      rowId: i + 1, time: String(dataNK[i][0]), studentId: String(dataNK[i][1]),
      studentName: String(dataNK[i][2]), criteria: String(dataNK[i][3]),
      points: Number(dataNK[i][4]) || 0, note: String(dataNK[i][5] || ""),
      sender: String(dataNK[i][6] || ""), incidentKey: String(dataNK[i][7] || "")
    });
  }

  // Quỹ lớp
  const dataKT = ss.getSheetByName(SHEET_NAMES.CAC_KY_THU).getDataRange().getValues();
  const campaigns = [];
  for (let i = 1; i < dataKT.length; i++) {
    if (dataKT[i][0]) campaigns.push({ id: String(dataKT[i][0]), title: String(dataKT[i][1]), target: Number(dataKT[i][2]) || 0, status: String(dataKT[i][4]) });
  }

  const dataTQ = ss.getSheetByName(SHEET_NAMES.THU_QUY_CHI_TIET).getDataRange().getValues();
  const fundPayments = [];
  for (let i = 1; i < dataTQ.length; i++) {
    if (dataTQ[i][0]) fundPayments.push({ campaignId: String(dataTQ[i][0]), studentId: String(dataTQ[i][1]), amountPaid: Number(dataTQ[i][3]) || 0, isPaid: Boolean(dataTQ[i][4]), note: String(dataTQ[i][6] || "") });
  }

  const dataSQ = ss.getSheetByName(SHEET_NAMES.SO_QUY).getDataRange().getValues();
  const cashbook = [];
  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = 1; i < dataSQ.length; i++) {
    if (dataSQ[i][0]) {
      const type = String(dataSQ[i][2]).toUpperCase();
      const amt = Number(dataSQ[i][4]) || 0;
      if (type === "CHI") totalExpense += amt;
      else totalIncome += amt;

      cashbook.push({
        code: String(dataSQ[i][0]), time: formatDateValue(dataSQ[i][1]),
        type: type, category: String(dataSQ[i][3]), amount: amt,
        author: String(dataSQ[i][5]), note: String(dataSQ[i][6] || "")
      });
    }
  }

  // Cộng thêm nguồn thu trực tiếp từ các khoản học sinh đã đóng
  fundPayments.forEach(p => {
    if (p.isPaid && p.amountPaid) totalIncome += Number(p.amountPaid);
  });

  const fundSummary = {
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    balance: totalIncome - totalExpense
  };

  // Cấu hình
  const dataCH = ss.getSheetByName(SHEET_NAMES.CAU_HINH).getDataRange().getValues();
  const config = {};
  for (let i = 1; i < dataCH.length; i++) {
    if (dataCH[i][0]) config[dataCH[i][0]] = dataCH[i][1];
  }

  return { status: "success", students, violations, campaigns, fundPayments, cashbook, fundSummary, config };
}

// ============================================================================
// III. CỔNG TRA CỨU HỌC SINH & PHỤ HUYNH (TRACUU.HTML)
// ============================================================================
function lookupStudent(ss, code) {
  if (!code) return { status: "error", message: "Vui lòng cung cấp Mã học sinh hoặc CCCD." };
  
  const cleanCode = String(code).trim().toLowerCase();
  const sheetDS = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const dataDS = sheetDS.getDataRange().getValues();
  const hMap = getHeaderMap(sheetDS);

  let targetStudent = null;

  for (let i = 1; i < dataDS.length; i++) {
    const row = dataDS[i];
    const sId = String(row[hMap["id"]] || "").trim().toLowerCase();
    const sCCCD = String(row[hMap["soCCCD"]] || "").trim().toLowerCase();
    const sName = String(row[hMap["hoTen"]] || "").trim().toLowerCase();

    if (sId === cleanCode || sCCCD === cleanCode || sName === cleanCode) {
      targetStudent = {
        id: String(row[hMap["id"]] || ""),
        hoTen: String(row[hMap["hoTen"]] || ""),
        to: String(row[hMap["to"]] || "Tổ 1"),
        chucVu: String(row[hMap["chucVu"]] || "Thành viên"),
        ngaySinh: row[hMap["ngaySinh"]] ? formatDateValue(row[hMap["ngaySinh"]]) : "",
        soCCCD: String(row[hMap["soCCCD"]] || ""),
        laDoanVien: (row[hMap["laDoanVien"]] === true || String(row[hMap["laDoanVien"]]).toLowerCase().includes("đoàn")),
        ngayVaoDoan: row[hMap["ngayVaoDoan"]] ? formatDateValue(row[hMap["ngayVaoDoan"]]) : "",
        diaChi: String(row[hMap["diaChi"]] || ""),
        tenBa: String(row[hMap["tenBa"]] || row[hMap["hoTenBa"]] || ""),
        sdtBa: String(row[hMap["sdtBa"]] || ""),
        tenMe: String(row[hMap["tenMe"]] || row[hMap["hoTenMe"]] || ""),
        sdtMe: String(row[hMap["sdtMe"]] || ""),
        diemThiDua: Number(row[hMap["diemThiDua"]]) || 100
      };
      break;
    }
  }

  if (!targetStudent) {
    return { status: "error", message: "Không tìm thấy hồ sơ học sinh tương ứng với thông tin đã nhập!" };
  }

  // Lọc nhật ký vi phạm riêng của học sinh
  const dataNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY).getDataRange().getValues();
  const personalViolations = [];
  for (let i = 1; i < dataNK.length; i++) {
    if (String(dataNK[i][1]).trim().toLowerCase() === targetStudent.id.toLowerCase()) {
      personalViolations.push({
        time: String(dataNK[i][0]),
        criteria: String(dataNK[i][3]),
        points: Number(dataNK[i][4]) || 0,
        note: String(dataNK[i][5] || "")
      });
    }
  }

  // Lọc thông tin quỹ lớp riêng của học sinh
  const dataKT = ss.getSheetByName(SHEET_NAMES.CAC_KY_THU).getDataRange().getValues();
  const campMap = {};
  for (let i = 1; i < dataKT.length; i++) {
    if (dataKT[i][0]) {
      campMap[String(dataKT[i][0])] = { title: String(dataKT[i][1]), target: Number(dataKT[i][2]) || 0 };
    }
  }

  const dataTQ = ss.getSheetByName(SHEET_NAMES.THU_QUY_CHI_TIET).getDataRange().getValues();
  const personalFunds = [];
  for (let i = 1; i < dataTQ.length; i++) {
    if (String(dataTQ[i][1]).trim().toLowerCase() === targetStudent.id.toLowerCase()) {
      const cId = String(dataTQ[i][0]);
      personalFunds.push({
        campaignTitle: campMap[cId] ? campMap[cId].title : cId,
        targetAmount: campMap[cId] ? campMap[cId].target : 100000,
        amountPaid: Number(dataTQ[i][3]) || 0,
        isPaid: Boolean(dataTQ[i][4]),
        paidDate: dataTQ[i][5] ? formatDateValue(dataTQ[i][5]) : ""
      });
    }
  }

  return {
    status: "success",
    student: targetStudent,
    personalViolations: personalViolations,
    personalFunds: personalFunds
  };
}

// ============================================================================
// IV. QUẢN LÝ NỀ NẾP & CHUYÊN CẦN
// ============================================================================
function saveAttendance(ss, payload) {
  const sheetDD = ss.getSheetByName(SHEET_NAMES.DIEM_DANH);
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  const sheetDS = ss.getSheetByName(SHEET_NAMES.DANH_SACH);

  const { sessionKey, sessionName, date, studentId, studentName, status, reason, sender } = payload;
  const incidentKey = `ATT_${sessionKey}_${date}_${studentId}`;

  const dataDD = sheetDD.getDataRange().getValues();
  for (let i = 1; i < dataDD.length; i++) {
    if (dataDD[i][7] === incidentKey) {
      sheetDD.getRange(i + 1, 5).setValue(status);
      sheetDD.getRange(i + 1, 6).setValue(reason || "");
      return { status: "success", message: "Đã cập nhật trạng thái điểm danh." };
    }
  }

  let scoreDelta = 0; let criteriaText = "Có mặt";
  if (status === "DI_TRE") { scoreDelta = -10; criteriaText = "Đi học trễ"; }
  else if (status === "VANG_PHEP") { scoreDelta = 0; criteriaText = "Nghỉ học (Có phép)"; }
  else if (status === "KHONG_PHEP") { scoreDelta = -20; criteriaText = "Vắng học (Không phép)"; }

  sheetDD.appendRow([`${sessionName} (${date})`, sessionKey, studentId, studentName, status, reason || "", sender, incidentKey]);

  if (status !== "CO_MAT") {
    sheetNK.appendRow([`${sessionName} (${date})`, studentId, studentName, `[Chuyên cần] ${criteriaText}`, scoreDelta, reason || "", sender, incidentKey]);
    if (scoreDelta !== 0) adjustStudentScoreDynamic(sheetDS, studentId, scoreDelta);
  }
  return { status: "success" };
}

function recordViolation(ss, payload) {
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  const sheetDS = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const { displayTime, studentId, studentName, criteria, points, note, sender } = payload;
  
  sheetNK.appendRow([displayTime, studentId, studentName, criteria, Number(points) || 0, note || "", sender, `VIO_${Date.now()}_${studentId}`]);
  if (Number(points) !== 0) adjustStudentScoreDynamic(sheetDS, studentId, Number(points));
  
  return { status: "success" };
}

function deleteViolation(ss, payload) {
  const { rowId, studentId, points } = payload;
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  if (rowId && Number(rowId) > 1) sheetNK.deleteRow(Number(rowId));
  if (Number(points) !== 0) adjustStudentScoreDynamic(ss.getSheetByName(SHEET_NAMES.DANH_SACH), studentId, -Number(points));
  return { status: "success" };
}

function approveLeaveSupplement(ss, payload) {
  const { rowId, studentId, note } = payload;
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  const rId = Number(rowId);
  if (rId && rId > 1) {
    const oldPts = Number(sheetNK.getRange(rId, 5).getValue()) || 0;
    sheetNK.getRange(rId, 4).setValue("[Chuyên cần] Nghỉ học (Có phép - Bổ sung)");
    sheetNK.getRange(rId, 5).setValue(0);
    sheetNK.getRange(rId, 6).setValue((note || "") + " [GVCN duyệt]");
    if (oldPts < 0) adjustStudentScoreDynamic(ss.getSheetByName(SHEET_NAMES.DANH_SACH), studentId, Math.abs(oldPts));
  }
  return { status: "success" };
}

// ============================================================================
// V. SƠ ĐỒ LỚP HỌC & SỔ ĐẦU BÀI
// ============================================================================
function saveSeatingChart(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.SO_DO_LOP);
  const layout = payload.layout || [];
  
  // Xóa dữ liệu cũ từ hàng 2
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }

  if (layout.length > 0) {
    const rows = layout.map(item => [
      item.day || "",
      item.ban || "",
      item.viTri || "",
      item.id || "",
      item.hoTen || "",
      item.ghiChu || ""
    ]);
    sheet.getRange(2, 1, rows.length, 6).setValues(rows);
  }
  return { status: "success", message: "Đã lưu sơ đồ chỗ ngồi." };
}

function rotateSeatingChart(ss) {
  const sheet = ss.getSheetByName(SHEET_NAMES.SO_DO_LOP);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: "error", message: "Sơ đồ chưa có dữ liệu." };

  for (let i = 1; i < data.length; i++) {
    let curDay = Number(data[i][0]) || 1;
    let nextDay = (curDay % 4) + 1; // Đảo tuần hoàn Dãy 1->2->3->4->1
    sheet.getRange(i + 1, 1).setValue(nextDay);
  }
  return { status: "success", message: "Đã xoay dãy ghế theo tuần hoàn." };
}

function saveClassSessionLog(ss, payload) {
  const { date, session, period, subject, teacher, topic, rating, praiseStudentId, praiseReason, violationStudentId, violationReason, note, sender } = payload;
  ss.getSheetByName(SHEET_NAMES.SO_DAU_BAI).appendRow([
    `${session} (${date})`, period, subject, teacher, topic || "", rating, 
    praiseStudentId || "", violationStudentId || "", note || "", sender
  ]);
  
  if (praiseStudentId) {
    recordViolation(ss, { displayTime: `${session} - ${period}`, studentId: praiseStudentId, studentName: "Theo SĐB", criteria: `[Sổ đầu bài] Tuyên dương môn ${subject} - ${praiseReason}`, points: 10, sender });
  }
  if (violationStudentId) {
    recordViolation(ss, { displayTime: `${session} - ${period}`, studentId: violationStudentId, studentName: "Theo SĐB", criteria: `[Sổ đầu bài] Vi phạm môn ${subject} - ${violationReason}`, points: -10, sender });
  }
  return { status: "success" };
}

// ============================================================================
// VI. LAO ĐỘNG & TRỰC NHẬT
// ============================================================================
function saveLaborInspection(ss, payload) {
  const { sessionKey, team, status, inspector } = payload;
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  const dateStr = formatDateValue(new Date());

  const pts = (status === "DAT") ? 0 : -20;
  sheetNK.appendRow([
    `${sessionKey} (${dateStr})`,
    team,
    `Tập thể ${team}`,
    `[Trực nhật] Nghiệm thu: ${status === "DAT" ? "Đạt tiêu chuẩn" : "Chưa đạt (-20đ Tổ)"}`,
    pts,
    `Người nghiệm thu: ${inspector}`,
    inspector,
    `LABOR_${Date.now()}`
  ]);
  return { status: "success" };
}

function updateLaborPunishmentStatus(ss, payload) {
  const { studentId, status } = payload;
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  sheetNK.appendRow([
    formatDateValue(new Date()),
    studentId,
    "Học sinh bị phạt",
    `[Lao động phạt] Trạng thái: ${status}`,
    0,
    "Ban Cán sự Lao động nghiệm thu",
    "Cán sự LĐ",
    `LABOR_PUNISH_${Date.now()}`
  ]);
  return { status: "success" };
}

function recordDeskSanitationViolation(ss, payload) {
  const { deskPosition, errorType, points, sender } = payload;
  const sheetNK = ss.getSheetByName(SHEET_NAMES.NHAT_KY);
  sheetNK.appendRow([
    formatDateValue(new Date()),
    deskPosition,
    `Vị trí ${deskPosition}`,
    `[Vệ sinh bàn học] ${errorType}`,
    Number(points) || -10,
    "Ban Cán sự Lao động ghi nhận",
    sender,
    `DESK_${Date.now()}`
  ]);
  return { status: "success" };
}

// ============================================================================
// VII. QUẢN LÝ QUỸ LỚP
// ============================================================================
function createFundCampaign(ss, payload) {
  const { title, target } = payload;
  const sheet = ss.getSheetByName(SHEET_NAMES.CAC_KY_THU);
  const id = `KY_${Date.now()}`;
  sheet.appendRow([id, title, Number(target) || 0, formatDateValue(new Date()), "Đang thu", ""]);
  return { status: "success", campaignId: id };
}

function saveFundPaymentBatch(ss, payload) {
  const sheetTQ = ss.getSheetByName(SHEET_NAMES.THU_QUY_CHI_TIET);
  const { campaignId, payments } = payload;
  const data = sheetTQ.getDataRange().getValues();
  
  payments.forEach(p => {
    let found = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(campaignId) && String(data[i][1]) === String(p.studentId)) {
        found = i + 1;
        break;
      }
    }
    if (found > 0) {
      sheetTQ.getRange(found, 4).setValue(p.amountPaid);
      sheetTQ.getRange(found, 5).setValue(p.isPaid);
      sheetTQ.getRange(found, 6).setValue(formatDateValue(new Date()));
      sheetTQ.getRange(found, 7).setValue(p.note || "");
    } else {
      sheetTQ.appendRow([campaignId, p.studentId, p.studentName, p.amountPaid, p.isPaid, formatDateValue(new Date()), p.note || ""]);
    }
  });
  return { status: "success" };
}

function saveFundExpense(ss, payload) {
  ss.getSheetByName(SHEET_NAMES.SO_QUY).appendRow([
    `CHI_${Date.now()}`,
    formatDateValue(new Date()),
    "CHI",
    payload.category,
    Number(payload.amount) || 0,
    payload.author || "Thủ quỹ lớp",
    payload.note || ""
  ]);
  return { status: "success" };
}

// ============================================================================
// VIII. QUẢN TRỊ HỒ SƠ HỌC SINH (NHẬP EXCEL & THAO TÁC CÁ NHÂN)
// ============================================================================
function addNewStudent(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const hMap = getHeaderMap(sheet);
  const nextId = "HS" + (sheet.getLastRow() < 10 ? "0" + sheet.getLastRow() : sheet.getLastRow());

  const newRow = new Array(sheet.getLastColumn()).fill("");
  newRow[hMap["id"]] = payload.id || nextId;
  newRow[hMap["hoTen"]] = payload.hoTen;
  newRow[hMap["to"]] = payload.to || "Tổ 1";
  newRow[hMap["chucVu"]] = payload.chucVu || "Thành viên";
  newRow[hMap["soCCCD"]] = payload.soCCCD || "";
  newRow[hMap["tenBa"]] = payload.hoTenBa || payload.tenBa || "";
  newRow[hMap["sdtBa"]] = payload.sdtBa || "";
  newRow[hMap["taiKhoan"]] = payload.id || nextId;
  newRow[hMap["matKhau"]] = "123456";
  newRow[hMap["diemThiDua"]] = 100;

  sheet.appendRow(newRow);
  return { status: "success", studentId: nextId };
}

function updateStudentProfile(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const data = sheet.getDataRange().getValues();
  const hMap = getHeaderMap(sheet);
  const sId = String(payload.id).trim();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][hMap["id"]]).trim() === sId) {
      const rowIdx = i + 1;
      if (payload.to) sheet.getRange(rowIdx, hMap["to"] + 1).setValue(payload.to);
      if (payload.chucVu) sheet.getRange(rowIdx, hMap["chucVu"] + 1).setValue(payload.chucVu);
      if (payload.soCCCD) sheet.getRange(rowIdx, hMap["soCCCD"] + 1).setValue(payload.soCCCD);
      if (payload.ngayCapCCCD) sheet.getRange(rowIdx, hMap["ngayCapCCCD"] + 1).setValue(payload.ngayCapCCCD);
      if (payload.noiCapCCCD) sheet.getRange(rowIdx, hMap["noiCapCCCD"] + 1).setValue(payload.noiCapCCCD);
      if (payload.laDoanVien !== undefined) sheet.getRange(rowIdx, hMap["laDoanVien"] + 1).setValue(payload.laDoanVien);
      if (payload.ngayVaoDoan) sheet.getRange(rowIdx, hMap["ngayVaoDoan"] + 1).setValue(payload.ngayVaoDoan);
      if (payload.diaChi) sheet.getRange(rowIdx, hMap["diaChi"] + 1).setValue(payload.diaChi);
      if (payload.tenBa) sheet.getRange(rowIdx, hMap["tenBa"] + 1).setValue(payload.tenBa);
      if (payload.ngheNghiepBa) sheet.getRange(rowIdx, hMap["ngheNghiepBa"] + 1).setValue(payload.ngheNghiepBa);
      if (payload.sdtBa) sheet.getRange(rowIdx, hMap["sdtBa"] + 1).setValue(payload.sdtBa);
      if (payload.tenMe) sheet.getRange(rowIdx, hMap["tenMe"] + 1).setValue(payload.tenMe);
      if (payload.ngheNghiepMe) sheet.getRange(rowIdx, hMap["ngheNghiepMe"] + 1).setValue(payload.ngheNghiepMe);
      if (payload.sdtMe) sheet.getRange(rowIdx, hMap["sdtMe"] + 1).setValue(payload.sdtMe);
      if (payload.taiKhoan) sheet.getRange(rowIdx, hMap["taiKhoan"] + 1).setValue(payload.taiKhoan);
      if (payload.matKhau) sheet.getRange(rowIdx, hMap["matKhau"] + 1).setValue(payload.matKhau);
      return { status: "success", message: "Đã cập nhật hồ sơ." };
    }
  }
  return { status: "error", message: "Không tìm thấy học sinh." };
}

function deleteStudent(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const data = sheet.getDataRange().getValues();
  const hMap = getHeaderMap(sheet);
  const sId = String(payload.id).trim();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][hMap["id"]]).trim() === sId) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Đã xóa học sinh." };
    }
  }
  return { status: "error", message: "Không tìm thấy học sinh." };
}

// Lưu toàn bộ danh sách 45 học sinh từ file Excel vnEdu / SMAS
function saveAllStudentsBatch(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const students = payload.students || [];
  if (students.length === 0) return { status: "error", message: "Danh sách trống." };

  const hMap = getHeaderMap(sheet);
  const numCols = sheet.getLastColumn();

  // Xóa sạch dữ liệu học sinh cũ từ hàng 2
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, numCols).clearContent();
  }

  const rows = students.map(s => {
    const row = new Array(numCols).fill("");
    row[hMap["id"]] = s.id;
    row[hMap["hoTen"]] = s.hoTen;
    row[hMap["to"]] = s.to || "Tổ 1";
    row[hMap["chucVu"]] = s.chucVu || "Thành viên";
    row[hMap["ngaySinh"]] = s.ngaySinh || "";
    row[hMap["soCCCD"]] = s.soCCCD || "";
    row[hMap["ngayCapCCCD"]] = s.ngayCapCCCD || "";
    row[hMap["noiCapCCCD"]] = s.noiCapCCCD || "Cục Cảnh sát QLHC về TTXH";
    row[hMap["laDoanVien"]] = s.laDoanVien ? "Đoàn viên" : "Thanh niên";
    row[hMap["ngayVaoDoan"]] = s.ngayVaoDoan || "";
    row[hMap["diaChi"]] = s.diaChi || "Tây Sơn, Gia Lai";
    row[hMap["tenBa"]] = s.tenBa || "";
    row[hMap["ngheNghiepBa"]] = s.ngheNghiepBa || "";
    row[hMap["sdtBa"]] = s.sdtBa || "";
    row[hMap["tenMe"]] = s.tenMe || "";
    row[hMap["ngheNghiepMe"]] = s.ngheNghiepMe || "";
    row[hMap["sdtMe"]] = s.sdtMe || "";
    row[hMap["taiKhoan"]] = s.taiKhoan || s.id;
    row[hMap["matKhau"]] = s.matKhau || "123456";
    row[hMap["diemThiDua"]] = Number(s.diemThiDua) || 100;
    return row;
  });

  sheet.getRange(2, 1, rows.length, numCols).setValues(rows);
  return { status: "success", count: rows.length };
}

// ============================================================================
// IX. TIỆN ÍCH HỆ THỐNG
// ============================================================================
function saveConfig(ss, payload) {
  const sheetCH = ss.getSheetByName(SHEET_NAMES.CAU_HINH);
  const data = sheetCH.getDataRange().getValues();
  for (let key in payload) {
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheetCH.getRange(i + 1, 2).setValue(payload[key]);
        found = true; break;
      }
    }
    if (!found) sheetCH.appendRow([key, payload[key], "Cập nhật từ hệ thống"]);
  }
  return { status: "success" };
}

function resetWeeklyScores(ss) {
  const sheetDS = ss.getSheetByName(SHEET_NAMES.DANH_SACH);
  const hMap = getHeaderMap(sheetDS);
  const diemCol = hMap["diemThiDua"] + 1;
  const numRows = sheetDS.getLastRow() - 1;
  if (numRows > 0 && diemCol) {
    const defaultScores = new Array(numRows).fill([100]);
    sheetDS.getRange(2, diemCol, numRows, 1).setValues(defaultScores);
  }
  return { status: "success", message: "Đã làm mới điểm rèn luyện 100đ cho toàn lớp." };
}

function adjustStudentScoreDynamic(sheetDS, studentId, delta) {
  const hMap = getHeaderMap(sheetDS);
  const data = sheetDS.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][hMap["id"]]).trim().toLowerCase() === String(studentId).trim().toLowerCase()) {
      const curScore = Number(data[i][hMap["diemThiDua"]]) || 100;
      sheetDS.getRange(i + 1, hMap["diemThiDua"] + 1).setValue(Math.max(0, curScore + delta));
      break;
    }
  }
}

function formatDateValue(val) {
  if (!val) return "";
  if (val instanceof Date) return Utilities.formatDate(val, "GMT+7", "dd/MM/yyyy");
  return String(val);
}
