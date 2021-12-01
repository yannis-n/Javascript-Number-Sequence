import NumberSequence from "../src/game.js";
import { createHiDPICanvas, rectCollisionDetection } from "../src/helper.js";

"use strict";

let canvas = document.getElementById("gameScreen");
var rect = canvas.getBoundingClientRect();
canvas = createHiDPICanvas(rect.width, rect.height);

let ctx = canvas.getContext('2d');

// let ctx = setupCanvas(canvas);

const GAME_WIDTH = rect.width;
const GAME_HEIGHT = rect.height;
const difficulty = 1;

let numberSequence = new NumberSequence(GAME_WIDTH, GAME_HEIGHT, difficulty, canvas);

let lastTime = 0;

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    numberSequence.update(deltaTime)
    numberSequence.draw(ctx)
  
    requestAnimationFrame(gameLoop);
  }
  
  requestAnimationFrame(gameLoop);
  