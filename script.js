document.addEventListener("keypress", event => {if (event.code == "Space") {newColors()};});
document.addEventListener("click", () => newColors());

var randomIndex, colorChange;

function newColors() {
    var rgb = [];
    rgb[0] = Math.floor(Math.random() * 256);
    rgb[1] = Math.floor(Math.random() * 256);
    rgb[2] = Math.floor(Math.random() * 256);
    var color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")" ;
    document.getElementById("one").style.setProperty("--color", color);
    document.getElementById("title").style.setProperty("--color", color);
    rgb.forEach((color, index) => {rgb[index] = 255 - color});
    var colorTwo = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")" ;
    document.getElementById("two").style.setProperty("--color", colorTwo);
    var tempRgb = similarColor(rgb);
    tempRgb = similarColor(tempRgb);
    colorThree = "rgb(" + tempRgb[0] + ", " + tempRgb[1] + ", " + tempRgb[2] + ")"; 
    document.getElementById("three").style.setProperty("--color", colorThree);
    tempRgb = similarColor(rgb);
    tempRgb = similarColor(tempRgb);
    colorFour = "rgb(" + tempRgb[0] + ", " + tempRgb[1] + ", " + tempRgb[2] + ")";  
    document.getElementById("four").style.setProperty("--color", colorFour);
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