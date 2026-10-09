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

function renderCutoff() {

    const school =
        document.getElementById("school").value;

    const search =
        document
            .getElementById("cutoffSearch")
            .value
            .trim()
            .toLowerCase();

    const data =
        cutoffData[school];

    const filtered =
        data.filter(row =>
            row[0]
                .toLowerCase()
                .includes(search)
        );

    let html = `
        <b>📊 ${schoolNames[school]}</b>

        <table class="cutoff-table">

            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên ngành</th>
                    <th>Tổ hợp</th>
                    <th>Điểm</th>
                </tr>
            </thead>

            <tbody>
    `;

    filtered.forEach((row,index) => {

        html += `

            <tr>

                <td>
                    <span class="rank">
                        ${index + 1}
                    </span>
                </td>

                <td>
                    ${row[0]}
                </td>

                <td class="combo">
                    ${row[1]}
                </td>

                <td>
                    ${row[2]}
                </td>

            </tr>

        `;
    });

    html += `
            </tbody>
        </table>
    `;

    if (!filtered.length) {

        html =
            "<b>Không tìm thấy ngành phù hợp.</b>";
    }

    document.getElementById(
        "cutoffResult"
    ).innerHTML = html;
}


document
    .getElementById("lookupCutoff")
    .addEventListener(
        "click",
        renderCutoff
    );


document
    .getElementById("school")
    .addEventListener(
        "change",
        renderCutoff
    );


document
    .getElementById("cutoffSearch")
    .addEventListener(
        "input",
        renderCutoff
    );


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