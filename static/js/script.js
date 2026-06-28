// ==============================
// DOM Elements
// ==============================

// Process Panel
const processCountInput =
    document.getElementById("process-count");

const generateBtn =
    document.getElementById("generate-btn");

const processBody =
    document.getElementById("process-body");

// Algorithm Panel
const algorithmSelect =
    document.getElementById("algorithm");

const compareCheckbox =
    document.getElementById("compare-all");

const quantumGroup =
    document.getElementById("quantum-group");

const quantumInput =
    document.getElementById("quantum");

// Action Panel
const calculateBtn =
    document.getElementById("calculate-btn");

const clearBtn =
    document.getElementById("clear-btn");

const messageBox =
    document.getElementById("message-box");

// Theme
const themeToggleBtn =
    document.getElementById("theme-toggle-btn");

// Result
const compareSummary =
    document.getElementById("compare-summary");

const resultContainer =
    document.getElementById("result-container");

const emptyState =
    document.getElementById("empty-state");

// ==============================
// Process Colors
// ==============================

const PROCESS_COLORS = [
    "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#06b6d4", "#3b82f6",
    "#6366f1", "#8b5cf6", "#ec4899",
    "#14b8a6", "#84cc16", "#f43f5e",
    "#0ea5e9", "#a855f7", "#10b981"
];

let colorIndex = 0;

function nextColor() {
    const color =
        PROCESS_COLORS[
            colorIndex % PROCESS_COLORS.length
        ];
    colorIndex++;
    return color;
}

function resetColorIndex() {
    colorIndex = 0;
}

// ==============================
// Process Table
// ==============================

function createProcessRow(pid) {
    const row = document.createElement("tr");
    const color = nextColor();
    row.innerHTML = `
        <td>
            <div
                class="process-color"
                data-color="${color}"
                style="background:${color}"
            ></div>
        </td>
        <td>${pid}</td>
        <td>
            <input
                type="number"
                class="arrival-time"
                min="0"
                placeholder="0"
            >
        </td>
        <td>
            <input
                type="number"
                class="burst-time"
                min="1"
                placeholder="1"
            >
        </td>
        <td>
            <button
                class="delete-row"
                type="button"
                title="Remove process"
            >×</button>
        </td>
    `;
    return row;
}

function generateProcessTable() {
    const count =
        Number(processCountInput.value);
    if (
        !Number.isInteger(count) ||
        count < 1
    ) {
        showMessage(
            "Please enter at least 1 process."
        );
        return;
    }
    processBody.innerHTML = "";
    resetColorIndex();
    clearMessage();
    for (let i = 1; i <= count; i++) {
        const row = createProcessRow(
            `P${i}`
        );
        processBody.appendChild(row);
    }
}

generateBtn.addEventListener(
    "click",
    generateProcessTable
);

// Delete Process Row
processBody.addEventListener(
    "click",
    function (event) {
        if (
            !event.target.classList.contains(
                "delete-row"
            )
        ) {
            return;
        }
        const row =
            event.target.closest("tr");
        row.remove();
        updateProcessID();
    }
);

function updateProcessID() {
    const rows = getProcessRows();
    rows.forEach(
        function (row, index) {
            row.children[1].textContent =
                `P${index + 1}`;
        }
    );
}

// ==============================
// Quantum Visibility
// ==============================

function updateQuantumVisibility() {
    const algorithm =
        algorithmSelect.value;
    const showQuantum =
        compareCheckbox.checked ||
        algorithm.startsWith("rr_");
    quantumGroup.classList.toggle(
        "hidden",
        !showQuantum
    );
}

algorithmSelect.addEventListener(
    "change",
    updateQuantumVisibility
);

compareCheckbox.addEventListener(
    "change",
    updateQuantumVisibility
);

updateQuantumVisibility();

// ==============================
// Data Helpers
// ==============================

function getProcessRows() {
    return processBody.querySelectorAll("tr");
}

function getProcessData() {
    const rows = getProcessRows();
    const processes = [];
    rows.forEach(function (row) {
        const pid =
            row.children[1].textContent;
        const at = Number(
            row.querySelector(
                ".arrival-time"
            ).value
        );
        const bt = Number(
            row.querySelector(
                ".burst-time"
            ).value
        );
        const color =
            row.querySelector(
                ".process-color"
            ).dataset.color;
        processes.push({
            pid,
            at,
            bt,
            color
        });
    });
    return processes;
}

// ==============================
// Validation
// ==============================

function showMessage(message) {
    messageBox.textContent = message;
}

function clearMessage() {
    messageBox.textContent = "";
}

