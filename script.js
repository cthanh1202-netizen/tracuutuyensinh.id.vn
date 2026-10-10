/* =========================
   COUNTDOWN
========================= */

const target =
    new Date("2027-06-11T07:30:00+07:00").getTime();

function tick() {

    let distance = Math.max(
        0,
        target - Date.now()
    );

    const daysValue =
        Math.floor(distance / 86400000);

    distance %= 86400000;

    const hoursValue =
        Math.floor(distance / 3600000);

    distance %= 3600000;

    const minutesValue =
        Math.floor(distance / 60000);

    const secondsValue =
        Math.floor(distance / 1000) % 60;

    document.getElementById("days").textContent =
        String(daysValue).padStart(2,"0");

    document.getElementById("hours").textContent =
        String(hoursValue).padStart(2,"0");

    document.getElementById("minutes").textContent =
        String(minutesValue).padStart(2,"0");

    document.getElementById("seconds").textContent =
        String(secondsValue).padStart(2,"0");
}

tick();
setInterval(tick,1000);


/* =========================
   DARK / LIGHT MODE
========================= */

const theme =
    document.getElementById("theme");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
}

function updateTheme() {

    theme.classList.toggle(
        "dark",
        !document.body.classList.contains("light")
    );
}

updateTheme();

theme.addEventListener("click", () => {

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );

    updateTheme();
});


/* =========================
   LỊCH THI
========================= */

const countdownCard =
    document.getElementById("countdownCard");

const schedule =
    document.getElementById("schedule");

function toggleSchedule() {

    const open =
        schedule.classList.toggle("open");

    countdownCard.setAttribute(
        "aria-expanded",
        open
    );
}

countdownCard.addEventListener(
    "click",
    toggleSchedule
);

countdownCard.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();
            toggleSchedule();
        }
    }
);


document
    .getElementById("close")
    .addEventListener("click", event => {

        event.stopPropagation();

        schedule.classList.remove("open");

        countdownCard.setAttribute(
            "aria-expanded",
            "false"
        );
    });


/* =========================
   MENU
========================= */

const toolMap = {

    score: "scoreTool",
    cutoff: "cutoffTool",
    major: "majorTool",
    study: "studyTool"

};

