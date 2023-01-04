let savedColor = [];
let currentColor = "#ff0000";

// HTML.
const selectedColorShowcase = document.querySelector(".__selected-color span");

const hexInput = document.querySelector("._hex input");
const rgbInput = document.querySelector("._rgb input");

const hexCopy = document.querySelector("._hex .copy_");
const rgbCopy = document.querySelector("._rgb .copy_");

const colorList = document.querySelector("._list");
const saveColorButton = document.querySelector(".save_");
const removeAllButton = document.querySelector(".remove-all_");

// colorjoe.
const joe = colorjoe.rgb(document.querySelector(".__colorjoe div"), "red");
joe.on("change", color => {
    currentColor = color.hex();

    selectedColorShowcase.style.background = color.hex();
    hexInput.value = color.hex();
    rgbInput.value = color.css().replaceAll(',', ', ');
});

joe.on("done", color => saveLastSelectedColor());

function copyText(colorCode) {
    colorCode.select();
    colorCode.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(colorCode.value);
};

function saveColor() {
    const colorToSave = `<span style="background: ${currentColor}" data-color="${currentColor}" onclick="selectColor(this.dataset.color)" oncontextmenu="removeColor(this.dataset.color, this)"></span>`;

    const isDuplicate = savedColor.some((value, index) => value == currentColor);
    if (isDuplicate) return;

    if (colorList.innerText == "Empty.") {
        colorList.innerText = "";
        colorList.style.justifyContent = "flex-start";
    };

    colorList.innerHTML += colorToSave;

    savedColor.push(currentColor);
    saveSavedColor();
};

function selectColor(color) {
    joe.set(color);

    saveLastSelectedColor();
};

function removeColor(color, element) {
    element.remove();

    // Remove from array.
    savedColor.forEach((item, index) => {
        if (item == color) savedColor.splice(index, 1);
    });

    if (savedColor.length == 0) {
        colorList.innerText = "Empty.";
        colorList.style.justifyContent = "center";
    };

    saveSavedColor();
};

function removeAllColor() {
    colorList.innerText = "Empty.";
    colorList.style.justifyContent = "center";
    savedColor = [];

    saveSavedColor();
};

function setColor(colorCode) {
    joe.set(colorCode.value);

    saveLastSelectedColor();
};

// Local Storage.
const colorSaved = "Saved_Color";
const lastSelectedColor = "Last_Selected_Color";

function saveSavedColor() {
    localStorage.setItem(colorSaved, JSON.stringify(savedColor));
};

function loadSavedColor() {
    let colorFromStorage = JSON.parse(localStorage.getItem(colorSaved)) || [];

    savedColor = colorFromStorage;

    if (savedColor.length == 0) {
        colorList.innerText = "Empty.";
    } else {
        colorList.innerText = "";
        colorList.style.justifyContent = "flex-start";
    };

    // Renderer.
    savedColor.forEach((item, index) => {
        const toLoad = `<span style="background: ${item}" data-color="${item}" onclick="selectColor(this.dataset.color)" oncontextmenu="removeColor(this.dataset.color, this)"></span>`;
        colorList.innerHTML += toLoad;
    });
};

function saveLastSelectedColor() {
    localStorage.setItem(lastSelectedColor, currentColor);
};

function loadLastSelectedColor() {
    const selectedLastTime = localStorage.getItem(lastSelectedColor) || "#ff0000";
    joe.set(selectedLastTime);
};

// Color List.

const jsonColor = "assets/css-color-names.json";

const tableBasic = document.querySelector(".__basic-colors table");
const tableExtended = document.querySelector(".__extended-colors table");

fetch(jsonColor)
    .then(response => response.json())
    .then(data => generateColorList(data))
    .catch(err => {
        tableBasic.innerHTML = err;
        tableExtended.innerHTML = err;
});

function generateColorList(data) {
    let colorBasic = Object.keys(data.basic);
    let hexBasic = Object.values(data.basic);

    let colorExtended = Object.keys(data.extended);
    let hexExtended = Object.values(data.extended);

    // Basic.
    colorBasic.forEach((item, index) => {
        let colorTable = `<tr>
                            <td>${item}</td>
                            <td><button style="background: ${hexBasic[index]};" data-color="${hexBasic[index]}" onclick="selectColor(this.dataset.color)"></button></td>
                        </tr>`;

        tableBasic.innerHTML += colorTable;
    });

    // Extended.
    colorExtended.forEach((item, index) => {
        let colorTable = `<tr>
                            <td>${item}</td>
                            <td><button style="background: ${hexExtended[index]};" data-color="${hexExtended[index]}" onclick="selectColor(this.dataset.color)"></button></td>
                        </tr>`;

        tableExtended.innerHTML += colorTable;
    });
};

hexInput.addEventListener("change", () => setColor(hexInput));
rgbInput.addEventListener("change", () => setColor(rgbInput));
hexCopy.addEventListener("click", () => copyText(hexInput));
rgbCopy.addEventListener("click", () => copyText(rgbInput));
saveColorButton.addEventListener("click", saveColor);
removeAllButton.addEventListener("click", removeAllColor);

document.addEventListener("DOMContentLoaded", () => {
    loadSavedColor();
    loadLastSelectedColor();
});