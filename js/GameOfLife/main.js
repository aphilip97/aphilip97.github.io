import Matrix from './Matrix.js';
import Timer from './Timer.js';

document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');

    // canvas.width and canvas.height are the height and width of the drawing area
    // use canvas.clientWidth and canvas.clientHeight to get the width and height of the canvas ELEMENT

    const cellSize = 12;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.width / cellSize);

    const WIDTH = cols * cellSize;
    canvas.width = cols * cellSize;
    const HEIGHT = cols * cellSize;
    canvas.height = rows * cellSize;

    var paused = true;
    var displayGrid = true;
    var genCount = 0;
    var genCountDisplay = document.querySelector('#gen-count');
    var gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#434343');
    // gradient.addColorStop(0.5, '#203a43');
    gradient.addColorStop(1, '#000000');

    var grid = new Matrix(cols, rows);
    var next = new Matrix(cols, rows);

    function clear() {
        paused = true;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = 0;
            }
        }
        update();
        genCount = 0;
        genCountDisplay.innerHTML = `Generations : ${genCount}`;
    }

    function countNeighbours(grid, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + cols) % cols;
                let row = (y + j + rows) % rows;
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
    }

    function draw() {
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillRect(
                        i * cellSize,
                        j * cellSize,
                        displayGrid ? cellSize - 1 : cellSize,
                        displayGrid ? cellSize - 1 : cellSize
                    );
                }
            }
        }
    }

    function fillRandom() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
            }
        }
    }

    function setup() {
        fillRandom();
    }

    function update() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbours = countNeighbours(grid, i, j);
                if (state === 0 && neighbours === 3) {
                    next[i][j] = 1;
                } else if (state === 1 && (neighbours < 2 || neighbours > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        var swap = new Matrix(cols, rows);
        swap = grid;
        grid = next;
        next = swap;
        genCount++;
        genCountDisplay.innerHTML = `Generations : ${genCount}`;
    }

    setup();
    draw();

    const timer = new Timer(1 / 10);
    timer.update = function () {
        if (!paused) {
            update();
        }
        draw();
    };

    timer.start();

    document.addEventListener('keydown', event => {
        if (event.keyCode === 80) {
            paused = !paused;
            timer.start();
        } else if (event.keyCode === 83) {
            update();
        } else if (event.keyCode === 67) {
            clear();
        } else if (event.keyCode === 71) {
            displayGrid = !displayGrid;
        }
    });

    document.addEventListener('mousedown', event => {
        let gridX = (window.innerWidth - WIDTH) / 2;
        let gridY = (window.innerHeight - HEIGHT) / 2;
        // var rect = canvas.getBoundingClientRect();
        // console.log(rect.top, rect.right, rect.bottom, rect.left);
        if (
            event.clientX < gridX ||
            event.clientX > gridX + WIDTH ||
            event.clientY < gridY ||
            event.clientY > gridY + HEIGHT
        ) {
            return;
        }
        let x = Math.floor((event.clientX - gridX) / cellSize);
        let y = Math.floor((event.clientY - gridY) / cellSize);
        if (grid[x][y] === 0) {
            grid[x][y] = 1;
        } else {
            grid[x][y] = 0;
        }
    });
});
