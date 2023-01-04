let savedColor = [];
let currentColor = "#ff0000";

// HTML.
const selectedColorShowcase = document.querySelector(".__selected-color span");

const hexInput = document.querySelector("._hex input");
const rgbInput = document.querySelector("._rgb input");

const hexCopy = document.querySelector("._hex .copy_");
const rgbCopy = document.querySelector("._rgb .copy_");

const savedColorList = document.querySelector("._list");
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

function copyColor(colorCode) {
    colorCode.select();
    colorCode.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(colorCode.value);
};

function saveColor() {
    const colorToSave = `<span style="background: ${currentColor}" data-color="${currentColor}" onclick="selectSavedColor(this.dataset.color)" oncontextmenu="removeColor(this.dataset.color, this)"></span>`;

    const isDuplicate = savedColor.some((value, index) => value == currentColor);
    if (isDuplicate) return;

    if (savedColorList.innerText == "Empty.") {
        savedColorList.innerText = "";
        savedColorList.style.justifyContent = "flex-start";
    };

    savedColorList.innerHTML += colorToSave;

    savedColor.push(currentColor);
    saveSavedColor();
};

function selectSavedColor(color) {
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
        savedColorList.innerText = "Empty.";
        savedColorList.style.justifyContent = "center";
    };

    saveSavedColor();
};

function removeAllColor() {
    savedColorList.innerText = "Empty.";
    savedColorList.style.justifyContent = "center";
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
        savedColorList.innerText = "Empty.";
    } else {
        savedColorList.innerText = "";
        savedColorList.style.justifyContent = "flex-start";
    };

    // Renderer.
    savedColor.forEach((item, index) => {
        const toLoad = `<span style="background: ${item}" data-color="${item}" onclick="selectSavedColor(this.dataset.color)" oncontextmenu="removeColor(this.dataset.color, this)"></span>`;
        savedColorList.innerHTML += toLoad;
    });
};

function saveLastSelectedColor() {
    localStorage.setItem(lastSelectedColor, currentColor);
};

function loadLastSelectedColor() {
    const selectedLastTime = localStorage.getItem(lastSelectedColor) || "#ff0000";
    joe.set(selectedLastTime);
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