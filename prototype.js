import { DrawHelp } from './drawHelp.js'; 

let canvas, ctx, dh;

// Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 650;
const BLACK = "#000000";
const ORANGE = "#FFA500";
const BLUE = "#00B0B0";
const CAR_WIDTH = 50;
const CAR_HEIGHT = 30;
const LANE_WIDTH = 60;
const MIDDLE_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2);
const RIGHT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) + LANE_WIDTH;
const LEFT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) - LANE_WIDTH;

// State variables
let mainMenuActive = true;
let selectedOption = 0;
const menuOptions = Array.from({ length: 7 }, (_, i) => `Use Case ${i + 1}`);
let animate = false;

/**
 * Class representing the state of a use case.
 */
class State {
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

    /**
     * Create a state.
     * @param {number} blackCarX - The x-coordinate of the black car.
     * @param {number} blueCarX - The x-coordinate of the blue car.
     * @param {number} orangeCarX - The x-coordinate of the orange car.
     * @param {number} blackCarY - The y-coordinate of the black car.
     * @param {number} blueCarY - The y-coordinate of the blue car.
     * @param {number} orangeCarY - The y-coordinate of the orange car.
     * @param {number} blackCarSpeed - The speed of the black car.
     * @param {number} blueCarSpeed - The speed of the blue car.
     * @param {number} orangeCarSpeed - The speed of the orange car.
     * @param {boolean} systemStatus - The system status.
     */
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

    /**
     * Set the state properties with new state values.
     * @param {State} newState - The new state.
     */
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

    /**
     * Stop all cars by setting their speeds to 0.
     */
    stopCars(){
        this.blackCarSpeed = 0;
        this.blueCarSpeed = 0;
        this.orangeCarSpeed = 0;
    }
}
  
// Initial states for different use cases
let initialStates = {
    1: new State(SCREEN_WIDTH / 2, 0, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 6, -1),
    2: new State(SCREEN_WIDTH / 4, (SCREEN_WIDTH / 4) - 100, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 2, -1),
    3: new State(CAR_WIDTH * 3.2, CAR_WIDTH, CAR_WIDTH, RIGHT_LANE, RIGHT_LANE, MIDDLE_LANE, 1, 1, 1.2),
    4: new State(SCREEN_WIDTH / 2, 0, -1, RIGHT_LANE, RIGHT_LANE, -1, 2, 6, -1, false),
    5: new State(-1, CAR_WIDTH * 2, -1, -1, RIGHT_LANE, -1, -1, 2, -1), 
    6: new State(-1, CAR_WIDTH, -1, -1, RIGHT_LANE, -1, -1, 3, -1),
    7: new State(-1, CAR_WIDTH, -1, -1, RIGHT_LANE, -1, -1, 3, -1),
};

var curState = new State(); // Current state

/**
 * Game loop for Use Case 1.
 */
function caseOne() {
    dh.drawSetting(1, curState.systemStatus); // Draw setting for use case 1

    // Draw black car
    dh.drawCar(curState.blackCarX, RIGHT_LANE, "BLACK");

    // Draw blue car
    dh.drawCar(curState.blueCarX, RIGHT_LANE, "BLUE");

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

/**
 * Game loop for Use Case 2.
 */
function caseTwo() {
    dh.drawSetting(2, curState.systemStatus); // Draw setting for use case 2

    // Draw black car
    dh.drawCar(curState.blackCarX, RIGHT_LANE, "BLACK");

    // Draw blue car
    dh.drawCar(curState.blueCarX, RIGHT_LANE, "BLUE");

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

/**
 * Game loop for Use Case 3.
 */
function caseThree() {
    dh.drawSetting(3, curState.systemStatus); // Draw setting for use case 3

    // Draw black car
    dh.drawCar(curState.blackCarX, curState.blackCarY, "BLACK");

    // Draw blue car
    dh.drawCar(curState.blueCarX, curState.blueCarY, "BLUE");
    
    // Draw yellow car
    dh.drawCar(curState.orangeCarX, curState.orangeCarY, "YELLOW");

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

/**
 * Game loop for Use Case 4.
 */
function caseFour() {
    dh.drawSetting(4, curState.systemStatus); // Draw setting for use case 4

    // Draw black car
    dh.drawCar(curState.blackCarX, RIGHT_LANE, "BLACK");

    // Draw blue car
    dh.drawCar(curState.blueCarX, RIGHT_LANE, "BLUE");

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

/**
 * Game loop for Use Case 5.
 */
function caseFive() {
    dh.drawSetting(5, curState.systemStatus); // Draw setting for use case 5

    // Draw blue car
    dh.drawCar(curState.blueCarX, RIGHT_LANE, "BLUE");

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

/**
 * Game loop for Use Case 6.
 */
function caseSix() {
    dh.drawSetting(6, curState.systemStatus); // Draw setting for use case 6

    // Draw blue car
    dh.drawCar(curState.blueCarX, curState.blueCarY, "BLUE");

    if (animate) {
        if (curState.blueCarX + CAR_WIDTH + 25 > SCREEN_WIDTH) { // Stop cars once the blue car reaches the end of the screen
            curState.stopCars();
            animate = false;
        }

        if (curState.blueCarX > SCREEN_WIDTH / 3){
            if (curState.blueCarY > MIDDLE_LANE) {
                curState.blueCarY -= 1;
            }
        } 

        if (curState.blueCarY > MIDDLE_LANE && curState.blueCarY < RIGHT_LANE) { 
            curState.systemStatus = false;
        } else {
            curState.systemStatus = true;
        }

        curState.blueCarX += curState.blueCarSpeed;
    }
}

/**
 * Game loop for Use Case 7.
 */
function caseSeven() {
    dh.drawSetting(7, curState.systemStatus); // Draw setting for use case 7

    // Draw blue car
    dh.drawCar(curState.blueCarX, curState.blueCarY, "BLUE")

    if (animate) {
        if (curState.blueCarX + CAR_WIDTH + 25 > SCREEN_WIDTH) { // Stop cars once the blue car reaches the end of the screen
            curState.stopCars();
            animate = false;
        }

        if (curState.blueCarX > SCREEN_WIDTH / 3){
            if (curState.blueCarSpeed > 2)
            curState.blueCarSpeed -= 0.05;
            curState.systemStatus = false
        } 

        curState.blueCarX += curState.blueCarSpeed;
    }
}

/**
 * Main animation loop.
 */
function gameLoop() {
    if (mainMenuActive) {
        dh.drawMainMenu(selectedOption, menuOptions); // Draw main menu
    } else {
        // Execute the selected use case
        if (selectedOption == 0) caseOne();
        else if (selectedOption == 1) caseTwo();
        else if (selectedOption == 2) caseThree();
        else if (selectedOption == 3) caseFour();
        else if (selectedOption == 4) caseFive();
        else if (selectedOption == 5) caseSix();
        else if (selectedOption == 6) caseSeven();
    }
    requestAnimationFrame(gameLoop); // Request the next frame
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("PrototypeCanvas");
    ctx = canvas.getContext("2d");
    dh = new DrawHelp(ctx);

    document.addEventListener("keydown", (event) => {
        // Handle actions based on whether the main menu is active or not
        if (mainMenuActive) {
            // Main menu actions
            if (event.key === "ArrowUp") {
                selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
            } else if (event.key === "ArrowDown") {
                selectedOption = (selectedOption + 1) % menuOptions.length;
            } else if (event.key === "Enter") {
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
                dh.reset(); // Reset the draw helper
            }
        }
    });

    gameLoop();  // Start the game loop
});