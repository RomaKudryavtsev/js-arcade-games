const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const defaultColor = "#caf045";
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Ball position
let x = canvas.width / 2;
let y = canvas.height - 30;
// Get the SVG image for the ball
const svgImage = new Image();
svgImage.src = './avatar-default.svg';
// Simulate ball movement by changing position in the next frame
let dx = 2;
let dy = -2;
// Paddle position
let paddleX = (canvas.width - paddleWidth) / 2;
// Buttons
let rightPressed = false;
let leftPressed = false;
// Game over
let interval = 0;
// Scores & lives
let score = 0;
let lives = 3;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = defaultColor;
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = defaultColor;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
    ctx.beginPath();
    // Define start position
    ctx.drawImage(svgImage, x, y, ballRadius * 2, ballRadius * 2);
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = defaultColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    // Clear canvas from the prev frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    // Bouncing off the right and left
    if (x + dx > canvas.width - ballRadius * 2 || x + dx < 0) {
        dx = -dx;
    }
    // Bouncing off the top
    if (y + dy < 0) {
        dy = -dy;
        // Bouncing off paddle and gameover
    } else if (y + dy > canvas.height - ballRadius * 2) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            // Increase speed and set opposite y-direction
            dy = -dy * 1.1;
            dx = dx * 1.1;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    x += dx;
    y += dy;
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth - 10);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0 + 10);
    }
    // This is used instead of setting interval - instead of the fixed frame rate, we are giving control of the frame rate back to the browser
    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

/*
In this function we first work out a relativeX value, which is equal to the horizontal mouse position 
in the viewport (e.clientX) minus the distance between the left edge of the canvas and 
left edge of the viewport (canvas.offsetLeft) — effectively this is equal to the distance 
between the canvas left edge and the mouse pointer.
*/
function mouseMoveHandler(e) {
    const relativeXLeft = e.clientX - canvas.offsetLeft + 10;
    const minX = paddleWidth / 2; // Prevent paddle from going off the left side
    const maxX = canvas.width - paddleWidth / 2; // Prevent paddle from going off the right side
    // Ensure the paddle stays within bounds
    if (relativeXLeft > minX && relativeXLeft < maxX) {
        paddleX = relativeXLeft - paddleWidth / 2;
    }
}


/* Detect collisions with bricks - on collision: 
    (1) chage ball y-direction
    (2) change brick status
    (3) increment score
    (4) if no bricks left - show win message
*/
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function startGame() {
    // Set buttons event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    // Start drawing loop
    draw();
}

document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});
