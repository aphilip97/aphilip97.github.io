document.addEventListener('DOMContentLoaded', function () {

    var contentSegments = document.querySelectorAll('.content-segment');

    var colours = [
        "#616161",
        "#9C27B0",
        "#F44336",
        "#1565C0"
    ];

    var images = [
        "./images/logo.svg",
        "./images/logo.svg",
        "./images/logo.svg",
        "./images/logo.svg"
    ];

    var colourCounter = 0;
    for(let i = 0; i < contentSegments.length; i++, colourCounter++) {
        contentSegments[i].style.backgroundImage = `url('${images[i]}')`;
        contentSegments[i].firstElementChild.style.backgroundColor = colours[colourCounter];
        if (colourCounter == colours.length - 1) { colourCounter = -1; }
    }

});