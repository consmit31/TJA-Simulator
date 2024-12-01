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
const HIGHLIGHT_COLOR = "#3498EB";

const CAR_WIDTH = 50;
const CAR_HEIGHT = 30;
const CAR_SPEED = 5;
const ROAD_WIDTH = 180;
const LANE_WIDTH = 60;
const DIVIDER_WIDTH = 4;
const DIVIDER_HEIGHT = 2;
const DIVIDER_SPACING = 8;
const FONT_SIZE = 30;

const blueCarImage = new Image();
blueCarImage.src = "./assets/blue_car.png";

const blackCarImage = new Image();
blackCarImage.src = "./assets/black_car.png";

const yellowCarImage = new Image();
yellowCarImage.src = "./assets/yellow_car.png";

const flowerImage = new Image();
flowerImage.src = "./assets/flower.png";

const treeImage = new Image();
treeImage.src = "./assets/tree.png";

const MIDDLE_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2);
const RIGHT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) + LANE_WIDTH;
const LEFT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) - LANE_WIDTH;

// Use case descriptions 
let descriptions = {
  1: [
    "Use Case 1: TJA system works as expected",
    "Target vehicle is deccelerating and eventually comes",
    "to a stop. The system adjusts the following distance",
    " accordingly, ensuring the user's car maintains a",
    "safe gap as the target decelerates.",
  ],
  2: [
    "Use Case 2: TJA system works as expected",
    "Target vehicle is accelerating. The system adjusts the",
    "following distance accordingly, ensuring the user's car",
    "maintains a safe distance as the target accelerates.",
  ],
  3: [
    "Use Case 3: TJA system works as expected",
    "User's car is maintaining a safe following distance",
    "when a third car enters their lane between them and",
    "the target vehicle. The system then adjusts",
    "the following distance accordingly.",
  ],
  4: [
    "Use Case 4: TJA system is not initially active",
    "The user activates the system by pressing the button.",
    "The system slows the vehicle and",
    "adjusts the following distance accordingly.",
  ],
  5: [
    "Use Case 5: TJA system works as expected",
    "System automatically disengages when there is no target",
    "vehicle in front of the user's car. ACC then activates,",
    "Accelerating the car to the its maximum speed.",
  ],
  6: [
    "Use Case 6: TJA system works as expected",
    "Driver attempts to change lanes by activating the",
    "turn signal, resulting in the system deactivating",
  ],
  7: [
    "Use Case 7: TJA system works as expected",
    "Driver manually deactivates the system by pressing",
    "the button located on the steering wheel,",
    "delegating acceleration and deceleration to the driver.",
  ]
};

/**
 * Class representing drawing helper.
 */
class DrawHelp {
  /**
   * Create a DrawHelp instance.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {Array} menuOptions - The menu options.
   */
  constructor(ctx, menuOptions) {
    console.log("DrawHelp initilized");
    this.ctx = ctx;
    this.menuOptions = menuOptions;
    this.backgroundDrawn = false;
    this.descriptionDrawn = false;
    this.controlsDrawn = false;
    this.prevSystemStatus = null;
    this.currentSelectedMenuOption = null;
  }

  /**
   * Reset the drawing state.
   */
  reset() {
    this.backgroundDrawn = false;
    this.descriptionDrawn = false;
    this.controlsDrawn = false;
    this.prevSystemStatus = null;
    this.currentSelectedMenuOption = null;
  }

