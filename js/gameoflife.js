class Matrix {
  constructor(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }
}

class Timer {
  constructor(deltaTime = 1 / 60) {
    let accumulatedTime = 0;
    let lastTime = 0;

    this.updateProxy = time => {
      accumulatedTime += (time - lastTime) / 1000;

      if (accumulatedTime > 1) {
        accumulatedTime = 1;
      }

      while (accumulatedTime > deltaTime) {
        this.update(deltaTime);
        accumulatedTime -= deltaTime;
      }

      lastTime = time;

      this.enqueue();
    };
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.enqueue();
  }
}

document.addEventListener('DOMContentLoaded', function(DOMEvent) {
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');

  const cellSize = 12 + 1;
  const cols = 64;
  const rows = 64;
  const WIDTH = (canvas.width = cols * cellSize);
  const HEIGHT = (canvas.height = rows * cellSize);

  var paused = true;
  var displayGrid = true;
  var genCount = 0;
  var genCountDisplay = document.querySelector('#gen-count');
  var gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#bdc3c7');
  gradient.addColorStop(1, '#2c3e50');

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

  const timer = new Timer(1 / 60);
  timer.update = function() {
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
