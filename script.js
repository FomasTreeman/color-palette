document.addEventListener("keypress", event => { if (event.code == "Space") { newColors() }; });
// problem when clicking on input field changes colour.
document.addEventListener("dblclick", (event) => changeClickedColour(event.pageX, event.pageY));

const HEXCHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
var rgb, rgbTwo, rgbThree, rgbFour;
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


var colors = localStorage.getItem('colors');
if (colors) {
    var split = colors.split(';');
    rgb = split[0].split(',');
    rgbTwo = split[1].split(',');
    rgbThree = split[2].split(',');
    rgbFour = split[3].split(',');
    setColors(rgb.map((str) => parseInt(str)), rgbTwo.map((str) => parseInt(str)), rgbThree.map((str) => parseInt(str)), rgbFour.map((str) => parseInt(str)));
}
var x = matchMedia("(max-width: 700px)")
if (x.matches) document.getElementById("title").innerText = "press me";

function randomColor() {
    // definitely can be simplified
    var rgb = [1, 2, 3];
    rgb[0] = Math.floor(Math.random() * 256);
    rgb[1] = Math.floor(Math.random() * 256);
    rgb[2] = Math.floor(Math.random() * 256);
    return rgb;
}

function newColors() {
    // order colors brigthness
    var rgb = randomColor()
    // current algorithm for finding satisfying colour combos.
    rgbTwo = invertColour(rgb);
    rgbThree = similarColor(rgbTwo);
    rgbFour = similarColor(rgbTwo);
    if (rgbThree.reduce((acc, currentValue) => acc + currentValue) == rgbFour.reduce((acc, currentValue) => acc + currentValue)) rgbFour = similarColor(rgbTwo);
    array = [rgb, rgbTwo, rgbThree, rgbFour];
    orderedIndexes = sortColors([
        { 0: rgb.reduce((acc, currentValue) => acc + currentValue) },
        { 1: rgbTwo.reduce((acc, currentValue) => acc + currentValue) },
        { 2: rgbThree.reduce((acc, currentValue) => acc + currentValue) },
        { 3: rgbFour.reduce((acc, currentValue) => acc + currentValue) }
    ]);
    // setColors(orderedIndexes.forEach((index) => {return array[index]}));
    setColors(array[orderedIndexes[0]], array[orderedIndexes[1]], array[orderedIndexes[2]], array[orderedIndexes[3]]);
    localStorage.setItem('colors', rgb + ';' + rgbTwo + ';' + rgbThree + ';' + rgbFour);
}

function sortColors(colors) {
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length - i - 1; j++) {
            if (Object.values(colors[j + 1])[0] > Object.values(colors[j])[0]) {
                [colors[j + 1], colors[j]] = [colors[j], colors[j + 1]]
            }
        }
    };
    return colors.map((object) => parseInt(Object.keys(object)[0]))
}

function changeColumn(number, colorValue) {
    let column = eval('column' + number);
    let hex = eval('hex' + number);
    let colorPicker = eval('colorPicker' + number);
    if (typeof colorValue == 'object') colorValue = getHexValue(colorValue); 
    column.style.setProperty("--color",  colorValue);
    hex.style.setProperty("--color", "rgb(" + invertColour(getRgbValue(colorValue)) + ")");
    hex.value = colorValue;
    colorPicker.value = colorValue;
}

function setColors(rgb, rgbTwo, rgbThree, rgbFour) {
    changeColumn('One', rgb);
    changeColumn('Two', rgbTwo);
    changeColumn('Three', rgbThree);
    changeColumn('Four', rgbFour);
    document.getElementById("title").style.setProperty("--color", "rgb(" + rgb + ")");
    document.getElementById("save").style.setProperty("--color", "rgb(" + rgbThree + ")");
}

function getHexValue(rgb) {
    var hexValue = "#";
    rgb.forEach(decimal => hexValue += (HEXCHARACTERS[(Math.floor(decimal / 16))]) + (HEXCHARACTERS[(decimal % 16)]));
    return hexValue;
}

function getRgbValue(hex) {
    let rgb = [];
    hex = hex.slice(1);
    for (let i = 0; i < 5; i+=2) {
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
    } else if (coord < (max / 2)) {
        columnTwo.style.setProperty("--color", "rgb(" + rgb + ")");
        hexTwo.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexTwo.value = getHexValue(rgb).toUpperCase();
    } else if (coord < ((max / 4) * 3)) {
        columnThree.style.setProperty("--color", "rgb(" + rgb + ")");
        hexThree.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexThree.value = getHexValue(rgb).toUpperCase();
    } else {
        columnFour.style.setProperty("--color", "rgb(" + rgb + ")");
        hexFour.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexFour.value = getHexValue(rgb).toUpperCase();
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
    let currentColumn = eval('column' + column);
    let currentHex = eval('hex' + column);
    let path = 'http://127.0.0.1:5500/';
    // let path = 'https://fomastreeman.github.io/color-palette/';
    console.log(currentHex.value);
    if (currentLock.src == path +'locked.png') {
        currentLock.src = path + 'unlocked.png'; 
        currentColumn.style.setProperty('background-color', 'var(--color)');
    } else {
        currentLock.src = path + 'locked.png'; 
        currentColumn.style.setProperty('background-color', currentHex.value);
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