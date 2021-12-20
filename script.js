var process = false;

const barColor = "white";
const indexColor = "red";
const finishingColor = "#ebffa4";

const container = document.getElementById('container');
const delay_div = document.getElementById('delay');
const qty_div = document.getElementById('qty');
const delay_label = document.getElementById('delay-label');
const qty_label = document.getElementById('qty-label');
const generate = document.getElementById('generate');
const reset = document.getElementById('reset');
const stop = document.getElementById('stop');

var delay = delay_div.value / 10;
var qty = qty_div.value;

delay_label.innerText = delay + "ms";
delay_div.addEventListener("input", (e) => {
    delay = e.target.value / 10;
    delay_label.innerText = e.target.value / 10 + "ms";
});

qty_label.innerText = qty;
qty_div.addEventListener("input", (e) => {
    qty = e.target.value;
    qty_label.innerText = e.target.value;
    generateData();
});

var offset = 0;
var array = [];

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
}


function displayLines() {
    container.innerHTML = "";
    const val = (container.offsetWidth - 18) / qty;
    array.forEach((value, idx) => {
        const span = document.createElement('span');
        span.className = "line";
        span.style.height = `${(offset * value).toPrecision()}px`;
        span.style.width = `${val * 0.85}px`;
        span.style.transition = `${delay * 0.001}s transform ease`;
        span.style.transform = `translateX(${(idx * val).toPrecision()}px)`;
        span.style.backgroundColor = barColor;
        container.appendChild(span);
    });
}

function generateData() {
    process = false;
    offset = Math.floor(0.9 * container.offsetHeight / qty * 10) / 10;
    array = Array.from({
        length: qty
    }, (_, idx) => idx + 1);
    shuffle(array);
    displayLines();
}

generateData();

function swap(nodeA, nodeB) {
    return new Promise((resolve) => {
        let temp = nodeA.style.transform;
        nodeA.style.transform = nodeB.style.transform;
        nodeB.style.transform = temp;
        window.requestAnimationFrame(function () {
            setTimeout(() => {
                const parentA = nodeA.parentNode;
                const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA
                    .nextSibling;
                nodeB.parentNode.insertBefore(nodeA, nodeB);
                parentA.insertBefore(nodeB, siblingA);
                resolve();
            }, delay);
        });
    });
};

async function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

async function finishing() {
    let lines = document.querySelectorAll('.line');
    for (let i = 0; i < lines.length; i++) {
        if (!process) return;
        lines[i].style.backgroundColor = indexColor;
        await wait(delay);
        lines[i].style.backgroundColor = finishingColor;
    }
}

async function bubbleSort() {
    if (process) return;
    process = true;
    let lines = document.querySelectorAll('.line');
    for (let i = 0; i < lines.length; i++) {
        let flag = false;
        for (let j = 0; j < lines.length - i - 1; j++) {
            lines[j].style.backgroundColor = indexColor;
            lines[j + 1].style.backgroundColor = indexColor;
            await wait(delay);
            if (lines[j].clientHeight > lines[j + 1].clientHeight) {
                flag = true;
                await swap(lines[j], lines[j + 1]);
                lines = document.querySelectorAll('.line');
            }
            lines[j].style.backgroundColor = barColor;
            lines[j + 1].style.backgroundColor = barColor;
            if (!process) return;
        }
        if (!flag) {
            break;
        }
        if (!process) return;
    }
    await finishing();
    process = false;
}

async function selectionSort() {
    if (process) return;
    process = true;
    let lines = container.childNodes;
    for (let i = 0; i < lines.length; i++) {
        let min = i;
        lines[i].style.backgroundColor = "pink";
        for (let j = i + 1; j < lines.length; j++) {
            lines[j].style.backgroundColor = indexColor;
            await wait(delay);
            lines[j].style.backgroundColor = barColor;
            if (lines[min].clientHeight > lines[j].clientHeight) {
                if (min != i)
                    lines[min].style.backgroundColor = barColor;
                min = j;
                lines[min].style.backgroundColor = "green";
            }
            if (!process) return;
        }
        lines[i].style.backgroundColor = barColor;
        if (min != i) {
            lines[min].style.backgroundColor = barColor;
            await swap(lines[i], lines[min]);
            lines = container.children;
        }
        if (!process) return;
    }
    await finishing();
    process = false;
}