function validateProcessInput() {
    const processes =
        getProcessData();
    if (processes.length === 0) {
        showMessage(
            "Please add at least one process."
        );
        return false;
    }
    for (const process of processes) {
        if (
            Number.isNaN(process.at) ||
            process.at === ""
        ) {
            showMessage(
                `${process.pid}: Arrival Time is required.`
            );
            return false;
        }
        if (
            Number.isNaN(process.bt) ||
            process.bt === ""
        ) {
            showMessage(
                `${process.pid}: Burst Time is required.`
            );
            return false;
        }
        if (process.at < 0) {
            showMessage(
                `${process.pid}: Arrival Time cannot be negative.`
            );
            return false;
        }
        if (process.bt <= 0) {
            showMessage(
                `${process.pid}: Burst Time must be greater than 0.`
            );
            return false;
        }
    }
    if (
        compareCheckbox.checked ||
        algorithmSelect.value.startsWith("rr_")
    ) {
        const quantum =
            Number(quantumInput.value);
        if (
            !quantumInput.value ||
            Number.isNaN(quantum)
        ) {
            showMessage(
                "Quantum Time is required."
            );
            return false;
        }
        if (quantum <= 0) {
            showMessage(
                "Quantum Time must be greater than 0."
            );
            return false;
        }
    }
    clearMessage();
    return true;
}

// ==============================
// Calculate
// ==============================

