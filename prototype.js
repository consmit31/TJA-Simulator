let canvas, ctx;

// Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 650;
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const ORANGE = "#FFA500";
const GRAY = "#828282";
const GREEN = "#208515";
const RED = "#FF0000";
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

const MIDDLE_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2);
const RIGHT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) + LANE_WIDTH;
const LEFT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) - LANE_WIDTH;

// State
let backgroundDrawn = false;
let descriptionDrawn = false;
let mainMenuActive = true;
let selectedOption = 0;
const menuOptions = Array.from({ length: 10 }, (_, i) => `Use Case ${i + 1}`);
let animate = false;

/** @class State representing starting state of a use case */
class State{
    blackCarX;
    blueCarX;
    orangeCarX;
    blackCarY;
    blueCarY;
    orangeCarY;
    blackCarSpeed;
    blueCarSpeed;
    orangeCarSpeed;
    systemStatus;
 
    constructor(blackCarX=0, blueCarX=0, orangeCarX=0, blackCarY=0, blueCarY=0, orangeCarY=0, blackCarSpeed=0, blueCarSpeed=0, orangeCarSpeed=0, systemStatus=true){
        this.blackCarX = blackCarX;
        this.blueCarX = blueCarX;
        this.orangeCarX = orangeCarX;
        this.blackCarY = blackCarY;
        this.blueCarY = blueCarY;
        this.orangeCarY = orangeCarY;
        this.blackCarSpeed = blackCarSpeed;
        this.blueCarSpeed = blueCarSpeed;
        this.orangeCarSpeed = orangeCarSpeed;
        this.systemStatus = systemStatus;
    }

    setState(newState){
        this.blackCarX = newState.blackCarX;
        this.blueCarX = newState.blueCarX;
        this.orangeCarX = newState.orangeCarX;
        this.blackCarY = newState.blackCarY;
        this.blueCarY = newState.blueCarY;
        this.orangeCarY = newState.orangeCarY;
        this.blackCarSpeed = newState.blackCarSpeed;
        this.blueCarSpeed = newState.blueCarSpeed;
        this.orangeCarSpeed = newState.orangeCarSpeed;
        this.systemStatus = newState.systemStatus;
    }

    stopCars(){
        this.blackCarSpeed = 0;
        this.blueCarSpeed = 0;
        this.orangeCarSpeed = 0;
    }
}
/*
Target vehicle is decelerating or coming to a stop
Target vehicle is accelerating
Activating the TJA system by pressing the button
Disabling the TJA system by using the brake pedal
Overriding the TJA system by using the accelerator pedal then reverting back to TJA
Switching from TJA to ACC because there is not enough traffic and faster speeds can be supported.
*/
// Use case descriptions 
let descriptions = {
    1: [
        "Use Case 1: System works as expected",
        "Target vehicle is deccelerating and eventually comes",
        "to a stop. The system adjusts the following distance",
        " accordingly, ensuring the user's car maintains a",
        "safe gap as the target decelerates."
    ],
    2: [
      "Use Case 2: System works as expected",
      "Target vehicle is accelerating. The system adjusts the",
      "following distance accordingly, ensuring the user's car",
      "maintains a safe distance as the target accelerates.",
    ],
    3: [
        "Use Case 3: System works as expected",
        "User's car is maintaining a safe following distance",
        "when a third car enters their lane between them and",
        "the target vehicle. The system then adjusts",
        "the following distance accordingly."
    ],
    4: ["Use Case 4: System is not initially active",
        "The user activates the system by pressing the button.",
        "The system slows the vehicle and",
        "adjusts the following distance accordingly."
    ],
    5: ["Use Case 5: System works as expected",
        "System automatically disengages when there is no target",
        "vehicle in front of the user's car. ACC then activates,",
        "Accelerating the car to the its maximum speed.",
    ]
  };
  
