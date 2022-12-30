document.addEventListener("keypress", event => { if (event.code == "Space") { newColors() }; });
// problem when clicking on input field changes colour.
document.addEventListener("dblclick", (event) => changeClickedColour(event.pageX, event.pageY));

const HEXCHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
var columnOne = document.getElementById("one");
var columnTwo = document.getElementById("two");
var columnThree = document.getElementById("three");
var columnFour = document.getElementById("four");
var hexOne = document.getElementById("hexValueOne");
var hexTwo = document.getElementById("hexValueTwo");
var hexThree = document.getElementById("hexValueThree");
var hexFour = document.getElementById("hexValueFour");
var colorPickerOne = document.getElementById("colorPickerOne");
var colorPickerTwo = document.getElementById("colorPickerTwo");
var colorPickerThree = document.getElementById("colorPickerThree");
var colorPickerFour = document.getElementById("colorPickerFour");
var columnValues = { 'One': [], 'Two': [], 'Three': [], 'Four': [] };
var lockedColumns = [];
var colors = localStorage.getItem('colors');

if (colors) {
    let i = 0;
    for (column in columnValues) {
        columnValues[column] = colors.split(';')[i].split(',').map((value) => parseInt(value));
        i ++;
    }
    setColors(columnValues);
}
if (matchMedia("(max-width: 700px)").matches) document.getElementById("title").innerText = "press me";

function randomColor() {
    // definitely can be simplified
    var rgb = [];
    for (index in [0, 1, 2]) rgb[index] = Math.floor(Math.random() * 256);
    console.log(rgb);
    return rgb;
}

function newColors() {
    // current algorithm for finding satisfying colour combos.
    let unlockedColumns = Object.keys(columnValues).filter((column) => !lockedColumns.includes(column));
    // if (lockedColumns.length > 0) var newStartingColour = colors.split(';')[Object.keys(columnValues).findIndex((column) => lockedColumns[0] == column)].split(',').map((value) => parseInt(value));
    if (lockedColumns.length > 0) var newStartingColour = columnValues[lockedColumns[0]];
    if (lockedColumns.length == 0) {
        columnValues['One'] = randomColor();
        columnValues['Two'] = invertColour(columnValues['One']);
        columnValues['Three'] = similarColor(columnValues['Two']);
        columnValues['Four'] = similarColor(columnValues['Two']);
        if (columnValues['Three'].reduce((acc, currentValue) => acc + currentValue) == columnValues['Four'].reduce((acc, currentValue) => acc + currentValue)) {
            columnValues['Four'] = similarColor(columnValues['Two'])
        };
    } else if (lockedColumns.length == 1) {
        columnValues[unlockedColumns[0]] = similarColor(invertColour(newStartingColour));
        columnValues[unlockedColumns[1]] = similarColor(columnValues[unlockedColumns[0]]);
        columnValues[unlockedColumns[2]] = similarColor(columnValues[unlockedColumns[0]]);
        if (columnValues[unlockedColumns[1]].reduce((acc, currentValue) => acc + currentValue) == columnValues[unlockedColumns[2]].reduce((acc, currentValue) => acc + currentValue)) {
            columnValues[unlockedColumns[2]] = similarColor(columnValues[unlockedColumns[0]])
        };
    } else if (lockedColumns.length == 2) {
        columnValues[unlockedColumns[0]] = similarColor(newStartingColour);
        columnValues[unlockedColumns[1]] = similarColor(newStartingColour);
        if (columnValues[unlockedColumns[1]].reduce((acc, currentValue) => acc + currentValue) == columnValues[unlockedColumns[0]].reduce((acc, currentValue) => acc + currentValue)) {
            columnValues[unlockedColumns[1]] = similarColor(newStartingColour)
        };
    } else if (lockedColumns.length == 3) {
        columnValues[unlockedColumns[0]] = similarColor(newStartingColour);
    };
    // order colors brigthness
    let brightnesss = Object.values(columnValues).map((value) => {
        if (typeof value[0] != 'string') {
            return value.reduce((acc, currentValue) => acc + currentValue);
        }
    });
    let brightnessDictionary = [
        { 'One': brightnesss[0] },
        { 'Two': brightnesss[1] },
        { 'Three': brightnesss[2] },
        { 'Four': brightnesss[3] }
    ]
    // let desiredFormat = {
    //     'One': brightnesss[0],
    //     'Two': brightnesss[1],
    //     'Three': brightnesss[2],
    //     'Four': brightnesss[3]
    // }
    orderedIndexes = sortColors(brightnessDictionary);
    let listNewColors = {};
    for (object of brightnessDictionary) {
        let column = Object.keys(object)[0];
        listNewColors[column] = columnValues[column];
    }
    for (column of ['One', 'Two', 'Three', 'Four']) {
        if (typeof listNewColors[column] == 'object') listNewColors[column] = columnValues[column];
    }
    setColors(listNewColors);
    localStorage.setItem('colors', columnValues['One'] + ';' + columnValues['Two'] + ';' + columnValues['Three'] + ';' + columnValues['Four']);
};

function sortColors(colors) {
    for (let i = 0; i < colors.length; i++) {
        if (!lockedColumns.includes(colors[i])) {
            for (let j = 0; j < colors.length - i - 1; j++) {
                if (Object.values(colors[j + 1])[0] > Object.values(colors[j])[0] || !lockedColumns.includes(colors[j + 1])) {
                    [colors[j + 1], colors[j]] = [colors[j], colors[j + 1]]
                }
            }
        }
    };
    return colors.map((object) => Object.keys(object)[0]);
}