document
    .querySelectorAll(".card")
    .forEach(card => {

        card.addEventListener("click", () => {

            document
                .querySelectorAll(".tools")
                .forEach(tool =>
                    tool.classList.remove("open")
                );

            const tool =
                document.getElementById(
                    toolMap[card.dataset.tool]
                );

            tool.classList.add("open");

            tool.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


/* =========================
   TAB THPT / HỌC BẠ
========================= */

document
    .querySelectorAll(".scoretab")
    .forEach(tab => {

        tab.addEventListener("click", () => {

            document
                .querySelectorAll(".scoretab")
                .forEach(t =>
                    t.classList.remove("active")
                );

            tab.classList.add("active");

            const mode =
                tab.dataset.mode;

            document.getElementById(
                "thptMode"
            ).style.display =
                mode === "thpt"
                    ? "block"
                    : "none";

            document.getElementById(
                "hocbaMode"
            ).style.display =
                mode === "hocba"
                    ? "block"
                    : "none";
        });
    });


/* =========================
   TÍNH ĐIỂM THPT
========================= */

document
    .getElementById("calc")
    .addEventListener("click", () => {

        const a =
            Number(document.getElementById("s1").value) || 0;

        const b =
            Number(document.getElementById("s2").value) || 0;

        const c =
            Number(document.getElementById("s3").value) || 0;

        const region =
            Number(document.getElementById("region").value);

        const bonus =
            Number(document.getElementById("bonus").value) || 0;

        const block =
            document.getElementById("block").value;

        const base = a + b + c;

        const total =
            base + region + bonus;

        document.getElementById(
            "scoreResult"
        ).textContent =

            `Khối ${block} • 3 môn: ${base.toFixed(2)}
            • KV: +${region.toFixed(2)}
            • Ưu tiên: +${bonus.toFixed(2)}
            → Tổng: ${total.toFixed(2)} / 30`;
    });


/* =========================
   TÍNH HỌC BẠ
========================= */

document
    .getElementById("calcHb")
    .addEventListener("click", () => {

        const values = [

            "hbToan10",
            "hbToan11",
            "hbToan12",

            "hbVan10",
            "hbVan11",
            "hbVan12",

            "hbAnh10",
            "hbAnh11",
            "hbAnh12",

            "hbLy10",
            "hbLy11",
            "hbLy12",

            "hbHoa10",
            "hbHoa11",
            "hbHoa12"

        ].map(id =>
            Number(document.getElementById(id).value) || 0
        );

        const filled =
            values.filter(value => value > 0);

        if (!filled.length) {

            document.getElementById(
                "hbResult"
            ).textContent =
                "Hãy nhập điểm học bạ trước.";

            return;
        }

        const average =
            filled.reduce(
                (sum,value) => sum + value,
                0
            ) / filled.length;

        const region =
            Number(
                document.getElementById(
                    "hbRegion"
                ).value
            );

        const bonus =
            Number(
                document.getElementById(
                    "hbBonus"
                ).value
            ) || 0;

        const total =
            average * 3 + region + bonus;

        document.getElementById(
            "hbResult"
        ).textContent =

            `Điểm trung bình: ${average.toFixed(2)}
            • Ưu tiên: +${(region + bonus).toFixed(2)}
            → Tổng tham khảo: ${total.toFixed(2)} / 30`;
    });


/* =========================
   DỮ LIỆU ĐIỂM CHUẨN
========================= */

const cutoffData = {

    vnu: [

        ["Công nghệ thông tin","A00, A01, D01","26.10"],

        ["FinTech / Công nghệ tài chính",
         "A00, A01, D01","25.10"],

        ["Quản trị kinh doanh",
         "A00, A01, D01","24.50"],

        ["Tài chính - Ngân hàng",
         "A00, A01, D01","25.20"],

        ["Kinh tế",
         "A00, A01, D01","24.80"]

    ],

    neu: [

        ["Công nghệ thông tin",
         "A00, A01, D01","27.40"],

        ["Quản trị kinh doanh",
         "A00, A01, D01","27.10"],

        ["Tài chính - Ngân hàng",
         "A00, A01, D01","27.30"],

        ["Kinh tế quốc tế",
         "A01, D01","27.60"],

        ["Marketing",
         "A01, D01","27.20"]

    ],

    hust: [

        ["Công nghệ thông tin",
         "A00, A01","27.20"],

        ["Khoa học máy tính",
         "A00, A01","28.00"],

        ["Kỹ thuật điện",
         "A00, A01","26.40"],

        ["Cơ điện tử",
         "A00, A01","26.90"],

        ["Quản trị kinh doanh",
         "A00, A01","25.40"]

    ],

    tm: [

        ["Công nghệ thông tin",
         "A00, A01","27.00"],

        ["Quản trị kinh doanh",
         "A00, A01","26.20"],

        ["Tài chính - Ngân hàng",
         "A00, A01","26.50"],

        ["Marketing",
         "A00, A01","26.30"],

        ["Kinh doanh quốc tế",
         "A00, A01","26.80"]

    ],

    ftu: [

        ["Kinh tế đối ngoại — CT tiên tiến",
         "A00, A01, D01, D07","29.70"],

        ["Kinh doanh quốc tế và Phân tích dữ liệu kinh doanh",
         "A01, D01, D07","29.50"],

        ["Logistics toàn cầu và đổi mới chuỗi cung ứng",
         "A00, A01, D01, D07","28.70"],

        ["Kinh tế quốc tế — CLC",
         "A01, D01, D07","28.00"],

        ["Kinh doanh quốc tế — CLC",
         "A01, D01, D07","28.75"],

        ["Kinh doanh số toàn cầu",
         "A00, A01, D01, D07","27.90"],

        ["Kinh doanh sáng tạo và Công nghiệp văn hóa",
         "A00, A01, D01, D07","25.00"],

        ["Quản trị kinh doanh — CT tiên tiến",
         "A01, D01, D07","26.75"],

        ["Thương mại số thông minh và đổi mới kinh doanh",
         "A01, D01, D07","27.20"],

        ["Tài chính - Ngân hàng — CT tiên tiến",
         "A01, D01, D07","28.70"],

        ["Tài chính - Ngân hàng — CLC",
         "A01, D01, D07","27.00"],

        ["Kế toán - Kiểm toán — CT tiên tiến",
         "A00, A01, D01, D07","27.10"],

        ["Luật thương mại quốc tế — CT tiên tiến",
         "A00, A01, D01, D07","25.00"],

        ["Quản trị khách sạn",
         "A00, A01, D01, D07","25.00"],

        ["Khoa học máy tính và dữ liệu trong kinh tế và kinh doanh",
         "A00, A01, D01, D07","34.66"],

        ["Tiếng Anh thương mại",
         "D01","33.88"],

        ["Tiếng Trung thương mại",
         "D01, D04","36.00"]

    ]

};


const schoolNames = {

    vnu: "ĐHQG Hà Nội",

    neu: "ĐH Kinh tế Quốc dân",

    hust: "ĐH Bách khoa Hà Nội",

    tm: "ĐH Thương mại",

    ftu: "ĐH Ngoại thương — Cơ sở phía Bắc"

};


/* =========================
   HIỂN THỊ ĐIỂM CHUẨN
========================= */


/* ===== TRA CỨU ĐIỂM CHUẨN ===== */

const schoolSearch = document.getElementById("schoolSearch");
const schoolInput = document.getElementById("school");
const schoolHint = document.getElementById("schoolHint");
const cutoffSearch = document.getElementById("cutoffSearch");
const cutoffResult = document.getElementById("cutoffResult");

const schoolAliases = {
    "đhqg hà nội": "vnu",
    "đại học quốc gia hà nội": "vnu",
    "vnu": "vnu",

    "đh kinh tế quốc dân": "neu",
    "đại học kinh tế quốc dân": "neu",
    "neu": "neu",

    "đh bách khoa hà nội": "hust",
    "đại học bách khoa hà nội": "hust",
    "hust": "hust",

    "đh thương mại": "tm",
    "đại học thương mại": "tm",
    "tm": "tm",

    "đh ngoại thương — cơ sở phía bắc": "ftu",
    "đh ngoại thương": "ftu",
    "đại học ngoại thương": "ftu",
    "ftu": "ftu"
};

function normalizeText(value) {
    return String(value || "")
        .normalize("NFC")
        .trim()
        .toLocaleLowerCase("vi");
}

function resolveSchool(value) {
    return schoolAliases[normalizeText(value)] || "";
}

function renderCutoff() {
    const school = schoolInput.value;
    const search = normalizeText(cutoffSearch.value);
    const data = cutoffData[school] || [];

    const filtered = data.filter(row =>
        normalizeText(row[0]).includes(search) ||
        normalizeText(row[1]).includes(search)
    );

    const heading = document.createElement("h3");
    heading.className = "cutoff-heading";
    heading.textContent = "📊 " + (schoolNames[school] || "Trường đại học");

    const count = document.createElement("p");
    count.className = "cutoff-count";
    count.textContent = `Tìm thấy ${filtered.length} ngành`;

    const tableWrap = document.createElement("div");
    tableWrap.className = "cutoff-table-wrap";

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.className = "cutoff-empty";
        empty.textContent = "Không tìm thấy ngành phù hợp.";
        cutoffResult.replaceChildren(heading, count, empty);
        return;
    }

    const table = document.createElement("table");
    table.className = "cutoff-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["STT", "Tên ngành", "Tổ hợp", "Điểm"].forEach(label => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = label;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");

    filtered.forEach((row, index) => {
        const tr = document.createElement("tr");

        const rank = document.createElement("td");
        rank.className = "rank-cell";
        rank.textContent = String(index + 1);

        const major = document.createElement("td");
        major.className = "major-cell";
        major.textContent = row[0];

        const combo = document.createElement("td");
        combo.className = "combo-cell";
        combo.textContent = row[1];

        const score = document.createElement("td");
        score.className = "score-cell";
        score.textContent = row[2];

        tr.append(rank, major, combo, score);
        tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    tableWrap.appendChild(table);
    cutoffResult.replaceChildren(heading, count, tableWrap);
}

function chooseSchool() {
    const key = resolveSchool(schoolSearch.value);

    if (!key) {
        schoolHint.textContent =
            "Hãy chọn một trường có trong danh sách gợi ý.";
        return;
    }

    schoolInput.value = key;
    schoolSearch.value = schoolNames[key];
    schoolHint.textContent = "Đang chọn: " + schoolNames[key];

    renderCutoff();
}

schoolSearch.addEventListener("change", chooseSchool);

schoolSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        chooseSchool();
    }
});

cutoffSearch.addEventListener("input", renderCutoff);

document.getElementById("lookupCutoff").addEventListener("click", renderCutoff);

/* Hiển thị trường mặc định khi mở mục tra cứu */
schoolSearch.value = schoolNames[schoolInput.value] || schoolNames.vnu;
renderCutoff();


/* =========================
   GỢI Ý NGÀNH
========================= */

document
    .getElementById("suggest")
    .addEventListener("click", () => {

        const interest =
            document.getElementById(
                "interest"
            ).value;

        let result = "";

        if (
            interest.includes("Công nghệ")
        ) {

            result =
                "Gợi ý: Công nghệ thông tin, Khoa học máy tính, FinTech.";

        }

        else if (
            interest.includes("tài chính")
        ) {

            result =
                "Gợi ý: FinTech, Tài chính - Ngân hàng, Kinh tế.";

        }

        else if (
            interest.includes("Kỹ thuật")
        ) {

            result =
                "Gợi ý: Kỹ thuật điện, Cơ khí, Tự động hóa.";

        }

        else {

            result =
                "Gợi ý: Marketing, Truyền thông, Quản trị kinh doanh.";

        }

        document.getElementById(
            "majorResult"
        ).textContent = result;

    });