calculateBtn.addEventListener(
    "click",
    async function () {
        if (!validateProcessInput()) {
            return;
        }
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = `
            <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Calculating...
        `;
        const result =
            await sendCalculateRequest();
        calculateBtn.disabled = false;
        calculateBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Calculate
        `;
        if (!result) {
            return;
        }
        renderResults(result);
    }
);

async function sendCalculateRequest() {
    const data = {
        algorithm:
            algorithmSelect.value,
        processes:
            getProcessData(),
        quantum:
            quantumInput.value
                ? Number(
                    quantumInput.value
                )
                : null,
        compare_all:
            compareCheckbox.checked
    };
    try {
        const response =
            await fetch(
                "/calculate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(
                        data
                    )
                }
            );
        const result =
            await response.json();
        if (!response.ok) {
            showMessage(
                result.error
            );
            return null;
        }
        clearMessage();
        return result;
    }
    catch (error) {
        console.error(error);
        showMessage(
            "Failed to connect to server."
        );
        return null;
    }
}

// ==============================
// Clear
// ==============================

clearBtn.addEventListener(
    "click",
    function () {
        processBody.innerHTML = "";
        processCountInput.value = "";
        quantumInput.value = "";
        compareCheckbox.checked = false;
        algorithmSelect.selectedIndex = 0;
        updateQuantumVisibility();
        clearMessage();
        compareSummary.innerHTML = "";
        resultContainer.innerHTML = "";
        emptyState.style.display = "";
        resetColorIndex();
    }
);

// ==============================
// Rendering
// ==============================

function renderResults(data) {
    compareSummary.innerHTML = "";
    resultContainer.innerHTML = "";
    emptyState.style.display = "none";

    if (data.compare) {
        renderCompareSummary(
            data.ranking
        );
        data.results.forEach(
            function (result, idx) {
                renderResultCard(
                    result, idx
                );
            }
        );
    } else {
        renderResultCard(data, 0);
    }
}

function buildColorMap(results) {
    const colorMap = {};
    if (results && results.length > 0) {
        results.forEach(function (p) {
            if (p.color) {
                colorMap[p.pid] = p.color;
            }
        });
    }
    console.log("colorMap:", colorMap);
    return colorMap;
}

function renderResultCard(result, index) {
    const card =
        document.createElement("section");
    card.className = "result-card";
    card.style.animationDelay =
        `${index * 0.1}s`;
    card.innerHTML = `
        <div class="result-card-header">
            <h2>${result.algorithm}</h2>
        </div>
        <div class="result-card-body">
            <div class="stat-grid"></div>
            <div class="gantt-section"></div>
            <div class="table-section"></div>
        </div>
    `;
    resultContainer.appendChild(card);

    const colorMap = buildColorMap(
        result.results
    );

    renderStatistics(
        card.querySelector(".stat-grid"),
        result
    );
    renderGanttChart(
        card.querySelector(".gantt-section"),
        result.gantt,
        colorMap
    );
    renderResultTable(
        card.querySelector(".table-section"),
        result.results
    );
}

function renderStatistics(
    container,
    result
) {
    container.innerHTML = `
        <div class="stat-card">
            <span class="stat-label">
                Avg Waiting Time
            </span>
            <span class="stat-value">
                ${formatNumber(result.avg_wt)}
            </span>
        </div>
        <div class="stat-card">
            <span class="stat-label">
                Avg Turnaround Time
            </span>
            <span class="stat-value">
                ${formatNumber(result.avg_tat)}
            </span>
        </div>
    `;
}

function renderGanttChart(
    container,
    gantt,
    colorMap
) {
    if (!gantt || gantt.length === 0) {
        container.innerHTML =
            "<p>No Gantt Chart data.</p>";
        return;
    }
    colorMap = colorMap || {};
    const blocks = gantt.map(
        function (item, idx) {
            const isIdle =
                item.process === "Idle";
            const color = isIdle
                ? "var(--gantt-idle)"
                : (colorMap[item.process] || "#888");
            const textColor = isIdle
                ? "var(--gantt-idle-text)"
                : "white";
            return `
                <div
                    class="gantt-block"
                    style="
                        background:${color};
                        color:${textColor};
                        flex:${item.end - item.start};
                        animation-delay:${idx * 0.05}s;
                    "
                    title="${item.process}: ${item.start} → ${item.end}"
                >
                    ${item.process}
                </div>
            `;
        }
    ).join("");

    const timeline = gantt.map(
        function (item, index) {
            const isFirst = index === 0;
            const isLast = index === gantt.length - 1;
            
            let startStyle = "position: absolute; left: 0;";
            if (!isFirst) {
                startStyle += " transform: translateX(-50%);";
            }
            
            let endSpan = "";
            if (isLast) {
                endSpan = `<span style="position: absolute; right: 0;">${item.end}</span>`;
            }
            
            return `
                <div style="flex: ${item.end - item.start}; position: relative; height: 16px;">
                    <span style="${startStyle}">${item.start}</span>
                    ${endSpan}
                </div>
            `;
        }
    ).join("");

    container.innerHTML = `
        <h3>Gantt Chart</h3>
        <div class="gantt-wrapper">
            ${blocks}
        </div>
        <div class="gantt-time">
            ${timeline}
        </div>
    `;
}

function calculateTotals(table) {
    return table.reduce(
        function (totals, process) {
            totals.bt += process.bt;
            totals.ct += process.ct;
            totals.tat += process.tat;
            totals.wt += process.wt;
            return totals;
        },
        {
            bt: 0,
            ct: 0,
            tat: 0,
            wt: 0
        }
    );
}

function renderResultTable(
    container,
    table
) {
    if (!table || table.length === 0) {
        container.innerHTML =
            "<p>No data available.</p>";
        return;
    }

    const totals = calculateTotals(table);

    const rows = table.map(
        function (process) {
            return `
                <tr>
                    <td>
                        <div class="table-pid">
                            <span
                                class="table-color"
                                style="background:${process.color || '#888'}"
                            ></span>
                            ${process.pid}
                        </div>
                    </td>
                    <td>${process.at}</td>
                    <td>${process.bt}</td>
                    <td>${process.ct}</td>
                    <td>${formatNumber(process.tat)}</td>
                    <td>${formatNumber(process.wt)}</td>
                </tr>
            `;
        }
    ).join("");

    container.innerHTML = `
        <h3>Execution Results</h3>
        <table class="execution-table">
            <thead>
                <tr>
                    <th>Process</th>
                    <th>AT</th>
                    <th>BT</th>
                    <th>CT</th>
                    <th>TAT</th>
                    <th>WT</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
                <tr class="total-row">
                    <td>TOTAL</td>
                    <td>—</td>
                    <td>${totals.bt}</td>
                    <td>${totals.ct}</td>
                    <td>${formatNumber(totals.tat)}</td>
                    <td>${formatNumber(totals.wt)}</td>
                </tr>
            </tbody>
        </table>
        <div class="table-notes">
            <span>AT = Arrival Time</span>
            <span>BT = Burst Time</span>
            <span>CT = Completion Time</span>
        </div>
        <div class="table-notes">
            <span>TAT = Turnaround Time</span>
            <span>WT = Waiting Time</span>
            <span></span>
        </div>
    `;
}

// ==============================
// Compare Summary
// ==============================

function renderCompareSummary(ranking) {
    if (!ranking || ranking.length === 0) {
        return;
    }

    const rows = ranking.map(
        function (item, index) {
            return `
                <tr>
                    <td>${item.algorithm}</td>
                    <td>${formatNumber(item.avg_wt)}</td>
                    <td>${formatNumber(item.avg_tat)}</td>
                    <td>${getRankingLabel(index)}</td>
                </tr>
            `;
        }
    ).join("");

    compareSummary.innerHTML = `
        <h2>📊 Comparison Summary</h2>
        <table class="compare-table">
            <thead>
                <tr>
                    <th>Algorithm</th>
                    <th>AVG WT</th>
                    <th>AVG TAT</th>
                    <th>Ranking</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function getRankingLabel(index) {
    switch (index) {
        case 0:
            return "🥇 1st";
        case 1:
            return "🥈 2nd";
        case 2:
            return "🥉 3rd";
        default:
            return `${index + 1}th`;
    }
}

function formatNumber(value) {
    return Number(value ?? 0).toFixed(2);
}

// ==============================
// Theme
// ==============================

function applyTheme(isLight) {
    document.body.classList.toggle(
        "light",
        isLight
    );
    document.body.classList.toggle(
        "dark",
        !isLight
    );
    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );
}

themeToggleBtn.addEventListener(
    "click",
    function () {
        const isCurrentlyLight =
            document.body.classList.contains(
                "light"
            );
        applyTheme(!isCurrentlyLight);
    }
);

// Load saved theme
const savedTheme =
    localStorage.getItem("theme");

applyTheme(savedTheme === "light");