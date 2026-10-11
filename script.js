
"use strict";

// ===== TIỆN ÍCH CHUNG =====
const $ = (id) => document.getElementById(id);
let toastTimer;

function toast(message) {
  const element = $("toast");
  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2800);
}

function formatNumber(number) {
  return number.toLocaleString("vi-VN", {
    maximumFractionDigits: 2
  });
}

// ===== ĐỒNG HỒ VIỆT NAM =====
function updateClock() {
  const clock = $("liveClock");
  if (!clock) return;

  clock.textContent = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);

// ===== TRA CỨU ĐIỂM CHUẨN =====
// Chưa có cơ sở dữ liệu chính thức: không tự sinh điểm giả.
$("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const school = $("schoolSearch").value.trim();
  const major = $("majorSearch").value.trim();
  const year = $("yearSelect").value;
  const method = $("methodSelect").value;

  const methodNames = {
    all: "Tất cả phương thức",
    THPT: "Điểm thi tốt nghiệp THPT",
    HSA: "Đánh giá năng lực (HSA)",
    TSA: "Đánh giá tư duy (TSA)",
    HB: "Xét học bạ",
    OTHER: "Phương thức khác"
  };

  $("resultTitle").textContent =
    [school || "Toàn quốc", major].filter(Boolean).join(" · ");

  $("resultCount").textContent =
    `${year} · ${methodNames[method]}`;

  $("results").innerHTML = `
    <div class="empty-state">
      <span>⌕</span>
      <strong>Chưa có dữ liệu đã xác minh</strong>
      <p>Chưa thể đưa ra điểm chuẩn cho truy vấn này.</p>
      <small>
        Hãy đối chiếu đề án hoặc thông báo điểm chuẩn trên website chính thức của trường.
      </small>
    </div>
  `;

  toast("Bộ lọc đã cập nhật. Website chưa kết nối dữ liệu điểm chuẩn.");
});

// ===== MÁY TÍNH ĐIỂM =====
const combinations = {
  A00: ["Toán", "Vật lí", "Hóa học"],
  A01: ["Toán", "Vật lí", "Tiếng Anh"],
  B00: ["Toán", "Hóa học", "Sinh học"],
  C00: ["Ngữ văn", "Lịch sử", "Địa lí"],
  C01: ["Toán", "Ngữ văn", "Vật lí"],
  C02: ["Toán", "Ngữ văn", "Hóa học"],
  D01: ["Toán", "Ngữ văn", "Tiếng Anh"],
  D07: ["Toán", "Hóa học", "Tiếng Anh"],
  D14: ["Ngữ văn", "Lịch sử", "Tiếng Anh"],
  D15: ["Ngữ văn", "Địa lí", "Tiếng Anh"]
};

function updateSubjectLabels() {
  const subjects = combinations[$("comboSelect").value];

  $("label1").textContent = subjects[0];
  $("label2").textContent = subjects[1];
  $("label3").textContent = subjects[2];
}

$("comboSelect").addEventListener("change", updateSubjectLabels);
updateSubjectLabels();

$("calculateButton").addEventListener("click", () => {
  const values = ["score1", "score2", "score3"].map((id) => $(id).value.trim());

  if (values.some((value) => value === "")) {
    toast("Nhập đủ điểm của cả 3 môn nhé.");
    return;
  }

  const scores = values.map(Number);

  if (scores.some((score) => !Number.isFinite(score) || score < 0 || score > 10)) {
    toast("Mỗi môn phải nằm trong khoảng 0–10.");
    return;
  }

  const bonus = Number($("bonusInput").value || 0);
  const priorityMax = Number($("prioritySelect").value);

  if (!Number.isFinite(bonus) || bonus < 0 || bonus > 10) {
    toast("Điểm cộng khác phải nằm trong khoảng 0–10.");
    return;
  }

  const rawTotal = scores.reduce((sum, score) => sum + score, 0);

  // Công thức dưới đây chỉ để tham khảo, không đại diện quy tắc mọi năm/trường.
  const priority = rawTotal <= 22.5
    ? priorityMax
    : priorityMax * (30 - rawTotal) / 7.5;

  const total = Math.min(30, rawTotal + priority + bonus);

  $("totalScore").textContent = `${formatNumber(total)} / 30`;
  $("scoreDetails").textContent =
    `Tổ hợp ${$("comboSelect").value}: tổng 3 môn ${formatNumber(rawTotal)}; ` +
    `ưu tiên ước tính +${formatNumber(priority)}; điểm cộng nhập vào +${formatNumber(bonus)}. ` +
    "Kết quả chỉ để tham khảo, cần kiểm tra quy định chính thức.";
});

// ===== GỢI Ý NHÓM NGÀNH =====
const careerSuggestions = {
  data: [
    "Tài chính – Ngân hàng",
    "Công nghệ tài chính (FinTech)",
    "Phân tích kinh doanh / Khoa học dữ liệu"
  ],
  tech: [
    "Công nghệ thông tin",
    "Kỹ thuật phần mềm",
    "Hệ thống thông tin"
  ],
  people: [
    "Quản trị nhân lực",
    "Marketing",
    "Tâm lý học / Công tác xã hội"
  ],
  creative: [
    "Thiết kế đồ họa",
    "Truyền thông đa phương tiện",
    "Marketing / Sáng tạo nội dung"
  ],
  science: [
    "Khoa học dữ liệu",
    "Khoa học cơ bản",
    "Kỹ thuật và công nghệ"
  ]
};

$("careerButton").addEventListener("click", () => {
  const selected = $("interestSelect").value;
  const suggestions = careerSuggestions[selected];

  $("careerResults").innerHTML = `
    <strong>Nhóm ngành bạn có thể tìm hiểu</strong>
    <ul>${suggestions.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p class="disclaimer">
      Đây là gợi ý khám phá ban đầu, không phải kết luận ngành phù hợp.
      Hãy xem chương trình học, môn học và cơ hội nghề nghiệp thực tế.
    </p>
  `;
});

// ===== ĐẾM NGƯỢC NGÀY THI =====
let countdownInterval = null;

$("countdownButton").addEventListener("click", () => {
  const dateValue = $("examDate").value;

  if (!dateValue) {
    toast("Chọn ngày thi trước nhé.");
    return;
  }

  const target = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(target.getTime()) || target.getTime() <= Date.now()) {
    toast("Hãy chọn một ngày trong tương lai.");
    return;
  }

  if (countdownInterval) clearInterval(countdownInterval);

  $("countdownNote").textContent =
    `Đang đếm đến ${target.toLocaleDateString("vi-VN")}. ` +
    "Đây là ngày bạn tự chọn, không phải lịch thi đã được xác nhận.";

  function updateCountdown() {
    let remaining = target.getTime() - Date.now();

    if (remaining <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach((id) => {
        $(id).textContent = "0";
      });

      $("countdownNote").textContent = "Đã đến ngày bạn chọn.";
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    $("days").textContent = days.toLocaleString("vi-VN");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
});
