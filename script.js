document.addEventListener("keypress", event => { if (event.code == "Space") { newColors() }; });
// problem when clicking on input field changes colour.
document.addEventListener("dblclick", (event) => changeSpecificColour(event.pageX));

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


var colors = localStorage.getItem('colors');
if (colors) {
    var split = colors.split(';');
    rgb = split[0].split(',');
    rgbTwo = split[1].split(',');
    rgbThree = split[2].split(',');
    rgbFour = split[3].split(',');
    setColors(rgb.map((str) => parseInt(str)), rgbTwo.map((str) => parseInt(str)), rgbThree.map((str) => parseInt(str)), rgbFour.map((str) => parseInt(str)));
}

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
    rgbTwo = rgb.map(color => (255 - color));
    rgbThree = similarColor(rgbTwo);
    rgbThree = similarColor(rgbThree);
    rgbFour = similarColor(rgbTwo);
    rgbFour = similarColor(rgbFour);
    array = [rgb, rgbTwo, rgbThree, rgbFour];
    orderedIndexes = sortColors([
        {0: rgb.reduce((acc, currentValue) => acc + currentValue)}, 
        {1: rgbTwo.reduce((acc, currentValue) => acc + currentValue)}, 
        {2: rgbThree.reduce((acc, currentValue) => acc + currentValue)}, 
        {3: rgbFour.reduce((acc, currentValue) => acc + currentValue)}
    ]);
    // setColors(orderedIndexes.forEach((index) => {return array[index]}));
    setColors(array[orderedIndexes[0]], array[orderedIndexes[1]], array[orderedIndexes[2]], array[orderedIndexes[3]]);
    localStorage.setItem('colors', rgb + ';' + rgbTwo + ';' + rgbThree + ';' + rgbFour);
}

function sortColors(colors) {
    for(let i = 0; i < colors.length; i++){
            for(let j = 0; j < colors.length - i - 1; j++){
            if(Object.values(colors[j + 1])[0] > Object.values(colors[j])[0] ){
                    [colors[j + 1],colors[j]] = [colors[j],colors[j + 1]]
            }
        }
    };
    return colors.map((object) => parseInt(Object.keys(object)[0]))
}

function setColors(rgb, rgbTwo, rgbThree, rgbFour) {
     columnOne.style.setProperty("--color", "rgb(" + rgb + ")");
    hexOne.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    hexOne.value = getHexValue(rgb);
    document.getElementById("title").style.setProperty("--color", "rgb(" + rgb + ")");
    columnTwo.style.setProperty("--color", "rgb(" + rgbTwo + ")");
    hexTwo.style.setProperty("--color", "rgb(" + invertColour(rgbTwo) + ")");
    hexTwo.value = getHexValue(rgbTwo);
    columnThree.style.setProperty("--color", "rgb(" + rgbThree + ")");
    hexThree.style.setProperty("--color", "rgb(" + invertColour(rgbThree) + ")");
    hexThree.value = getHexValue(rgbThree);
    document.getElementById("save").style.setProperty("--color", "rgb(" + rgbThree + ")");
    columnFour.style.setProperty("--color", "rgb(" + rgbFour + ")");
    hexFour.style.setProperty("--color", "rgb(" + invertColour(rgbFour) + ")");
    hexFour.value = getHexValue(rgbFour);
}

function getHexValue(rgb) {
    var hexValue = "#";
    rgb.forEach(decimal => hexValue += (HEXCHARACTERS[(Math.floor(decimal / 16))]) + (HEXCHARACTERS[(decimal % 16)]));
    return hexValue;
}

function similarColor(rgb) {
    var colorChange = Math.floor(Math.random() * 91 + 31);
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
    console.log(hex.value);
    validateHex(hex.value) ? column.style.setProperty("--color", hex.value) : hex.value = getHexValue(localStorage.getItem('colors').split(';')[0].split(','));
}

function invertColour(rgb) {
    return rgb.map(colour => (255 - colour));
}

// click section to change its colour
function changeSpecificColour(xCoord) {
    windowWidth = document.documentElement.clientWidth;
    var rgb = randomColor();

    if (xCoord < (windowWidth / 4)) {
        columnOne.style.setProperty("--color", "rgb(" + rgb + ")");
        hexOne.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexOne.value = getHexValue(rgb).toUpperCase();
    } else if (xCoord < (windowWidth / 2)) {
        columnTwo.style.setProperty("--color", "rgb(" + rgb + ")");
        hexTwo.style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
        hexTwo.value = getHexValue(rgb).toUpperCase();
    } else if (xCoord < ((windowWidth / 4) * 3)) {
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
    if (hex.length != 7 ) return false;
    for (var char of hex.substring(1)) {
        if (!HEXCHARACTERS.some((possibleChar) => char.toUpperCase() === possibleChar)) {console.log("fail"); return false};
    }
    return true; 
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