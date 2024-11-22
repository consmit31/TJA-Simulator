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

const blueCarImage = new Image();
blueCarImage.src = "./assets/yellow_car.png";

const MIDDLE_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2);
const RIGHT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) + LANE_WIDTH;
const LEFT_LANE = (SCREEN_HEIGHT / 2) - (CAR_HEIGHT / 2) - LANE_WIDTH;

// Use case descriptions 
let descriptions = {
  1: [
    "Use Case 1: System works as expected",
    "Target vehicle is deccelerating and eventually comes",
    "to a stop. The system adjusts the following distance",
    " accordingly, ensuring the user's car maintains a",
    "safe gap as the target decelerates.",
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
    "the following distance accordingly.",
  ],
  4: [
    "Use Case 4: System is not initially active",
    "The user activates the system by pressing the button.",
    "The system slows the vehicle and",
    "adjusts the following distance accordingly.",
  ],
  5: [
    "Use Case 5: System works as expected",
    "System automatically disengages when there is no target",
    "vehicle in front of the user's car. ACC then activates,",
    "Accelerating the car to the its maximum speed.",
  ],
  6: [
    "Use Case 6: System works as expected",
    "Driver attempts to change lanes by activating the",
    "turn signal, resulting in the system deactivating",
  ],
  7: [
    "Use Case 7: System works as expected",
    "Driver manually activates the brakes to slow down",
    "resulting in the system deactivating",
  ]
};

class DrawHelp {
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

  reset(){
    this.backgroundDrawn = false;
    this.descriptionDrawn = false;
    this.prevSystemStatus = null;
    this.currentSelectedMenuOption = null;
  }

  drawText(text, x, y, color = WHITE) {
    console.log("Drawing text");
    this.ctx.fillStyle = color;
    this.ctx.font = `${FONT_SIZE}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y);
  }

  // Draw description helper
  drawDescription(text, top = 0, interval = 40, x = SCREEN_WIDTH / 2) {
    if (!this.descriptionDrawn) {
      console.log("Drawing description");
      for (const [index, line] of text.entries()) {
        this.drawText(line, x, top + interval * (index + 1));
      }
    }
    this.descriptionDrawn = true;
  }

  drawControls(){
    if (!this.controlsDrawn){
      this.drawText(
        "Press space to start/stop",
        SCREEN_WIDTH / 2,
        SCREEN_HEIGHT - 125
      ); 
      this.drawText("Press Enter to restart", SCREEN_WIDTH / 2, SCREEN_HEIGHT - 75);
      this.controlsDrawn = true;
    }
  }

  // Draw system status helper
  drawSystemStatus(bool) {
    if (bool != this.prevSystemStatus){
      console.log("Drawing sytem status");
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

  // Draw road helper
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

  drawCar(x, y, color){
    this.ctx.drawImage(blueCarImage, x, y, CAR_WIDTH, CAR_HEIGHT);
  }

  // Draw background helper
  drawBackground() {
    if (!this.backgroundDrawn) {
      console.log("Drawing background");
      this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.ctx.fillStyle = GREEN;
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    this.backgroundDrawn = true;
  }

  // Draw setting helper
  drawSetting(caseNum, systemStatus = true) {
    this.drawBackground();
    this.drawRoad();
    this.drawDescription(descriptions[caseNum]);
    this.drawSystemStatus(systemStatus);
    this.drawControls();

  }

  // Main menu loop
  drawMainMenu(selectedOption, menuOptions) {
    if (selectedOption != this.currentSelectedMenuOption){
      this.currentSelectedMenuOption = selectedOption;
      this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.ctx.fillStyle = BLACK;
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      menuOptions.forEach((option, index) => {
        const color = index === selectedOption ? HIGHLIGHT_COLOR : WHITE;
        this.drawText(
          option,
          SCREEN_WIDTH / 2,
          SCREEN_HEIGHT / 2 - 200 + index * 50,
          color
        );
      });
    }
  }
}

export { DrawHelp }; 