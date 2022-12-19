document.addEventListener("keypress", event => { if (event.code == "Space") { newColors() }; });
// problem when clicking on input field changes colour.
document.addEventListener("click", (event) => changeSpecificColour(event.pageX));
var randomIndex, colorChange;
var rgb, rgbTwo, rgbThree, rgbFour;

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
    var rgb = [1, 2, 3];
    rgb[0] = Math.floor(Math.random() * 256);
    rgb[1] = Math.floor(Math.random() * 256);
    rgb[2] = Math.floor(Math.random() * 256);
    return rgb;
}

function newColors() {
    var rgb = randomColor()
    // current algorithm for finding satisfying colour combos.
    rgbTwo = rgb.map(color => (255 - color));
    rgbThree = similarColor(rgbTwo);
    rgbThree = similarColor(rgbThree);
    rgbFour = similarColor(rgbTwo);
    rgbFour = similarColor(rgbFour);
    setColors(rgb, rgbTwo, rgbThree, rgbFour);
    localStorage.setItem('colors', rgb + ';' + rgbTwo + ';' + rgbThree + ';' + rgbFour);
}

function setColors(rgb, rgbTwo, rgbThree, rgbFour) {
    document.getElementById("one").style.setProperty("--color", "rgb(" + rgb + ")");
    document.getElementById("hexValueOne").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    document.getElementById("title").style.setProperty("--color", "rgb(" + rgb + ")");
    document.getElementById("two").style.setProperty("--color", "rgb(" + rgbTwo + ")");
    document.getElementById("hexValueTwo").style.setProperty("--color", "rgb(" + invertColour(rgbTwo) + ")");
    document.getElementById("three").style.setProperty("--color", "rgb(" + rgbThree + ")");
    document.getElementById("hexValueThree").style.setProperty("--color", "rgb(" + invertColour(rgbThree) + ")");
    document.getElementById("save").style.setProperty("--color", "rgb(" + rgbThree + ")");
    document.getElementById("four").style.setProperty("--color", "rgb(" + rgbFour + ")");
    document.getElementById("hexValueFour").style.setProperty("--color", "rgb(" + invertColour(rgbFour) + ")");
}

function similarColor(rgb) {
    colorChange = Math.floor(Math.random() * 91 + 31);
    var negOrPos = Math.random() < 0.5 ? -1 : 1;
    colorChange *= negOrPos;
    randomIndex = Math.floor(Math.random() * 3);
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
    document.getElementById(number.toLowerCase()).style.setProperty("--color", document.getElementById("hexValue" + number).value);
}

function invertColour(rgb) {
    return rgb.map(colour => (255 - colour));
}

// click section to change its colour
function changeSpecificColour(xCoord) {
    windowWidth = document.documentElement.clientWidth;
    var rgb = randomColor(); 
    if (xCoord < (windowWidth / 4)) {
        document.getElementById("one").style.setProperty("--color", "rgb(" + rgb + ")");
        document.getElementById("hexValueOne").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    } else if (xCoord < (windowWidth / 2)) {
        document.getElementById("two").style.setProperty("--color", "rgb(" + rgb + ")");
        document.getElementById("hexValueTwo").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    } else if (xCoord < ((windowWidth / 4) * 3)) {
        document.getElementById("three").style.setProperty("--color", "rgb(" + rgb + ")");
        document.getElementById("hexValueThree").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    } else {
        document.getElementById("four").style.setProperty("--color", "rgb(" + rgb + ")");
        document.getElementById("hexValueFour").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    }
}

// function download() {
//     var FileSaver = require(file-saver);
//     // const link = document.createElement("a");
//     const file = new Blob([rgb, ',', rgbTwo, ',',  rgbThree, ',',  rgbFour], { type: 'text/plain' });
//     // link.href = URL.createObjectURL(file);
//     // link.download = "sample.txt";
//     // link.click();
//     // URL.revokeObjectURL(link.href);
//     FileSaver.saveAs(file, "colors.txt");
// }