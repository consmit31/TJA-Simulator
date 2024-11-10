let canvas, ctx;

// Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 650;
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
const FONT_SIZE = 30;

// State
let mainMenuActive = true;
let selectedOption = 0;
const menuOptions = Array.from({ length: 10 }, (_, i) => `Use Case ${i + 1}`);
let animate = false;

/** @class State representing starting state of a use case */
class State{
    blackCarX;
    blueCarX;
    orangeCarX;
    blackCarSpeed;
    blueCarSpeed;
    orangeCarSpeed;
 
    constructor(blackCarX=0, blueCarX=0, orangeCarX=0, blackCarSpeed=0, blueCarSpeed=0, orangeCarSpeed){
        this.blackCarX = blackCarX;
        this.blueCarX = blueCarX;
        this.orangeCarX = orangeCarX;
        this.blackCarSpeed = blackCarSpeed;
        this.blueCarSpeed = blueCarSpeed;
        this.orangeCarSpeed = orangeCarSpeed;
    }

    setState(newState){
        console.log("NewState:", newState);
        this.blackCarX = newState.blackCarX;
        this.blueCarX = newState.blueCarX;
        this.orangeCarX = newState.orangeCarX;
        this.blackCarSpeed = newState.blackCarSpeed;
        this.blueCarSpeed = newState.blueCarSpeed;
        this.orangeCarSpeed = newState.orangeCarSpeed;
    }
}

// Use case descriptions 
let descriptions = {
  1: [
    "Use Case 1: System works as expected",
    "The user's car (blue) maintains a constant following rate",
    "once the distance from the car ahead",
    "reaches 100 ft and stops accordingly.",
  ],
};

let initialStates = {
  1: new State(SCREEN_WIDTH / 2, 0, -1, 2, 6, -1),
//   2: new State(0, SCREEN_WIDTH / 2, 1, 6, 2, -1),
//   3: new State(0, 0, SCREEN_WIDTH / 2, 6, -2, -1),
//   4: new State(0, 0, 0, 0, 0, 0),
//   5: new State(SCREEN_WIDTH / 2, 0, -1, 2, 6, -1),
//   6: new State(0, SCREEN_WIDTH / 2, 1, 6, 2, -1),
//   7: new State(0, 0, SCREEN_WIDTH / 2, 6, -2, -1),
//   8: new State(0, 0, 0, 0, 0, 0),
};
var curState = new State(); //

// Draw text helper
function drawText(text, x, y, color = WHITE) {
    ctx.fillStyle = color;
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Draw description helper
function drawDescription(text, top = 0, interval = 50, x = SCREEN_WIDTH / 2){
    for (const [index, line] of text.entries()){
        drawText(line, x, top + interval * (index + 1));
    }
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

// Draw background helper
function drawBackground() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

// Draw setting helper
function drawSetting(caseNum) {
    drawBackground();
    drawRoad();
    drawDescription(descriptions[caseNum]);
    drawText("Press space to start/stop", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 125);
    drawText("Press Enter to restart", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 75);

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
    drawSetting(1);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(curState.blackCarX, SCREEN_HEIGHT / 2 + LANE_WIDTH, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, SCREEN_HEIGHT / 2 + LANE_WIDTH, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {
        if (curState.blackCarX > 3 * (SCREEN_WIDTH / 4)) {
            curState.blackCarSpeed -= 0.05;
            if (curState.blackCarSpeed < 0) curState.blackCarSpeed = 0;
        }

        curState.blackCarX += curState.blackCarSpeed;
        if (curState.blackCarX > SCREEN_WIDTH) curState.blackCarX = -CAR_WIDTH;

        const followingDistance = curState.blackCarX - curState.blueCarX;

        if (followingDistance > 150) curState.blueCarSpeed = 6;
        else if (followingDistance <= 150 && followingDistance > 75) curState.blueCarSpeed = curState.blackCarSpeed;
        else if (followingDistance <= 75) curState.blueCarSpeed = curState.blackCarSpeed;

        curState.blueCarX += curState.blueCarSpeed;
        if (curState.blueCarX > SCREEN_WIDTH) curState.blueCarX = -CAR_WIDTH;
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
    else if (selectedOption == 0) caseOne();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("PrototypeCanvas");
    ctx = canvas.getContext("2d");

    document.addEventListener("keydown", (event) => {
        // Handle actions based on whether the main menu is active or not
        if (mainMenuActive) {
            // Main menu actions
            if (event.key === "ArrowUp") {
                selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
            } else if (event.key === "ArrowDown") {
                selectedOption = (selectedOption + 1) % menuOptions.length;
            } else if (event.key === "Enter") {
                console.log(initialStates[selectedOption + 1]);
                mainMenuActive = false; // Start use case
                animate = false; // Reset animation state
                curState.setState(initialStates[selectedOption + 1]); // Set initial state
            }
        } else {
            // Actions when the main menu is not active
            if (event.key === "Enter") {
                animate = false; // Reset animation state
                curState.setState(initialStates[selectedOption + 1]); // Reset to initial state
            } else if (event.key === " ") {
                animate = !animate; // Toggle animation state
            } else if (event.key === "Escape") {
                mainMenuActive = true; // Go back to the main menu
            }
        }
    });

    // Now you can start your game loop or any other initialization code
    gameLoop();  // Start the game loop
});