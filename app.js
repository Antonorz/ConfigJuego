const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const beyonce = document.getElementById("beyonce");
const audio = document.querySelector("audio");

const speedSlider = document.getElementById("speed-slider");
const themeToggle = document.getElementById("theme-toggle");
const pauseButton = document.getElementById("pause-button");
const timerDisplay = document.getElementById("timer-display");

let playerSpeed = 35;
let beyonceSpeed = 2;
let isPlaying = true;
let timeLeft = 60;
let playerPosition = { x: 0, y: 0 };
let beyoncePosition = { x: 300, y: 300 };

speedSlider.addEventListener("input", () => {
    const speed = Number(speedSlider.value);
    playerSpeed = speed;
    beyonceSpeed = speed / 10;
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("bg-light");
    document.body.classList.toggle("bg-dark");
    gameArea.classList.toggle("bg-white");
    gameArea.classList.toggle("bg-secondary");
    // Corrige el estilo del label para que sea visible
    document.querySelector("label[for='speed-slider']").classList.toggle("text-white");
});

pauseButton.addEventListener("click", () => {
    isPlaying = !isPlaying;
    pauseButton.textContent = isPlaying ? "Pausar" : "Reanudar";
    if (isPlaying) {
        audio.play();
        gameLoop();
    } else {
        audio.pause();
    }
});

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = `Tiempo restante: ${timeLeft}s`;
    } else {
        alert("¡Tiempo agotado! Reiniciando el juego...");
        resetGame();
    }
}

function resetGame() {
    isPlaying = true;
    timeLeft = 60;
    playerPosition = { x: 0, y: 0 };
    beyoncePosition = { x: 300, y: 300 };
    updatePosition();
    audio.play();
    gameLoop();
}

function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x);
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y);

    if (deltaX <= 50 && deltaY <= 50) {
        if (confirm("¡Beyoncé te atrapó! Dale las gracias para salvarte.")) {
            playerPosition.x = Math.floor(Math.random() * (gameArea.clientWidth - 70));
            playerPosition.y = Math.floor(Math.random() * (gameArea.clientHeight - 70));
        } else {
            alert("Perdiste 😔");
            isPlaying = false;
            audio.pause();
        }
    }
}

function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}

function moveBeyonce() {
    if (beyoncePosition.x < playerPosition.x) beyoncePosition.x += beyonceSpeed;
    else if (beyoncePosition.x > playerPosition.x) beyoncePosition.x -= beyonceSpeed;

    if (beyoncePosition.y < playerPosition.y) beyoncePosition.y += beyonceSpeed;
    else if (beyoncePosition.y > playerPosition.y) beyoncePosition.y -= beyonceSpeed;

    updatePosition();
    if (isPlaying) detectCollision();
}

function movePlayer(event) {
    switch (event.key) {
        case "ArrowUp":
            if (playerPosition.y >= 25) playerPosition.y -= playerSpeed;
            break;
        case "ArrowDown":
            if (playerPosition.y < gameArea.clientHeight - 70) playerPosition.y += playerSpeed;
            break;
        case "ArrowLeft":
            if (playerPosition.x >= 25) playerPosition.x -= playerSpeed;
            break;
        case "ArrowRight":
            if (playerPosition.x < gameArea.clientWidth - 70) playerPosition.x += playerSpeed;
            break;
    }
    updatePosition();
}

function gameLoop() {
    if (!isPlaying) return;
    moveBeyonce();
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", movePlayer);
window.addEventListener("load", () => {
    audio.play();
    gameLoop();
    setInterval(updateTimer, 1000);
});
