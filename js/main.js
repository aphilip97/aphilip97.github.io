document.addEventListener('DOMContentLoaded', function () {

    var contentSegments = document.querySelectorAll('.content-segment');

    var colours = ["#111111"];

    var images = ["./images/gameOfLife.PNG"];

    var colourCounter = 0;
    for(let i = 0; i < contentSegments.length; i++, colourCounter++) {
        contentSegments[i].style.backgroundImage = `url('${images[i]}')`;
        contentSegments[i].firstElementChild.style.backgroundColor = colours[colourCounter];
        if (colourCounter == colours.length - 1) { colourCounter = -1; }
    }

});