// Color List.
let openedBefore = false;

const colorNamesJSON = "assets/css-color-names.json";

const tableBasic = document.querySelector(".__basic-colors table");
const tableExtended = document.querySelector(".__extended-colors table");
const showButton = document.querySelector(".__show-button");

function generateColorList(data) {
    let colorBasic = Object.keys(data.basic);
    let hexBasic = Object.values(data.basic);

    let colorExtended = Object.keys(data.extended);
    let hexExtended = Object.values(data.extended);

    // Basic.
    colorBasic.forEach((item, index) => {
        let colorTable = `<tr>
                            <td>${item}</td>
                            <td><button style="background: ${hexBasic[index]};" aria-label="${item}" data-color="${hexBasic[index]}" onclick="selectColor(this.dataset.color)"></button></td>
                        </tr>`;

        tableBasic.innerHTML += colorTable;
    });

    // Extended.
    colorExtended.forEach((item, index) => {
        let colorTable = `<tr>
                            <td>${item}</td>
                            <td><button style="background: ${hexExtended[index]};" aria-label="${item}" data-color="${hexExtended[index]}" onclick="selectColor(this.dataset.color)"></button></td>
                        </tr>`;

        tableExtended.innerHTML += colorTable;
    });
};

function showList() {
    document.querySelector(".__basic-colors").classList.toggle("hidden_");
    document.querySelector(".__extended-colors").classList.toggle("hidden_");

    showButton.innerText = showButton.innerText == 'Show' ? 'Hide' : 'Show';

    if (!openedBefore) {
        openedBefore = true;

        fetch(colorNamesJSON)
            .then(response => response.json())
            .then(data => generateColorList(data))
            .catch(err => {
                tableBasic.innerHTML = err;
                tableExtended.innerHTML = err;
        });
    };
};

showButton.addEventListener("click", showList);