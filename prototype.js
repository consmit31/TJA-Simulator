const canvas = document.getElementById("PrototypeCanvas");
const ctx = canvas.getContext("2d");

// Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const GRAY = "#828282";
const GREEN = "#208515";
const BLUE = "#00B0B0";
const YELLOW = "#FFFF00";
const HIGHLIGHT_COLOR = "#32C832";

const CAR_WIDTH = 50;
const CAR_HEIGHT = 30;
const CAR_SPEED = 5;
const ROAD_WIDTH = 180;
const LANE_WIDTH = 60;
const DIVIDER_WIDTH = 4;
const DIVIDER_HEIGHT = 2;
const DIVIDER_SPACING = 8;
const FONT_SIZE = 40;

// State
let mainMenuActive = true;
let selectedOption = 0;
const menuOptions = Array.from({ length: 10 }, (_, i) => `Use Case ${i + 1}`);
let animate = false;
let blackCarX = SCREEN_WIDTH / 2;
let blueCarX = 0;
let blackCarSpeed = 2;
let blueCarSpeed = 6;

// Draw text helper
function drawText(text, x, y, color = WHITE) {
    ctx.fillStyle = color;
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Draw road helper
function drawRoad() {
    ctx.fillStyle = GRAY;
    ctx.fillRect(0, (SCREEN_HEIGHT - ROAD_WIDTH) / 2, SCREEN_WIDTH, ROAD_WIDTH);

    for (let i = 1; i < 3; i++) {
        let dividerX = 0;
        while (dividerX < SCREEN_WIDTH) {
            ctx.fillStyle = YELLOW;
            ctx.fillRect(
                dividerX,
                (SCREEN_HEIGHT - ROAD_WIDTH) / 2 + LANE_WIDTH * i,
                DIVIDER_WIDTH,
                DIVIDER_HEIGHT
            );
            dividerX += DIVIDER_SPACING;
        }
    }
}

// Main menu loop
function mainMenu() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    menuOptions.forEach((option, index) => {
        const color = index === selectedOption ? HIGHLIGHT_COLOR : WHITE;
        drawText(option, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 200 + index * 50, color);
    });
}

// Game loop for Use Case 1
function caseOne() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    drawRoad();
    drawText("Use Case 1: System works as expected", SCREEN_WIDTH / 2, 50);
    drawText("The user's car (blue) maintains a constant following rate", SCREEN_WIDTH / 2, 100);
    drawText("once the distance from the car ahead reaches 100 ft and stops accordingly.", SCREEN_WIDTH / 2, 150);
    drawText("Press space to begin", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(blackCarX, SCREEN_HEIGHT / 2 + LANE_WIDTH, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(blueCarX, SCREEN_HEIGHT / 2 + LANE_WIDTH, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {
        if (blackCarX > 3 * (SCREEN_WIDTH / 4)) {
            blackCarSpeed -= 0.05;
            if (blackCarSpeed < 0) blackCarSpeed = 0;
        }

        blackCarX += blackCarSpeed;
        if (blackCarX > SCREEN_WIDTH) blackCarX = -CAR_WIDTH;

        const followingDistance = blackCarX - blueCarX;

        if (followingDistance > 150) blueCarSpeed = 6;
        else if (followingDistance <= 150 && followingDistance > 75) blueCarSpeed = blackCarSpeed;
        else if (followingDistance <= 75) blueCarSpeed = blackCarSpeed;

        blueCarX += blueCarSpeed;
        if (blueCarX > SCREEN_WIDTH) blueCarX = -CAR_WIDTH;
    }
}

// Game loop for Use Case 2
function caseTwo() {} 

// Game loop for Use Case 3
function caseThree() {}

// Game loop for Use Case 4
function caseFour() {}

// Game loop for Use Case 5
function caseFive() {}

// Game loop for Use Case 6
function caseSix() {}

// Game loop for Use Case 7
function caseSeven() {}

// Main animation loop
function gameLoop() {
    if (mainMenuActive) mainMenu();
    else if (selectedOption = 1) caseOne();
    
    requestAnimationFrame(gameLoop);
}

// Input event listeners
document.addEventListener("keydown", (event) => {
    if (mainMenuActive) {
        if (event.key === "ArrowUp") selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
        else if (event.key === "ArrowDown") selectedOption = (selectedOption + 1) % menuOptions.length;
        else if (event.key === "Enter") {
            mainMenuActive = false; // Start use case
            animate = false; // Reset animation state
        }
    } else {
        if (event.key === " ") animate = !animate; // Start/Stop animation
        else if (event.key === "Escape") mainMenuActive = true; // Go back to main menu
    }
});

gameLoop();  // Start the game loop
