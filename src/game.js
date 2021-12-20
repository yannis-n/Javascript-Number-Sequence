import InputHandler from "../src/input.js";
import { createBoard, drawBoard } from "./boardBuilder.js";
import { createMenu, createLoadingBar } from "../src/helperScreens.js";
import { createHiDPICanvas, circleAndMouseCollissionDetection, shuffle  } from "../src/helper.js";


const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  LEVELDONE: 5,
  LOADING: 6,
};

const sequences = [
  ['1', '4', '23', '45', '78', '92'],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['2', '7', '8', '23', '54', '67', '87', '88', '95', '122', '155', '197' ],
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
    this.canvas = canvas
    this.rect = canvas.getBoundingClientRect()

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    //padding between the units
    this.gap = 10
    // here making sure that the sequences are in the right order
    this.sequences = sequences.map(arrayRow => {
      return arrayRow.sort((a, b) => {
        return parseInt(a) - parseInt(b);

      });
    })
    this.archivedAnswers = []
    // set the current sequence to the first one
    this.updateCurrentSequence(0)
    // This is where the candidate sequence answer will be stored

    this.updateUnitMeasurement()
    this.dx = 0
    this.mouse = {
      x:0,
      y:0,
    }

    this.clicked = {
      x:0,
      y:0,
    }
    this.difficulty = difficulty


    this.units = drawBoard(this)

    this.InputHandler = new InputHandler(this, GAMESTATE);
    this.updateGameState(GAMESTATE.LOADING)
    this.InputHandler.init()

    this.unitErrors = {}
    this.step = 11


    // this is where all the helper screens will be loaled #helperScreensCode

    
    // this.menu = createMenu(this, gameWidth, gameHeight)
    
    this.loadingBar = createLoadingBar(this)

  }

  updateGameSize(GAME_WIDTH, GAME_HEIGHT){
    this.gameWidth = GAME_WIDTH;
    this.gameHeight = GAME_HEIGHT;
    this.updateUnitMeasurement();
    this.units = drawBoard(this, this.units)
    this.rect = this.canvas.getBoundingClientRect()
    console.log(this.rect)

  }


  // Determine the number of rows and columns our Grid will have depending on the length of the sequence
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
        default:
            dimensions = {row:5, col:5}

      }
      return dimensions 

  }


  // here we update the current sequence and also shuffled it
  updateCurrentSequence(i){
    this.currentSequence = i
    this.currentBoard = this.sequences[i]
    this.shuffledBoard = shuffle(this.currentBoard.map(inner => inner.slice()))
    this.currentDimensions = this.determineRowAndCol(this.sequences[this.currentSequence])
    if (i>0){
      this.archivedAnswers.push(this.candidateAnswer)
    }
    this.candidateAnswer = []

  }

  updateUnitMeasurement(){
    // When fixing the unit dimensions always take into account the padding and the unit gap
    let size = this.sequences[this.currentSequence].length;
    // this.unitMeasurement = {
    //   unitWidth : (this.gameWidth - this.gap * (size-1)) / (size),
    //   unitHeight : (this.gameWidth - this.gap * (size-1)) / (size)
    // };

    this.unitMeasurement = {
        unitWidth : this.gameWidth / 16,
        unitHeight : this.gameWidth / 16
      };

    if (this.gameWidth < 400){
      this.unitMeasurement = {
        unitWidth : 35,
        unitHeight : 35
      };
    } else if (this.gameWidth > 1200){
      this.unitMeasurement = {
        unitWidth : 60,
        unitHeight : 60
      };
    }

  }

  start() {
  }

  moveLevelOutsideFrame(){
    let unitsAreOutsideTheCanvas = true;
      [...this.units].forEach((object) => {
        object.changeXCenter(this.dx)
        if (object.position.x + object.pathRadius > this.rect.left){
          unitsAreOutsideTheCanvas = false;
        }
      });

      return unitsAreOutsideTheCanvas  
  }

  moveLevelInsideFrame(){
    [...this.units].forEach((object) => {
      object.changeXCenter(-this.dx);
    });
  }

  update(deltaTime) {
    // Error Fliccker effect
    for (const [key, value] of Object.entries(this.unitErrors)) {
      this.unitErrors[key]--;
      if (this.unitErrors[key] == 0 ){
        delete this.unitErrors[key]

      }
    }
    // this is were the transition between levels is handled
    if (this.currentBoard.length == this.candidateAnswer.length ) {
      if (this.gamestate === GAMESTATE.RUNNING) {
        this.updateGameState(GAMESTATE.LEVELDONE)
      }
    }

    if (this.gamestate === GAMESTATE.LEVELDONE){

      this.dx = - 2 * this.rect.right / this.step;
      if (this.moveLevelOutsideFrame()){
        this.centeredXMod = 2 * this.rect.right;
        this.dx = this.centeredXMod / this.step;
        this.updateGameState(GAMESTATE.NEWLEVEL)
        this.updateCurrentSequence(this.currentSequence + 1)
        this.units = drawBoard(this)
      }
    }

    if (this.gamestate === GAMESTATE.NEWLEVEL){
      if (Math.floor(this.centeredXMod) <= 0 ){
        this.dx = 0
        this.centeredXMod = 0
        this.updateGameState(GAMESTATE.RUNNING)

      }else{
        this.moveLevelInsideFrame()
      }
      this.centeredXMod = this.centeredXMod - this.dx;     

    }

    // this is where all the helper screens will be loaled #helperScreensCode
    if (this.gamestate === GAMESTATE.LOADING){

      if (this.loadingBar.loaded()){
        this.loadingBar.hide()
            if (this.loadingBar.hidden()){
              this.updateGameState(GAMESTATE.RUNNING)

            }

          
      }
    }
  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.RUNNING || this.gamestate === GAMESTATE.LEVELDONE || this.gamestate === GAMESTATE.NEWLEVEL) {
      [...this.units].forEach((object) => {
        object.draw(ctx)
      });
    }

    // if (this.gamestate === GAMESTATE.RUNNING) {
    //   this.menu.draw(ctx)
    // }
  }

  updateGameState(state){
    this.gamestate = state;
  }

  checkPlayButtonClick(clientX, clientY){
    if (circleAndMouseCollissionDetection(this.gameWidth/2, this.gameHeight/2, this.menu.buttonRadius, this.mouse)){
      this.updateGameState(GAMESTATE.RUNNING)
    }
  }

  handleUnitClick(clientX, clientY){
    this.clicked = {
      x:clientX,
      y:clientY
    };
 

    [...this.units].forEach((object) => {
      // find the Grid Unit that was actually clicked
      if (circleAndMouseCollissionDetection(object.position.x, object.position.y, object.pathRadius, this.clicked)){
        // Here check whether the value clicked is the next correct item in the correct sequence
        // if true then proceed with the click event
        // if false then notify the player
        let value = this.shuffledBoard[object.row];
        let position = this.candidateAnswer.length
        if (this.currentBoard[position] == value) {
          this.candidateAnswer.push(value)

        }else{
          this.unitErrors[value] = 80
        }
        
      }
    });
  }


  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
