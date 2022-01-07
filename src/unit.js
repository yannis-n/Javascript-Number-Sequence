import { circleAndMouseCollissionDetection } from "../src/helper.js";

export default class Unit {
  constructor(game, position, unitMeasurement, row) {

    this.game = game;

    this.position = position;
    this.width = unitMeasurement.unitWidth;
    this.height = unitMeasurement.unitHeight;
    this.row = row;
    this.pathRadius = this.width
  }

  updateSize(position, unitMeasurement) {
    this.position = position;
    this.width = unitMeasurement.unitWidth;
    this.height = unitMeasurement.unitHeight;
    this.pathRadius = this.width
  }

  drawUnit(ctx, row, col, start, end ){
    ctx.strokeStyle="rgba(0,0,0,0.9)";
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineWidth =0.2;
    if ((this.row == 0 && start[1] == end[1] && start[0] < end[0])
        || (this.row == 8 && start[1] == end[1] && start[0] > end[0])
        || (this.col == 0 && start[0] == end[0] && start[1] > end[1])
        || (this.col == 8 && start[0] == end[0] && start[1] < end[1])){
      ctx.lineWidth =2;

    }else if ((this.col % 3 == 2 && start[0] == end[0] && start[1] < end[1])
    || (this.row % 3 == 2 && start[1] == end[1] && start[0] > end[0])){
        ctx.lineWidth =1;

    }
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  }


  // draw the unit circle with different border widths
  changeXCenter(dx){
    this.position.x = this.position.x + dx;
  }

  draw(ctx) {
    const row = this.row;
    let currentValue =this.game.shuffledBoard[row] 

    let pathRadius = this.pathRadius   
    // draw the unit perimeter
    ctx.beginPath();
    if(this.game.candidateAnswer.includes(currentValue)){
      ctx.strokeStyle = 'rgba(0,114,227,0.1)';
      ctx.fillStyle = "rgba(0,114,227,0.1)";
    }else if (this.game.unitErrors[currentValue] > 0 && this.game.unitErrors[currentValue] % 12 == 0 ){
      ctx.strokeStyle = 'rgba(255,0,0,1)';
      ctx.fillStyle = "rgba(255,0,0,1)";
    }else if (circleAndMouseCollissionDetection(this.position.x, this.position.y, this.pathRadius, this.game.mouse) && this.game.gamestate == this.game.GAMESTATE.RUNNING){
      ctx.strokeStyle = 'rgba(0,114,227,0.8)';
      ctx.fillStyle = "rgba(0,114,227,0.8)";
    }else{
        ctx.strokeStyle = 'rgba(0,114,227,1)';
        ctx.fillStyle = "rgba(0,114,227,1)";
    }
    
    ctx.arc(this.position.x, this.position.y, this.pathRadius, 0, 2 * Math.PI);
    ctx.fill();


    // add a number if it exists

   
        ctx.fillStyle = "#fff";

      
      ctx.font = this.game.unitMeasurement.unitWidth /1.3+ "px Source Sans Pro,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = 'middle';

      ctx.fillText(currentValue, this.position.x, this.position.y + 2);
    


    

    
    // ctx.beginPath();

  
  }
}
