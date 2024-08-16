let cols, rows, grid, gridSize;
const userInput = document.getElementById('userInput');
const allTexts = []; // 화면에 표시된 모든 텍스트를 저장
const bottomPadding = 380; // 하단 침범 금지 영역의 높이
const sidePadding = 20; // 측면 여백을 추가

// 금지된 욕설 및 비속어 목록
const forbiddenWords = ["씨발", "지랄", "좆", "섹스", "섹1스", "야스", "ㅅㅅ", "씨1발", "씨2발", "지1랄", "지2랄", "애미", "애1미", "느금", "개새", "씹", "ㅅㅂ", "ㅄ", "ㅂㅅ", "tq", "qt", "승천", "하기싫", "오기싫"];

function initializeGrid() {
    gridSize = Math.max(window.innerWidth, window.innerHeight) / 50;
    cols = Math.floor(window.innerWidth / gridSize);
    rows = Math.floor(window.innerHeight / gridSize);

    grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows).fill(false);
    }
}

userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        const inputValue = userInput.value.trim();
        if (inputValue === "") {
            return;
        }

        if (containsForbiddenWords(inputValue)) {
            showToast("욕설 및 비속어는 금지입니다");
        } else {
            addFloatingText(inputValue);
        }
        
        userInput.value = '';
    }
});

// 욕설 및 비속어 필터링 함수
function containsForbiddenWords(text) {
    return forbiddenWords.some(word => text.includes(word.trim()));
}

// 토스트 메시지 표시 함수
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade');
    }, 2000);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function addFloatingText(text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;

    const position = getNonOverlappingPosition(floatingText);
    floatingText.style.left = position.left + 'px';
    floatingText.style.top = position.top + 'px';

    document.body.appendChild(floatingText);
    allTexts.push(floatingText); // 추가된 텍스트를 배열에 저장

    floatingText.addEventListener('animationend', () => {
        floatingText.remove();
        const index = allTexts.indexOf(floatingText);
        if (index !== -1) {
            allTexts.splice(index, 1);
        }
    });
}

function getNonOverlappingPosition(element) {
    let left, top, overlap;
    const maxAttempts = 100; // 위치를 찾는 최대 시도 횟수
    let attempts = 0;

    const inputRect = userInput.getBoundingClientRect(); // userInput의 위치 및 크기
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    do {
        // 텍스트의 위치가 화면 가장자리에 나타나지 않도록 조정
        left = Math.floor(Math.random() * (viewportWidth - element.offsetWidth - sidePadding * 2)) + sidePadding;
        top = Math.floor(Math.random() * (viewportHeight - element.offsetHeight - bottomPadding - sidePadding)) + sidePadding;

        const elementRect = {
            left: left,
            top: top,
            right: left + element.offsetWidth,
            bottom: top + element.offsetHeight
        };

        overlap = allTexts.some(existingText => isOverlapping(elementRect, existingText.getBoundingClientRect())) ||
                  isOverlapping(elementRect, inputRect);

        attempts++;
    } while (overlap && attempts < maxAttempts);

    if (attempts === maxAttempts) {
        console.warn("Failed to find a non-overlapping position after many attempts");
    }

    return { left, top };
}

function isOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

window.addEventListener('resize', initializeGrid);

initializeGrid();
