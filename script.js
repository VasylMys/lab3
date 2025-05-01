// Вхідні дані
const weights = [2, 3, 5, 2];
const values = [3, 6, 9, 4];
const capacity = 8;
const n = weights.length;

let dp;
let isRunning = false;

// Затримка
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Створення таблиці dp
function initDP() {
    dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
}

// Заповнення таблиці
async function fillDP() {
    if (isRunning) return; // захист від подвійного запуску
    isRunning = true;

    initDP();
    const container = document.getElementById('table-container');
    renderTable();

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
            renderTable(i, w);
            await sleep(200);
        }
    }
    showResult();
    isRunning = false;
}

// Рендер таблиці
function renderTable(highlightI = -1, highlightW = -1) {
    let html = "<table><tr><th>i\\w</th>";
    for (let w = 0; w <= capacity; w++) {
        html += `<th>${w}</th>`;
    }
    html += "</tr>";

    for (let i = 0; i <= n; i++) {
        html += `<tr><th>${i}</th>`;
        for (let w = 0; w <= capacity; w++) {
            const cls = (i === highlightI && w === highlightW) ? "highlight" : "";
            html += `<td class="${cls}">${dp[i][w]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById('table-container').innerHTML = html;
}

// Відображення результату
function showResult() {
    let resultDiv = document.getElementById('result');
    resultDiv.style.opacity = 0;

    let maxValue = dp[n][capacity];
    let w = capacity;
    let items = [];

    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            items.push({
                index: i,
                weight: weights[i - 1],
                value: values[i - 1]
            });
            w -= weights[i - 1];
        }
    }
    items.reverse();

    let itemDescriptions = items.map(item => 
        `Предмет ${item.index} (вага: ${item.weight}, цінність: ${item.value})`
    ).join("<br>");

    resultDiv.innerHTML = `
        <div>
            <p><strong>Максимальна цінність:</strong> ${maxValue}</p>
            <p><strong>Вибрані предмети:</strong><br>${itemDescriptions || "немає"}</p>
        </div>
    `;

    setTimeout(() => {
        resultDiv.style.transition = "opacity 1s ease-in-out";
        resultDiv.style.opacity = 1;
    }, 100);
}

// Обробник кнопки перезапуску
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('result').innerHTML = '';
    fillDP();
});

// Початковий запуск
fillDP();
