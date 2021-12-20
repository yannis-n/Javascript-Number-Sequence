import Unit from "./unit.js";

export function createBoard(game){
        let currentSequence = game.currentSequence
        let sequence = game.sequences[currentSequence]
        let board = []
        for (let i = 0; i < 9; i++) {
            const characters = puzzleArray.splice(0, 9)
            board.push(characters)
        }

        return board

    }


export function drawBoard(game, unitsToBeUpdated = []){
    let size = game.sequences[game.currentSequence].length
    let currentSequence = game.currentSequence
    let sequence = game.sequences[currentSequence]
    let dimensions = game.currentDimensions;

    let units = [];
    // Position The Grid in the Middle of the Game
    let centeredX = (game.gameWidth)/2 - (game.unitMeasurement.unitWidth) * (dimensions.row - 1) - game.gap * (dimensions.row-1);
    if (game.centeredXMod > 0){
        centeredX += game.centeredXMod
    }
    let centeredY = (game.gameHeight)/2 - (game.unitMeasurement.unitHeight) * (dimensions.col - 1) - game.gap * (dimensions.col-1);
    let i = 0

    if (unitsToBeUpdated.length > 0){
        unitsToBeUpdated.forEach((object, rowIndex) => {
            let index = rowIndex % dimensions.row
            let col = rowIndex % dimensions.col
            i++;
            let position = {
                x: centeredX + 2 * (game.unitMeasurement.unitWidth + game.gap) * index ,
                y: centeredY + 2 * (game.unitMeasurement.unitHeight + game.gap) * col 
            };
            object.updateSize(position, game.unitMeasurement);
        });
        return unitsToBeUpdated

    }else{
        game.shuffledBoard.forEach((item, rowIndex) => {
            let index = rowIndex % dimensions.row
            let col = rowIndex % dimensions.col
            i++;
            let position = {
                x: centeredX + 2 * (game.unitMeasurement.unitWidth + game.gap) * index ,
                y: centeredY + 2 * (game.unitMeasurement.unitHeight + game.gap) * col 
            };
            units.push(new Unit(game, position, game.unitMeasurement, rowIndex))
        })
          return units
    }

}
