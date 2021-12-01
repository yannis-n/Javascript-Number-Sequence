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


export function drawBoard(game){
    let size = game.sequences[game.currentSequence].length
    let currentSequence = game.currentSequence
    let sequence = game.sequences[currentSequence]
    let dimensions = game.currentDimensions;

    let units = [];
    // Position The Grid in the Middle of the Game
    const centeredX = (game.gameWidth)/2 - (game.unitMeasurement.unitWidth) * (dimensions.row - 1) - game.gap * (dimensions.row-1);
    const centeredY = (game.gameHeight)/2 - (game.unitMeasurement.unitHeight) * (dimensions.col - 1) - game.gap * (dimensions.col-1);
    let i = 0

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