"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const config_1 = __importDefault(require("./config"));
const prompt = (0, prompt_sync_1.default)({ sigint: true });
var CellValue;
(function (CellValue) {
    CellValue["fieldCharacter"] = "\u2591";
    CellValue["pathCharacter"] = "*";
    CellValue["hat"] = "^";
    CellValue["hole"] = "O";
})(CellValue || (CellValue = {}));
var Direction;
(function (Direction) {
    Direction["down"] = "d";
    Direction["up"] = "u";
    Direction["left"] = "l";
    Direction["right"] = "r";
})(Direction || (Direction = {}));
class Field {
    constructor() {
        this.fieldMatrix = new Array(config_1.default.height);
        this.field = "";
        this.numOfHoles = config_1.default.numberOfHoles;
        this.characterRowLocation = 0;
        this.characterColumnLocation = 0;
        for (let i = 0; i < config_1.default.height; i++) {
            this.fieldMatrix[i] = new Array(config_1.default.width);
        }
        this.generateField();
        this.generateHoles();
        this.generateHat();
        this.renderField();
    }
    generateField() {
        for (let i = 0; i < config_1.default.height; i++) {
            for (let j = 0; j < config_1.default.width; j++) {
                this.fieldMatrix[i][j] = {
                    cellValue: CellValue.fieldCharacter,
                    previousNodeValue: 0,
                    currentNodeValue: 0,
                    scanned: false
                };
            }
        }
        this.fieldMatrix[0][0] = {
            cellValue: CellValue.pathCharacter,
            previousNodeValue: 0,
            currentNodeValue: 0,
            scanned: true
        };
    }
    generateHoles() {
        for (let index = 0; index < this.numOfHoles; index++) {
            this.generateRndPositions(CellValue.hole);
        }
    }
    generateHat() {
        this.generateRndPositions(CellValue.hat);
    }
    generateRndPositions(cellValue) {
        let rndRow = Math.floor(Math.random() * config_1.default.height);
        let rndCol = Math.floor(Math.random() * config_1.default.width);
        while (this.fieldMatrix[rndRow][rndCol].cellValue == CellValue.hole ||
            this.fieldMatrix[rndRow][rndCol].cellValue == CellValue.pathCharacter) {
            rndRow = Math.floor(Math.random() * config_1.default.height);
            rndCol = Math.floor(Math.random() * config_1.default.width);
        }
        this.fieldMatrix[rndRow][rndCol].cellValue = cellValue;
    }
    renderField() {
        this.addGValue();
        this.field = this.fieldMatrix.map((innerArray) => innerArray.map((node) => `${node.cellValue}-${node.currentNodeValue}`).join(" ")).join("\n");
    }
    getField() {
        return this.field;
    }
    addGValue() {
        // loop 
        for (let i = 0; i < this.fieldMatrix.length; i++) {
            for (let j = 0; j < this.fieldMatrix[0].length - 1; j++) {
                let currentNode = this.fieldMatrix[i][j].currentNodeValue;
                // loop to left
                if (j > 0) {
                    for (let k = this.fieldMatrix[0].length - 1; i >= 0; i--) {
                        if (this.fieldMatrix[i][k - 1].scanned) {
                            break;
                        }
                    }
                }
                // let nextNode =  this.fieldMatrix[k][j + 1];
                // if (nextNode.cellValue === CellValue.hole || nextNode.scanned) { 
                //   break; 
                // }
                // if (k > 0) {
                //   if (!this.fieldMatrix[k - 1][j].scanned) {}
                // }
                // this.fieldMatrix[k][j + 1].previousNodeValue = currentNode;
                // this.fieldMatrix[k][j + 1].currentNodeValue = currentNode + 1;
                // this.fieldMatrix[k][j + 1].scanned = true;
            }
        }
        for (let j = 0; j < this.fieldMatrix.length - 1; j++) {
            for (let i = 0; i < this.fieldMatrix[0].length; i++) {
                let currentNode = this.fieldMatrix[i][j].currentNodeValue;
                let nextNode = this.fieldMatrix[i + 1][j];
                if (nextNode.cellValue === CellValue.hole || nextNode.scanned) {
                    break;
                }
                this.fieldMatrix[i + 1][j].previousNodeValue = currentNode;
                this.fieldMatrix[i + 1][j].currentNodeValue = currentNode + 1;
                this.fieldMatrix[i + 1][j].scanned = true;
            }
        }
        // let row = 0;
        // let column = 0;
        // while (row < this.fieldMatrix.length && column < this.fieldMatrix[0].length) {
        //   let currentNode = this.fieldMatrix[row][column].currentNodeValue;
        //   if (this.fieldMatrix[row][column + 1] || this.fieldMatrix[row][column + 1].cellValue !== CellValue.hole) {
        //     this.fieldMatrix[row][column + 1].previousNodeValue = currentNode;
        //     this.fieldMatrix[row][column + 1].currentNodeValue = currentNode + 1;
        //   }
        // }
    }
    checkForValidGame() {
        return false;
    }
    updatePath(inputDirection) {
        const convertInputDirection = inputDirection.toString().toLocaleLowerCase();
        switch (convertInputDirection) {
            case Direction.up:
                if (this.characterRowLocation === 0) {
                    console.log(`Can't go up.`);
                    this.renderField();
                    return true;
                }
                else {
                    this.characterRowLocation--;
                    if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
                        console.log('You fell in a hole... Game Over!');
                        return false;
                    }
                    else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
                        console.log('You won!');
                        return false;
                    }
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue = CellValue.pathCharacter;
                    this.fieldMatrix[this.characterRowLocation + 1][this.characterColumnLocation].cellValue = CellValue.fieldCharacter;
                    this.renderField();
                    return true;
                }
            case Direction.down:
                if (this.characterRowLocation === this.fieldMatrix.length - 1) {
                    console.log(`Can't go down.`);
                    this.renderField();
                    return true;
                }
                else {
                    this.characterRowLocation++;
                    if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
                        console.log('You fell in a hole... Game Over!');
                        return false;
                    }
                    else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
                        console.log('You won!');
                        return false;
                    }
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue = CellValue.pathCharacter;
                    this.fieldMatrix[this.characterRowLocation - 1][this.characterColumnLocation].cellValue = CellValue.fieldCharacter;
                    this.renderField();
                    return true;
                }
            case Direction.right:
                if (this.characterColumnLocation === this.fieldMatrix.length - 1) {
                    console.log(`Can't go right.`);
                    this.renderField();
                    return true;
                }
                else {
                    this.characterColumnLocation++;
                    if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
                        console.log('You fell in a hole... Game Over!');
                        return false;
                    }
                    else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
                        console.log('You won!');
                        return false;
                    }
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue = CellValue.pathCharacter;
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation - 1].cellValue = CellValue.fieldCharacter;
                    this.renderField();
                    return true;
                }
            case Direction.left:
                if (this.characterColumnLocation === 0) {
                    console.log(`Can't go left.`);
                    this.renderField();
                    return true;
                }
                else {
                    this.characterColumnLocation--;
                    if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
                        console.log('You fell in a hole... Game Over!');
                        return false;
                    }
                    else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
                        console.log('You won!');
                        return false;
                    }
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue = CellValue.pathCharacter;
                    this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation + 1].cellValue = CellValue.fieldCharacter;
                    this.renderField();
                    return true;
                }
            default:
                console.log(`Invalid key, try using the keys ${Direction.down} (down), ${Direction.up} (up), ${Direction.right} (right) or ${Direction.left} (left)`);
                return true;
        }
    }
}
class Game {
    constructor() {
        this.isPlaying = true;
        this.field = new Field();
    }
    play() {
        while (this.isPlaying) {
            console.log(this.field.getField());
            let directionInput = prompt("Which direction? ");
            this.checkUserInput(directionInput);
            this.isPlaying = this.field.updatePath(directionInput);
        }
    }
    checkUserInput(userInput) {
        const sanitizedInput = userInput.toLowerCase().trim();
        const feedBack = "You must enter the letters 'd','l','u'";
        switch (sanitizedInput) {
            case Direction.down:
                break;
            case Direction.left:
                break;
            case Direction.right:
                break;
            case Direction.up:
                break;
            default:
                console.log(feedBack);
        }
    }
}
new Game().play();
//# sourceMappingURL=main.js.map