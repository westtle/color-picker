let savedColorList = [];
let colorHold = "#d35252";

const html = {
    selectedColor: document.querySelector(".col"),
    resultColor: {
        hex: document.querySelector(".result-color__hex span"),
        rgb: document.querySelectorAll(".result-color__rgb .fade") // NodeList.
    },
    fullValue: {
        rgb: document.querySelectorAll(".copy-value")[0]
    },
    copy: {
        copyHex: document.querySelector(".copy-hex"),
        copyHexButton: document.querySelectorAll("button")[0],

        copyRgb: document.querySelector(".copy-rgb"),
        copyRgbButton: document.querySelectorAll("button")[1]
    },
    savedColorContainer: document.querySelector(".result-color__saved"),
    extraButton: {
        saveColor: document.querySelector(".save-color"),
        removeAllColor: document.querySelector(".remove-all-color")
    }
};

class ColorPicker {
    constructor(color) {
        this.color = color;
    }
};

// colorjoe.
const joe = colorjoe.rgb(document.querySelector(".colorjoe-color-picker"), "red");

joe.on("change", color => {

    colorHold = color.hex();

    // Update Selected Color & Hex Value.
    html.selectedColor.style.background = color.hex();
    html.resultColor.hex.innerText = color.hex();
    html.copy.copyHex.innerText = color.hex();

    // Update RGB.
    const rgbValue = color.css().replace("rgb(", "").slice(0, -1).split(",");
    html.resultColor.rgb[0].innerText = rgbValue[0];
    html.resultColor.rgb[1].innerText = rgbValue[1];
    html.resultColor.rgb[2].innerText = rgbValue[2];

    html.fullValue.rgb.innerText = `rgb(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]})`;
    html.copy.copyRgb.innerText = `rgb(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]})`;

    storage.saveLastSelectedColor();

});

// Extra Function.

const extraFunction = {
    saveColor: function saveColor() {
        const colorToSave = new ColorPicker(colorHold);

        const colorSaved = `<span style="background: ${colorHold}" onclick="extraFunction.chooseColor(this)" oncontextmenu="extraFunction.removeColor(this)"></span>`;

        const isDuplicate = savedColorList.some(obj => obj.color === colorHold);
        if (isDuplicate) {
            return;
        };

        if (html.savedColorContainer.innerText == "Empty.") {
            html.savedColorContainer.innerText = "";
        };

        html.savedColorContainer.innerHTML += colorSaved;

        savedColorList.push(colorToSave);
        storage.saveSavedColor();
    },
    removeColor: function removeColor(element) {      /* The code below is obviously not mine. */
        const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
    
        const clickedElement = element;
        const colorElement = rgba2hex(clickedElement.style.background);

        // Remove From Array.
        for (let i = 0; i <= savedColorList.length; i++) {
            if (savedColorList[i].color == colorElement) {
                savedColorList.splice(i, 1);
                break;
            };
        };

        clickedElement.remove();

        if (html.savedColorContainer.childElementCount == 0) {
            html.savedColorContainer.innerText = "Empty."
        };

        storage.saveSavedColor();
    },
    removeAllColor: function removeAllColor() {
        html.savedColorContainer.innerText = "Empty."
        savedColorList = [];

        storage.saveSavedColor();
    },
    chooseColor: function chooseColor(element) {
        const clickedElement = element;
        const colorElement = clickedElement.style.background;

        joe.set(colorElement);
    },
    copyButton: {
        copyHex: function copyHex() {
            const copied = document.querySelector(".copied-hex");
            navigator.clipboard.writeText(html.resultColor.hex.innerText);

            copied.style.display = "inline";
            setTimeout(() => copied.style.display = "none", 1000);
        },
        copyRgb: function copyRgb() {
            const copied = document.querySelector(".copied-rgb");
            navigator.clipboard.writeText(html.fullValue.rgb.innerText);

            copied.style.display = "inline";
            setTimeout(() => copied.style.display = "none", 1000);
        }
    }
};

