// Встановлюються вхідні дані задачі: ваги предметів, їхні цінності та максимальна вага рюкзака
const weights = [2, 3, 5, 2];
const values = [3, 6, 9, 4];
const capacity = 8;
const n = weights.length;

// Створюється таблиця dp[i][w], яка зберігає максимальні цінності для певної кількості предметів і ваги
let dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

// Реалізується функція затримки для відображення проміжних етапів побудови таблиці
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Заповнюється таблиця динамічного програмування відповідно до рекурентного співвідношення
async function fillDP() {
    const container = document.getElementById('table-container');
    renderTable(); // Відображається початкова таблиця

    // Проходиться по кожному предмету та кожній можливій вазі рюкзака
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                // Вибирається максимум між варіантом взяти предмет або не брати його
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                // Якщо предмет заважкий, копіюється попереднє значення
                dp[i][w] = dp[i - 1][w];
            }
            renderTable(i, w); // Оновлюється таблиця після кожного кроку
            await sleep(200);  // Здійснюється затримка для візуалізації змін
        }
    }
    showResult(); // Після завершення заповнення відображається результат
}

// Формується HTML-таблиця на основі поточних даних масиву dp
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

// Відновлюється перелік вибраних предметів та обчислюється максимальна цінність
function showResult() {
    let resultDiv = document.getElementById('result');
    resultDiv.style.opacity = 0; // Спочатку встановлюється прозорість

    let maxValue = dp[n][capacity]; // Зчитується максимальна цінність із таблиці
    let w = capacity;
    let items = [];

    // Відновлюється перелік предметів, що входять до оптимального рішення
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            items.push(i);       // Додається предмет до списку
            w -= weights[i-1];   // Зменшується поточна вага
        }
    }
    items.reverse(); // Відновлюється правильний порядок предметів

    // Формується результат для відображення на сторінці
    resultDiv.innerHTML = `
        <div>
            <p><strong>Максимальна цінність:</strong> ${maxValue}</p>
            <p><strong>Предмети в рюкзаку:</strong> ${items.join(", ")}</p>
        </div>
    `;

    // Здійснюється плавна поява результату
    setTimeout(() => {
        resultDiv.style.transition = "opacity 1s ease-in-out";
        resultDiv.style.opacity = 1;
    }, 100);
}

// Викликається функція побудови таблиці при завантаженні сторінки
fillDP();