function changeColumn(number, colorValue) {
    let column = eval('column' + number);
    let hex = eval('hex' + number);
    let colorPicker = eval('colorPicker' + number);
    if (typeof colorValue == 'object') colorValue = getHexValue(colorValue);
    column.style.setProperty("--color", colorValue);
    hex.style.setProperty("--color", "rgb(" + invertColour(getRgbValue(colorValue)) + ")");
    hex.value = colorValue;
    colorPicker.value = colorValue;
    columnValues[number] = getRgbValue(colorValue);
}

function setColors(listNewColors) {
    // listNewColors.forEach((newColor) => { console.log(typeof newColor); if (typeof newColor == 'object') if (typeof newColor == 'object')Object.keys(newColor)[0], Object.values(newColor)[0]) });
    for (let newColor in listNewColors) {
        if (typeof listNewColors[newColor] == 'object') changeColumn(newColor, listNewColors[newColor]);
    }
    document.getElementById("title").style.setProperty("--color", "rgb(" + columnValues['One'] + ")");
    document.getElementById("save").style.setProperty("--color", "rgb(" + columnValues['Three'] + ")");
}

function getHexValue(rgb) {
    var hexValue = "#";
    rgb.forEach(decimal => hexValue += (HEXCHARACTERS[(Math.floor(decimal / 16))]) + (HEXCHARACTERS[(decimal % 16)]));
    return hexValue;
}

function getRgbValue(hex) {
    let rgb = [];
    hex = hex.slice(1);
    for (let i = 0; i < 5; i += 2) {
        rgb.push(((HEXCHARACTERS.findIndex((char) => char == hex[i].toUpperCase()) * 16) + HEXCHARACTERS.findIndex((char) => char == hex[i + 1].toUpperCase())));
    }
    return rgb;
}

function similarColor(rgb) {
    var colorChange = Math.floor(Math.random() * 125 + 70);
    var negOrPos = Math.random() < 0.5 ? -1 : 1;
    colorChange *= negOrPos;
    var randomIndex = Math.floor(Math.random() * 3);
    var tempRgb = rgb.map(x => x);
    if ((rgb[randomIndex] + colorChange) < 0) {
        tempRgb[randomIndex] = 0;
    } else if ((rgb[randomIndex] + colorChange) > 255) {
        tempRgb[randomIndex] = 255;
    } else {
        tempRgb[randomIndex] += colorChange;
    }
    return tempRgb;
}

function updateColour(number) {
    let hex = document.getElementById("hexValue" + number)
    let column = document.getElementById(number.toLowerCase())
    validateHex(hex.value) ? column.style.setProperty("--color", hex.value) : hex.value = getHexValue(localStorage.getItem('colors').split(';')[0].split(','));
}

function invertColour(rgb) {
    return rgb.map(colour => (255 - colour));
}

// click section to change its colour
function changeClickedColour(xCoord, yCoord) {
    console.log(xCoord, yCoord)
    var rgb = randomColor();
    var coord;
    if (matchMedia("(max-width: 700px)").matches) {
        coord = yCoord
        max = document.documentElement.clientHeight;
    } else {
        coord = xCoord;
        max = document.documentElement.clientWidth;
    }

    if (coord < (max / 4)) {
        columnOne.style.setProperty("--color", "rgb(" + rgb + ")");
        hexOne.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexOne.value = getHexValue(rgb).toUpperCase();
        columnValues['One'] = rgb;
    } else if (coord < (max / 2)) {
        columnTwo.style.setProperty("--color", "rgb(" + rgb + ")");
        hexTwo.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexTwo.value = getHexValue(rgb).toUpperCase();
        columnValues['Two'] = rgb;
    } else if (coord < ((max / 4) * 3)) {
        columnThree.style.setProperty("--color", "rgb(" + rgb + ")");
        hexThree.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexThree.value = getHexValue(rgb).toUpperCase();
        columnValues['Three'] = rgb;
    } else {
        columnFour.style.setProperty("--color", "rgb(" + rgb + ")");
        hexFour.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexFour.value = getHexValue(rgb).toUpperCase();
        columnValues['Four'] = rgb;
    }
}

function validateHex(hex) {
    if (hex.length != 7) return false;
    for (var char of hex.substring(1)) {
        if (!HEXCHARACTERS.some((possibleChar) => char.toUpperCase() === possibleChar)) { console.log("fail"); return false };
    }
    return true;
}

function lockColor(column) {
    let currentLock = eval('lock' + column);
    // let currentColumn = eval('column' + column);
    // let currentHex = eval('hex' + column);
    let path = 'http://127.0.0.1:5500/';
    // let path = 'https://fomastreeman.github.io/color-palette/';
    if (currentLock.src == path + 'locked.png') {
        currentLock.src = path + 'unlocked.png';
        lockedColumns = lockedColumns.filter((item) => item != column);
        // currentColumn.style.setProperty('background-color', 'var(--color)');
    } else {
        currentLock.src = path + 'locked.png';
        lockedColumns.push(column);
        // currentColumn.style.setProperty('background-color', currentHex.value);
    }
}

// copied. so i annotate to show understanding
// coudl be simplified by using a tag instead of button 
function exportToJsonFile(jsonData) {
    // turn object into string
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let linkElement = document.createElement('a');
    // the file to install
    linkElement.setAttribute('href', dataUri);
    // download attribute specifies the href will be downloaded not be a new file to jump to
    linkElement.setAttribute('download', "data.json");
    // clicks this element so the user doesnt need to do anything else
    linkElement.click();
}