  /**
   * Draw text on the canvas.
   * @param {string} text - The text to draw.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {string} [color=WHITE] - The color of the text.
   */
  drawText(text, x, y, color = WHITE) {
    console.log("Drawing text");
    this.ctx.fillStyle = color;
    this.ctx.font = `${FONT_SIZE}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw description text on the canvas.
   * @param {Array} text - The description text lines.
   * @param {number} [top=0] - The top y-coordinate.
   * @param {number} [interval=40] - The interval between lines.
   * @param {number} [x=SCREEN_WIDTH / 2] - The x-coordinate.
   */
  drawDescription(text, top = 0, interval = 40, x = SCREEN_WIDTH / 2) {
    if (!this.descriptionDrawn) {
      console.log("Drawing description");
      for (const [index, line] of text.entries()) {
        this.drawText(line, x, top + interval * (index + 1));
      }
    }
    this.descriptionDrawn = true;
  }

  /**
   * Draw control instructions on the canvas.
   */
  drawControls() {
    if (!this.controlsDrawn) {
      this.drawText("Press space to start/stop", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 125);
      this.drawText("Press Enter to restart", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 90);
      this.drawText("Press Escape to return to selection menu", SCREEN_WIDTH / 2, SCREEN_HEIGHT-55);
      this.controlsDrawn = true;
    }
  }

  /**
   * Draw system status on the canvas.
   * @param {boolean} bool - The system status.
   */
  drawSystemStatus(bool) {
    if (bool != this.prevSystemStatus) {
      console.log("Drawing system status");
      var width = 300;
      var height = 65;
      var y = SCREEN_HEIGHT - 225;
      var x = SCREEN_WIDTH / 2 - width / 2;

      this.ctx.fillStyle = WHITE;
      this.ctx.fillRect(x, y, width, height);

      let text = bool ? "Active" : "Not active";
      let textColor = bool ? GREEN : RED;
      this.drawText(text, 400, y + 40, textColor);
    }
  }

  /**
   * Draw the road on the canvas.
   */
  drawRoad() {
    console.log("Drawing road");
    this.ctx.fillStyle = GRAY;
    this.ctx.fillRect(0, (SCREEN_HEIGHT - ROAD_WIDTH) / 2, SCREEN_WIDTH, ROAD_WIDTH);

    for (let i = 1; i < 3; i++) {
      let dividerX = 0;
      while (dividerX < SCREEN_WIDTH) {
        this.ctx.fillStyle = YELLOW;
        this.ctx.fillRect(
          dividerX,
          (SCREEN_HEIGHT - ROAD_WIDTH) / 2 + LANE_WIDTH * i,
          DIVIDER_WIDTH,
          DIVIDER_HEIGHT
        );
        dividerX += DIVIDER_SPACING;
      }
    }
  }

  /**
   * Draw a car on the canvas.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {string} color - The color of the car.
   */
  drawCar(x, y, color) {
    switch (color) {
      case "BLUE":
        this.ctx.drawImage(blueCarImage, x, y, CAR_WIDTH, CAR_HEIGHT);
        break;
      case "BLACK":
        this.ctx.drawImage(blackCarImage, x, y, CAR_WIDTH, CAR_HEIGHT);
        break;
      case "YELLOW":
        this.ctx.drawImage(yellowCarImage, x, y, CAR_WIDTH, CAR_HEIGHT);
        break;
      default:
        this.ctx.drawImage(blueCarImage, x, y, CAR_WIDTH, CAR_HEIGHT);
        break;
    }
  }

  /**
   * Draw a flower on the canvas.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
  drawFlower(x, y) {
    this.ctx.drawImage(flowerImage, x, y, 20, 20);
  }

  /**
   * Draw a tree on the canvas.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
  drawTree(x, y) {
    this.ctx.drawImage(treeImage, x, y, 40, 80);
  }

  /**
   * Draw foliage on the canvas.
   */
  drawFoliage() {
    this.drawFlower(100, 165);
    this.drawFlower(75, 500);
    this.drawFlower(225, 600);
    this.drawFlower(675, 550);
    this.drawFlower(700, 50);

    this.drawTree(20, 120);
    this.drawTree(700, 450);
  }

  /**
   * Draw the background on the canvas.
   */
  drawBackground() {
    if (!this.backgroundDrawn) {
      console.log("Drawing background");
      this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.ctx.fillStyle = GREEN;
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      this.drawFoliage();
    }
    this.backgroundDrawn = true;
  }

  /**
   * Draw the instructions for the main menu.
   */
  drawInstructions() {
    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx.fillStyle = GREEN;
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.drawText("Use the arrow keys to navigate the menu", SCREEN_WIDTH / 2, SCREEN_HEIGHT-100);
    this.drawText("Press Enter to select an option", SCREEN_WIDTH / 2, SCREEN_HEIGHT-60);
    this.drawText("Press Escape to return to selection menu", SCREEN_WIDTH / 2, SCREEN_HEIGHT-20);
  }

  /**
   * Draw the setting for a specific use case.
   * @param {number} caseNum - The use case number.
   * @param {boolean} [systemStatus=true] - The system status.
   */
  drawSetting(caseNum, systemStatus = true) {
    this.drawBackground();
    this.drawRoad();
    this.drawDescription(descriptions[caseNum]);
    this.drawSystemStatus(systemStatus);
    this.drawControls();
  }

  /**
   * Draw the main menu.
   * @param {number} selectedOption - The selected menu option.
   * @param {Array} menuOptions - The menu options.
   */
  drawMainMenu(selectedOption, menuOptions) {
    if (selectedOption != this.currentSelectedMenuOption) {
      this.currentSelectedMenuOption = selectedOption;
      this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.ctx.fillStyle = GREEN;
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.drawInstructions();
      this.drawFoliage();

      menuOptions.forEach((option, index) => {
        const color = index === selectedOption ? HIGHLIGHT_COLOR : WHITE;
        this.drawText(option, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 200 + index * 50, color);
      });
    }
  }
}

export { DrawHelp };