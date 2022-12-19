document.addEventListener("keypress", event => {if (event.code == "Space") {newColors()};});
// problem when clicking on input field changes colour.
// document.addEventListener("click", () => newColors());

var randomIndex, colorChange;
const HEX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

function newColors() {
    var rgb = [];
    rgb[0] = Math.floor(Math.random() * 256);
    rgb[1] = Math.floor(Math.random() * 256);
    rgb[2] = Math.floor(Math.random() * 256);
    // current algorithm for finding satisfying colour combos.
    var color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")" ;
    var rgbTwo = rgb.map(color => (255 - color));
    console.log(rgb, rgbTwo);
    var colorTwo = "rgb(" + rgbTwo[0] + ", " + rgbTwo[1] + ", " + rgbTwo[2] + ")" ;
    var rgbThree = similarColor(rgbTwo);
    rgbThree = similarColor(rgbThree);
    colorThree = "rgb(" + rgbThree[0] + ", " + rgbThree[1] + ", " + rgbThree[2] + ")"; 
    var rgbFour = similarColor(rgbTwo);
    rgbFour = similarColor(rgbFour);
    colorFour = "rgb(" + rgbFour[0] + ", " + rgbFour[1] + ", " + rgbFour[2] + ")";  
    // loop (repetition)
    document.getElementById("one").style.setProperty("--color", color);
    document.getElementById("hexValueOne").style.setProperty("--color", "rgb(" + invertColour(rgb) + ")");
    document.getElementById("title").style.setProperty("--color", color);
    document.getElementById("two").style.setProperty("--color", colorTwo);
    document.getElementById("hexValueTwo").style.setProperty("--color", "rgb(" + invertColour(rgbTwo) + ")");
    document.getElementById("three").style.setProperty("--color", colorThree);
    document.getElementById("hexValueThree").style.setProperty("--color", "rgb(" + invertColour(rgbThree) + ")");
    document.getElementById("save").style.setProperty("--color", colorThree);
    document.getElementById("four").style.setProperty("--color", colorFour);
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