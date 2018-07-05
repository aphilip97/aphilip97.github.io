document.addEventListener('DOMContentLoaded', function () {
    var contentWrapper = document.querySelector('.content-wrapper');
    var contentSegments = document.querySelectorAll('.content-segment');
    var colours = ['#bdc3c7', '#ffffff'];
    var images = ['./images/gameOfLife.PNG'];
    var colourCounter = 0;

    contentWrapper.style.height = 530 * contentSegments.length + 'px';

    for (let i = 0; i < contentSegments.length; i++) {
        contentSegments[i].style.height = (contentWrapper.offsetHeight / contentSegments.length) - 30 + 'px';
    }


    for (let i = 0; i < contentSegments.length; i++ , colourCounter++) {
        contentSegments[i].style.backgroundImage = `url('${images[i]}')`;
        contentSegments[i].firstElementChild.style.backgroundColor =
            colours[colourCounter];
        if (colourCounter == colours.length - 1) {
            colourCounter = -1;
        }
    }
});