async function merge(temp, l, m, r) {
    if (!process) return;
    let arr = document.querySelectorAll('.line');
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++)
        L[i] = temp[l + i];
    for (let j = 0; j < n2; j++)
        R[j] = temp[m + 1 + j];

    let i = 0;
    let j = 0;
    let k = l;

    while (i < n1 && j < n2) {
        if (!process) return;
        arr[l + i].style.backgroundColor = indexColor;
        arr[m + 1 + j].style.backgroundColor = indexColor;
        await wait(delay);
        arr[l + i].style.backgroundColor = barColor;
        arr[m + 1 + j].style.backgroundColor = barColor;
        if (L[i].clientHeight <= R[j].clientHeight) {
            temp[k] = L[i];
            i++;
        } else {
            temp[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        if (!process) return;
        temp[k] = L[i];
        arr[l + i].style.backgroundColor = indexColor;
        await wait(delay);
        arr[l + i].style.backgroundColor = barColor;
        i++;
        k++;
    }

    while (j < n2) {
        if (!process) return;
        temp[k] = R[j];
        arr[m + 1 + j].style.backgroundColor = indexColor;
        await wait(delay);
        arr[m + 1 + j].style.backgroundColor = barColor;
        j++;
        k++;
    }
    for (let s = l; s <= r; s++) {
        if (!process) return;
        if (temp[s] !== arr[s]) {
            await swap(temp[s], arr[s]);
            arr = document.querySelectorAll('.line');
        }
    }
}

async function mergeSort(temp, low, high) {
    if (!process) return;
    if (low >= high) return;
    let mid = low + parseInt((high - low) / 2);
    await mergeSort(temp, low, mid);
    await mergeSort(temp, mid + 1, high);
    await merge(temp, low, mid, high);
}

async function partition(left, right) {
    if (!process) return;
    let items = document.querySelectorAll("#container > .line");
    let pivot = items[right];
    let i = left - 1;
    for (let j = left; j <= right; j++) {
        let temp = i + 1;
        items[temp].style.backgroundColor = indexColor;
        items[j].style.backgroundColor = indexColor;
        if (items[j].clientHeight < pivot.clientHeight) {
            i++;
            await swap(items[i], items[j]);
        } else {
            await wait(delay);
        }
        items[temp].style.backgroundColor = barColor;
        items[j].style.backgroundColor = barColor;
        items = document.querySelectorAll("#container > .line");
    }
    await swap(items[i + 1], items[right]);
    return (i + 1);
}

async function quickSort(left, right) {
    if (!process) return;
    if (left < right) {
        let pi = await partition(left, right);
        await quickSort(left, pi - 1);
        await quickSort(pi + 1, right);
    }
}

function disable(flag) {
    if (flag) {
        generate.setAttribute("disabled", "");
        qty_div.setAttribute("disabled", "");
        document.getElementById('bubble-sort').setAttribute("disabled", "");
        document.getElementById('selection-sort').setAttribute("disabled", "");
        document.getElementById('merge-sort').setAttribute("disabled", "");
        document.getElementById('quick-sort').setAttribute("disabled", "");
    } else {
        generate.removeAttribute("disabled");
        qty_div.removeAttribute("disabled");
        document.getElementById('bubble-sort').removeAttribute("disabled");
        document.getElementById('selection-sort').removeAttribute("disabled");
        document.getElementById('merge-sort').removeAttribute("disabled");
        document.getElementById('quick-sort').removeAttribute("disabled");
    }
}

document.getElementById('bubble-sort').addEventListener("click", async () => {
    disable(true);
    await bubbleSort();
    disable(false);
});
document.getElementById('selection-sort').addEventListener("click", async () => {
    disable(true);
    await selectionSort();
    disable(false);
});
document.getElementById('merge-sort').addEventListener("click", async () => {
    disable(true);
    process = true;
    await mergeSort(Array.from(document.querySelectorAll('.line')), 0, document.querySelectorAll(
        '.line').length - 1);
    if (!process) return;
    await finishing();
    disable(false);
    process = false;
});
document.getElementById('quick-sort').addEventListener("click", async () => {
    disable(true);
    process = true;
    await quickSort(0, document.querySelectorAll('.line').length - 1);
    if (!process) return;
    await finishing();
    disable(false);
    process = false;
});
generate.addEventListener("click", () => generateData());
stop.addEventListener("click", () => {
    process = false;
    disable(false);
});
reset.addEventListener("click", () => {
    process = false;
    displayLines();
    disable(false);
});