// blackCarX blueCarX orangeCarX blackCarY blueCarY orangeCarY blackCarSpeed blueCarSpeed orangeCarSpeed
let initialStates = {
    1: new State(SCREEN_WIDTH / 2, 0, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 6, -1),
    2: new State(SCREEN_WIDTH / 4, (SCREEN_WIDTH / 4) - 100, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 2, -1),
    3: new State(CAR_WIDTH * 3.2, CAR_WIDTH, CAR_WIDTH, RIGHT_LANE, RIGHT_LANE, MIDDLE_LANE, 1, 1, 1.2),
    4: new State(SCREEN_WIDTH / 2, 0, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 6, -1, false),
    5: new State(-1, CAR_WIDTH * 2, -1, -1, RIGHT_LANE, -1, -1, 2, -1),
//   6: new State(0, SCREEN_WIDTH / 2, 1, 6, 2, -1),
//   7: new State(0, 0, SCREEN_WIDTH / 2, 6, -2, -1),
//   8: new State(0, 0, 0, 0, 0, 0),
};
var curState = new State(); 

// Draw text helper
function drawText(text, x, y, color = WHITE) {
    ctx.fillStyle = color;
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Draw description helper
function drawDescription(text, top = 0, interval = 40, x = SCREEN_WIDTH / 2){
    if (!descriptionDrawn) {
        for (const [index, line] of text.entries()){
            drawText(line, x, top + interval * (index + 1));
        }
    }
}

// Draw system status helper
function drawSystemStatus(bool) {
    let width = 300;
    let height = 65;
    y = SCREEN_HEIGHT - 225;
    x = SCREEN_WIDTH / 2 - width / 2;

    ctx.fillStyle = WHITE;
    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    let text = bool ? "Active" : "Not active";
    let textColor = bool? GREEN : RED;
    drawText(text, 400, y + 40, textColor);
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
    if (!backgroundDrawn) {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = GREEN;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
}

// Draw setting helper
function drawSetting(caseNum, systemStatus = true) {
    drawBackground();
    drawRoad();
    drawDescription(descriptions[caseNum]);
    drawSystemStatus(systemStatus);
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
    drawSetting(1, curState.systemStatus);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(curState.blackCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

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
function caseTwo() {
    drawSetting(2, curState.systemStatus);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(curState.blackCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {
        // Accelerate the black car
        if (curState.blackCarX > SCREEN_WIDTH / 2) {
            if (curState.blackCarSpeed > 0) curState.blackCarSpeed += 0.05; // Only accelerate if car is not stopped

            if (curState.blackCarSpeed > 6) curState.blackCarSpeed = 6;  // Max speed for black car
        }

        // Move black car forward based on its speed
        curState.blackCarX += curState.blackCarSpeed;
        if (curState.blackCarX + CAR_WIDTH > SCREEN_WIDTH) {
            curState.blackCarSpeed = 0;
            curState.blueCarSpeed = 0;
        }

        // Calculate following distance
        const followingDistance = curState.blackCarX - curState.blueCarX;

        // Adjust the blue car's speed based on the following distance
        if (followingDistance > 150) {
            curState.blueCarSpeed = 6;  // Max speed for blue car
        } else if (followingDistance <= 150 && followingDistance > 75) {
            curState.blueCarSpeed = curState.blackCarSpeed;  // Match black car's speed
        } else if (followingDistance <= 75) {
            curState.blueCarSpeed = curState.blackCarSpeed;  // Match black car's speed
        }

        // Move blue car forward based on its speed
        curState.blueCarX += curState.blueCarSpeed;
        if (curState.blueCarX > SCREEN_WIDTH) curState.blueCarX = -CAR_WIDTH;
    }
} 

// Game loop for Use Case 3
function caseThree() {
    drawSetting(3, curState.systemStatus);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(curState.blackCarX, curState.blackCarY, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, curState.blueCarY, CAR_WIDTH, CAR_HEIGHT);
    
    // Orange car
    ctx.fillStyle = ORANGE;
    ctx.fillRect(curState.orangeCarX, curState.orangeCarY, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {

        if (curState.blackCarX + CAR_WIDTH + 25 > SCREEN_WIDTH) { // Stop cars once the black car reaches the end of the screen
            curState.stopCars();
            animate = false;
        }

        curState.blackCarX += curState.blackCarSpeed; // Black moves at a constant velocity

        if (curState.orangeCarX - CAR_WIDTH - 5 > curState.blueCarX) { // If the orange car is in front of the blue car
            if (curState.orangeCarY < RIGHT_LANE) {
                curState.orangeCarY += 0.5; // Merge into the right lane
                curState.orangeCarX += curState.blackCarSpeed;
            } else {
                curState.orangeCarX += curState.blackCarSpeed; // Stop orange car if it is in the right lane
            }
        } else { 
            curState.orangeCarX += curState.orangeCarSpeed; // Orange moves at a constant velocity
        }

        if (curState.orangeCarY > MIDDLE_LANE) {
            let blueOrangeDistance = Math.abs(curState.orangeCarX - curState.blueCarX);
            if (blueOrangeDistance <= CAR_WIDTH * 2) {
                if (curState.blueCarSpeed > 0.7) {
                    curState.blueCarSpeed -= 0.05; // Decrease blue car's speed when orange car is too close
                }
            } else {
                curState.blueCarSpeed = curState.blackCarSpeed; // Increase blue car's speed when orange car is too far
            }
        }

        curState.blueCarX += curState.blueCarSpeed; // Blue moves at a constant velocity

    }
}

// Game loop for Use Case 4
function caseFour() {
    drawSetting(4, curState.systemStatus);

    // Black car
    ctx.fillStyle = BLACK;
    ctx.fillRect(curState.blackCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {
        if (curState.blackCarX + CAR_WIDTH + 25 > SCREEN_WIDTH) { // Stop cars once the black car reaches the end of the screen
            curState.stopCars();
            animate = false;
        }

        if (curState.blackCarX > SCREEN_WIDTH / 2) {
            if (curState.blackCarSpeed > 1) {
                curState.blackCarSpeed -= 0.05;
            }
        }

        curState.blackCarX += curState.blackCarSpeed;
        if (curState.blackCarX > SCREEN_WIDTH) curState.blackCarX = -CAR_WIDTH;

        const followingDistance = curState.blackCarX - curState.blueCarX;

        if (followingDistance < CAR_WIDTH * 1.2) {
            if (!curState.systemStatus) {
                curState.systemStatus = true;
                curState.blueCarSpeed = curState.blackCarSpeed;
            }
        }

        if (curState.systemStatus) {
            if (followingDistance < CAR_WIDTH * 2) {
                if (curState.blueCarSpeed > 0.5) {
                    curState.blueCarSpeed -= 0.05;
                } else {
                    curState.blueCarSpeed = curState.blackCarSpeed;
                }
            } else curState.blueCarSpeed = curState.blackCarSpeed;
        }
        curState.blueCarX += curState.blueCarSpeed;
    }
}

// Game loop for Use Case 5
function caseFive() {
    drawSetting(4, curState.systemStatus);

    // Blue car
    ctx.fillStyle = BLUE;
    ctx.fillRect(curState.blueCarX, RIGHT_LANE, CAR_WIDTH, CAR_HEIGHT);

    // Update cars position if animation is active
    if (animate) {
        if (curState.blueCarX + CAR_WIDTH + 25 > SCREEN_WIDTH) { // Stop cars once the blue car reaches the end of the screen
            curState.stopCars();
            animate = false;
        }

        if (curState.blueCarX > SCREEN_WIDTH / 2) {
            curState.systemStatus = false;
        }

        if (!curState.systemStatus){
            if (curState.blueCarSpeed < 8) {
                curState.blueCarSpeed += 0.1;
            }
        }
        curState.blueCarX += curState.blueCarSpeed;
    }
}

// Game loop for Use Case 6
function caseSix() {}

// Game loop for Use Case 7
function caseSeven() {}

// Main animation loop
function gameLoop() {
    if (mainMenuActive) mainMenu();
   
    else if (selectedOption == 0) caseOne();
    else if (selectedOption == 1) caseTwo();
    else if (selectedOption == 2) caseThree();
    else if (selectedOption == 3) caseFour();
    else if (selectedOption == 4) caseFive();
    
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
                mainMenuActive = false; // Start use case                animate = false; // Reset animation state
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
                backgroundDrawn = false; // Reset background drawn state
                descriptionDrawn = false; // Reset description drawn state
            }
        }
    });

    gameLoop();  // Start the game loop
});