html.copy.copyHexButton.addEventListener("click", extraFunction.copyButton.copyHex);
html.copy.copyRgbButton.addEventListener("click", extraFunction.copyButton.copyRgb);

html.extraButton.saveColor.addEventListener("click", extraFunction.saveColor);
html.extraButton.removeAllColor.addEventListener("dblclick", extraFunction.removeAllColor);

// Local Storage.

const storageKey = "Saved_Color";
const storageKeyTwo = "Last_Selected_Color"

const storage = {
    saveSavedColor: function saveSavedColor() {
        const storageItem = JSON.stringify(savedColorList)
        localStorage.setItem(storageKey, storageItem);
    },
    loadSavedColor: function loadSavedColor() {
        const storageGet = localStorage.getItem(storageKey);
        let storageParsed = JSON.parse(storageGet);

        for (let i = 0; i < storageParsed.length; i++) {
            let colorLoaded = storageParsed[i].color;
            const colorToLoad = new ColorPicker(colorLoaded);
            savedColorList.push(colorToLoad)
        };

        if (savedColorList.length == 0) {
            html.savedColorContainer.innerText = "Empty.";
        } else {
            html.savedColorContainer.innerText = ""
        };

        // Renderer.
        for (let i = 0; i < storageParsed.length; i++) {
            let loadhtml = `<span style="background: ${storageParsed[i].color}" onclick="extraFunction.chooseColor(this)" oncontextmenu="extraFunction.removeColor(this)"></span>`;
            html.savedColorContainer.innerHTML += loadhtml;
        };
    },
    saveLastSelectedColor: function saveLastSelectedColor() {
        const lastSelectedColor = colorHold;
        localStorage.setItem(storageKeyTwo, lastSelectedColor);
    },
    loadLastSelectedColor: function loadLastSelectedColor() {
        const lastSelectedColorGet = localStorage.getItem(storageKeyTwo);
        joe.set(lastSelectedColorGet);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    storage.loadSavedColor();
    storage.loadLastSelectedColor();
});

// Color List.

const jsonColor = "assets/css-color-names.json";

const tableBasicColor = document.querySelector(".color-list__basic");
const tableExtendedColor = document.querySelector(".color-list__extended");

fetch(jsonColor)
    .then(response => response.json())
    .then(generateColorList)
    .catch(err => {
        tableBasicColor.innerHTML = "Failed to fetch."
        tableExtendedColor.innerHTML = "Failed to fetch."

        console.error(err)
});

function generateColorList(data) {
    let colorBasic = Object.keys(data.basic);
    let hexBasic = Object.values(data.basic);

    let colorExtended = Object.keys(data.extended);
    let hexExtended = Object.values(data.extended);

    // Basic.
    for (let i = 0; i < colorBasic.length; i++) {
        let colorBas = colorBasic[i];
        let hexBas = hexBasic[i];
        let rgbBas = hexToRgb(hexBas).rgb;

        let colorTable = `<tr>
                            <td>${colorBas}</td>
                            <td>${hexBas}</td>
                            <td>${rgbBas}</td>
                            <td><button style="background: ${hexBas};" onclick="extraFunction.chooseColor(this)"></button></td>
                        </tr>`;

        tableBasicColor.innerHTML += colorTable;
    };

    // Extended.
    for (let i = 0; i < colorExtended.length; i++) {
        let colorExtend = colorExtended[i];
        let hexExtend = hexExtended[i];
        let rgbExtend = hexToRgb(hexExtend).rgb;

        let colorTable = `<tr>
                            <td>${colorExtend}</td>
                            <td>${hexExtend}</td>
                            <td>${rgbExtend}</td>
                            <td><button style="background: ${hexExtend};" onclick="extraFunction.chooseColor(this)"></button></td>
                        </tr>`;

        tableExtendedColor.innerHTML += colorTable;
    };
};

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        rgb: `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    } : null;
};