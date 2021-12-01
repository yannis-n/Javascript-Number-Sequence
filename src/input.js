export default class InputHandler {
    constructor(game, GAMESTATE) {
          this.game = game
          this.GAMESTATE = GAMESTATE  
    }

    init(){
      // addEventListener('mousemove', event => {
      //   this.game.mouse.x = event.clientX;
      //   this.game.mouse.y = event.clientY;
      // });

      document.addEventListener("click", e => {
        if (this.game.gamestate === this.GAMESTATE.MENU) {
          this.game.checkPlayButtonClick(e.clientX-rect.x, e.clientY-rect.y);
        }
      });

  
        
        document.addEventListener("click", e => {
          if (this.game.gamestate === this.GAMESTATE.RUNNING) {
            const rect = this.game.canvas.getBoundingClientRect()
            console.log(rect)
            this.game.selectUnitClick(e.clientX-rect.x, e.clientY-rect.y);
          }
        });

        document.addEventListener("keydown", event => {
          if (this.game.gamestate === this.GAMESTATE.RUNNING) {
            const isNumber = /^[0-9]$/i.test(event.key)
            if (isNumber){
              this.game.fillNumber(event.key)
            }else{
              switch (event.keyCode) {

        
                case 27:
                  game.togglePause();
                  break;
        

              }
            }
          }
        });

        
    }
  }
  