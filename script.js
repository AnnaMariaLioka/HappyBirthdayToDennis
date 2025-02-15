const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas-Dimensionen
canvas.width = 800;
canvas.height = 400;

// Spielvariablen
let player = {
    x: 50,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    color: "blue",
    dy: 0,
    gravity: 0.4,
    jumpPower: -8,
    onGround: false,
};

const smoothies = [];
const obstacles = [];

let isJumping = false;
let score = 0;
let gameOver = false;
let gameWon = false;
let gameEnded = false;
let totalDistance = 4000;
let distanceTraveled = 0;

// Bilder laden
const playerImage = new Image();
playerImage.src = "Images/dennis.png";

const smoothieImage = new Image();
smoothieImage.src = "Images/smoothie.jpeg";

// Smoothie-Klasse
class Smoothie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 45;
    }
    draw() {
        ctx.drawImage(smoothieImage, this.x, this.y, this.width, this.height);
    }
}

// Hindernis-Klasse
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = "blue";
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Smoothies und Hindernisse generieren
function generateItems() {
    let position = 600;
    while (position < totalDistance) {
        let smoothieY = canvas.height - 150;
        smoothies.push(new Smoothie(position, smoothieY));

        let obstacleX = position + 180 + Math.random() * 150;
        obstacles.push(new Obstacle(obstacleX, canvas.height - 70));

        position += 300 + Math.random() * 250;
    }
}

// Sprungfunktion
function jump() {
    if (player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }
}

// Spielobjekte aktualisieren
function update() {
    if (gameOver || gameWon || gameEnded) return;

    // Schwerkraft des Spielers
    player.dy += player.gravity;
    player.y += player.dy;

    // Verhindern, dass der Spieler durch den Boden fällt
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.onGround = true;
    }

    // Smoothies und Hindernisse bewegen
    smoothies.forEach((smoothie) => smoothie.x -= 2);
    obstacles.forEach((obstacle) => obstacle.x -= 2);

    // Kollisionserkennung für Smoothies
    smoothies.forEach((smoothie, index) => {
        if (
            player.x < smoothie.x + smoothie.width &&
            player.x + player.width > smoothie.x &&
            player.y < smoothie.y + smoothie.height &&
            player.y + player.height > smoothie.y
        ) {
            score++;
            smoothies.splice(index, 1);
        }
    });

    // Kollisionserkennung für Hindernisse
    obstacles.forEach((obstacle) => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    // Distanz aktualisieren
    distanceTraveled += 2;

    // Überprüfen, ob die Distanz erreicht wurde
    if (distanceTraveled >= totalDistance) {
        gameEnded = true;
        displayHappyBirthdayMessage();
    }
}

function displayHappyBirthdayMessage() {
    ctx.fillStyle = "red";
    ctx.font = "bold 36px 'Martian Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Happy Birthday, Dennis!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "bold 24px 'Martian Mono', monospace";

    if (smoothies.length === 0) {
        ctx.fillText("Mögen all Deine Wünsche und Träume in Erfüllung gehen! <3", canvas.width / 2, canvas.height / 2 + 20);
    } else {
        ctx.fillText("Bleib gesund, happy und immer du selbst!", canvas.width / 2, canvas.height / 2 + 20);
        ctx.font = "18px 'Martian Mono', monospace";
        ctx.fillText("Alles Liebe, Anna", canvas.width / 2, canvas.height / 2 + 60);
        //ctx.fillText(`Du hast ${score} von ${score + smoothies.length} Smoothies gesammelt.`, canvas.width / 2, canvas.height / 2 + 50);
    }
}

// Spielobjekte zeichnen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spieler zeichnen
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Smoothies zeichnen
    smoothies.forEach((smoothie) => smoothie.draw());

    // Hindernisse zeichnen
    obstacles.forEach((obstacle) => obstacle.draw());

    // Punktestand zeichnen
    ctx.fillStyle = "black";
    ctx.font = "20px 'Martian Mono', monospace";
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Game Over-Nachricht
    if (gameOver) {
        ctx.fillStyle = "gray";
        ctx.font = "30px 'Martian Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("Ooohh shit! ..Try again ;D", canvas.width / 2, canvas.height / 2);
    }

    // Happy Birthday-Nachricht anzeigen, wenn das Spiel beendet ist
    if (gameEnded) {
        displayHappyBirthdayMessage();
    }
}

// Spielschleife
function gameLoop() {
    update();
    draw();
    if (!gameOver && !gameWon && !gameEnded) {
        requestAnimationFrame(gameLoop);
    }
}

// Event-Listener
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Spiel initialisieren
generateItems();
gameLoop();