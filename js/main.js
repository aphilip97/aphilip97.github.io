document.addEventListener('DOMContentLoaded', function () {

    var nodes = document.querySelectorAll('.overlay');
    console.log(nodes);

    var colours = [
        "#F44336",
        "#9C27B0",
        "#00BCD4",
        "#4CAF50"
    ];

    var colourCounter = 0;
    for(var i = 0; i < nodes.length; i++, colourCounter++) {
        console.log(i, colourCounter);
        nodes[i].style.backgroundColor = colours[colourCounter];
        if (colourCounter == colours.length - 1) { colourCounter = -1; }
    }

});