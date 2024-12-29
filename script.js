const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Game variables
let player = {
    x: 50,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    color: "blue",
    dy: 0,
    gravity: 0.5,
    jumpPower: -5,
    onGround: false,
};

const smoothies = [];
const obstacles = [];

let isJumping = false;
let score = 0;
let gameOver = false;

// Load images
const playerImage = new Image();
playerImage.src = "Images/dennis.png"; // Replace with Dennis' photo later

const smoothieImage = new Image();
smoothieImage.src = "Images/smoothie.jpeg"; // Replace with any smoothie icon later

// Smoothie class
class Smoothie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        ctx.drawImage(smoothieImage, this.x, this.y, this.width, this.height);
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = "red";
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Generate smoothies and obstacles
function generateItems() {
    for (let i = 200; i < 2000; i += 300) {
        smoothies.push(new Smoothie(i, canvas.height - 150));
        obstacles.push(new Obstacle(i + 50, canvas.height - 25));
    }
}

// Jump function
function jump() {
    if (player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }
}

// Update game objects
function update() {
    if (gameOver) return;

    // Player gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Prevent player from falling through the floor
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.onGround = true;
    }

    // Move smoothies and obstacles
    smoothies.forEach((smoothie) => {
        smoothie.x -= 2;
    });

    obstacles.forEach((obstacle) => {
        obstacle.x -= 2;
    });

    // Collision detection for smoothies
    smoothies.forEach((smoothie, index) => {
        if (
            player.x < smoothie.x + smoothie.width &&
            player.x + player.width > smoothie.x &&
            player.y < smoothie.y + smoothie.height &&
            player.y + player.height > smoothie.y
        ) {
            score++;
            smoothies.splice(index, 1); // Remove smoothie
        }
    });

    // Collision detection for obstacles
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
}

// Draw game objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw smoothies
    smoothies.forEach((smoothie) => smoothie.draw());

    // Draw obstacles
    obstacles.forEach((obstacle) => obstacle.draw());

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Game over message
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Event listeners
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Initialize game
generateItems();
gameLoop();
