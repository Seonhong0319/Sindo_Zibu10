let cols, rows, grid, gridSize;
const userInput = document.getElementById('userInput');

function initializeGrid() {
    gridSize = Math.max(window.innerWidth, window.innerHeight) / 50;
    cols = Math.floor(window.innerWidth / gridSize);
    rows = Math.floor(window.innerHeight / gridSize);

    const centralCols = Math.floor(cols * 0.4);
    const centralRows = Math.floor(rows * 0.4);

    grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows).fill(false);
    }
}

userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addFloatingText(userInput.value);
        userInput.value = '';
    }
});

function addFloatingText(text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;

    const position = getGridPosition();
    floatingText.style.left = position.left + 'px';
    floatingText.style.top = position.top + 'px';

    document.body.appendChild(floatingText);
    grid[position.col][position.row] = true;

    floatingText.addEventListener('animationend', () => {
        floatingText.remove();
        grid[position.col][position.row] = false;
    });
}

function getGridPosition() {
    let col, row;
    do {
        col = Math.floor(cols * 0.3 + Math.random() * (cols * 0.4));
        row = Math.floor(rows * 0.3 + Math.random() * (rows * 0.4));
    } while (grid[col][row]);

    const left = col * gridSize;
    const top = row * gridSize;

    return { left, top, col, row };
}

window.addEventListener('resize', initializeGrid);

initializeGrid();
