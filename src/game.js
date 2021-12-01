import InputHandler from "../src/input.js";
import { createBoard, drawBoard } from "./boardBuilder.js";
import { createMenu } from "../src/helperScreens.js";
import { createHiDPICanvas, circleAndMouseCollissionDetection, shuffle  } from "../src/helper.js";


const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  LOADING: 5
};

const unitMeasurement = {
  unitWidth : 50,
  unitHeight : 50
};


const sequences = [
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['2', '7', '8', '23', '54', '67', '87', '88', '95', '122', '155', '167', '197' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '132', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '167', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '167', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
]


export default class NumberSequence {
  constructor(gameWidth, gameHeight, difficulty, canvas) {
    //padding around the board
    this.padding = 20;
    this.canvas = canvas
    //padding between the units
    this.gap = 10
    this.sequences = sequences.map(arrayRow => {
      return arrayRow.sort((a, b) => {
        return parseInt(a) - parseInt(b);

      });
    })

    this.updateCurrentSequence(0)

    this.candidateAnswer = []

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.updateUnitMeasurement()
    
    this.mouse = {
      x:0,
      y:0,
    }

    this.clicked = {
      x:0,
      y:0,
    }

    this.selectedUnit = {
      row:0,
      col:0
    }

    this.difficulty = difficulty


    this.menu = createMenu(this, gameWidth, gameHeight)
    

    this.units = drawBoard(this)


    this.InputHandler = new InputHandler(this, GAMESTATE);
    this.updateGameState(GAMESTATE.RUNNING)
    this.InputHandler.init()

  }

  
determineRowAndCol(sequence){

  let dimensions;
  switch (sequence.length) {
      case 4:
        dimensions = {row:2, col:2}
        break;
      case 6:
          dimensions = {row:2, col:3}
          break;
      case 8:
          dimensions = {row:2, col:4}
          break;
      case 12:
          dimensions = {row:3, col:4}
          break;
      case 16:
          dimensions = {row:4, col:4}
          break;
      case 25:
          dimensions = {row:5, col:5}

    }
    return dimensions 

}

  updateCurrentSequence(i){
    this.currentSequence = i
    this.currentBoard = this.sequences[this.currentSequence]
    this.shuffledBoard = shuffle(this.currentBoard)
    this.currentDimensions = this.determineRowAndCol(this.sequences[this.currentSequence])

  }

  updateUnitMeasurement(){
    // When fixing the unit dimensions always take into account the padding and the unit gap
    let size = this.sequences[this.currentSequence].length;
    // this.unitMeasurement = {
    //   unitWidth : (this.gameWidth - this.gap * (size-1)) / (size),
    //   unitHeight : (this.gameWidth - this.gap * (size-1)) / (size)
    // };

    this.unitMeasurement = {
        unitWidth : 35,
        unitHeight : 35
      };
    console.log(this.unitMeasurement)
    console.log(this.unitMeasurement)

  }

  start() {
  }

  update(deltaTime) {

  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.RUNNING) {
      // [...this.units].forEach((object) => object.drawSelectedColors(ctx));
      [...this.units].forEach((object) => object.draw(ctx));
    }

    if (this.gamestate === GAMESTATE.MENU) {
      this.menu.draw(ctx)
    }
  }

  updateGameState(state){
    this.gamestate = state;
  }

  checkPlayButtonClick(clientX, clientY){
    if (circleAndMouseCollissionDetection(this.gameWidth, this.gameHeight, this.menu.buttonRadius, this.mouse)){
      this.updateGameState(GAMESTATE.RUNNING)
    }
  }

  selectUnitClick(clientX, clientY){
    this.clicked = {
      x:clientX,
      y:clientY
    };
    console.log(this.clicked);
 

    [...this.units].forEach((object) => {
      if (circleAndMouseCollissionDetection(object.position.x, object.position.y, object.pathRadius, this.clicked)){
        console.log(object.position.x);
        console.log(object.position.y);
        console.log(object.pathRadius);
        this.candidateAnswer.push(this.shuffledBoard[object.row])
        
      }
    });


  }

  fillNumber(number){
    let selectedUnit = this.selectedUnit
    if (this.boardExample[selectedUnit.row][selectedUnit.col] == '.'){
      this.board[selectedUnit.row][selectedUnit.col] = String(number)

    }
  }


  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
