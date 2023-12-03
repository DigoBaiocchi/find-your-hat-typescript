import promptSync from "prompt-sync";
import config from "./config";
const prompt = promptSync({ sigint: true });

enum CellValue {
  fieldCharacter = "░",
  pathCharacter = "*",
  hat = "^",
  hole = "O",
}

type NodeProperties = {
  cellValue: CellValue,
  previousNodeValue: number,
  currentNodeValue: number,
  scanned: boolean
};

enum Direction {
  down = "d",
  up = "u",
  left = "l",
  right = "r",
}

class Field {
  private fieldMatrix: NodeProperties[][] = new Array<NodeProperties[]>(config.height);
  private field: string = "";
  private numOfHoles: number = config.numberOfHoles;
  private characterRowLocation: number = 0 ;
  private characterColumnLocation: number = 0;
  constructor() {
    for (let i = 0; i < config.height; i++) {
      this.fieldMatrix[i] = new Array<NodeProperties>(config.width);
    }
    this.generateField();
    this.generateHoles();
    this.generateHat();
    this.renderField();
  }
  private generateField(): void {
    for (let i = 0; i < config.height; i++) {
      for (let j = 0; j < config.width; j++) {
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
  private generateHoles(): void {
    for (let index = 0; index < this.numOfHoles; index++) {
      this.generateRndPositions(CellValue.hole);
    }
  }
  private generateHat(): void {
    this.generateRndPositions(CellValue.hat);
  }
  private generateRndPositions(cellValue: CellValue): void {
    let rndRow = Math.floor(Math.random() * config.height);
    let rndCol = Math.floor(Math.random() * config.width);
    while (
      this.fieldMatrix[rndRow][rndCol].cellValue == CellValue.hole ||
      this.fieldMatrix[rndRow][rndCol].cellValue == CellValue.pathCharacter
    ) {
      rndRow = Math.floor(Math.random() * config.height);
      rndCol = Math.floor(Math.random() * config.width);
    }
    this.fieldMatrix[rndRow][rndCol].cellValue = cellValue;
  }
  private renderField(): void {
    this.addGValue();
    this.field = this.fieldMatrix.map((innerArray) => innerArray.map((node) => `${node.cellValue}-${node.currentNodeValue}`).join(" ")).join("\n");
  }
  getField(): string {
    return this.field;
  }

  private addGValue(): void {
    // loop 
    for (let i = 0; i < this.fieldMatrix.length; i++) {
      for (let j = 0; j < this.fieldMatrix[0].length - 1; j++) {
        let currentNode = this.fieldMatrix[i][j].currentNodeValue;
        // loop to left
        if (j > 0) {
          for (let k = this.fieldMatrix[0].length - 1; i >= 0; i--) {
            if (this.fieldMatrix[i][k -1].scanned){
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
        let nextNode =  this.fieldMatrix[i + 1][j];
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

  private checkForValidGame(): boolean {
    
    return false;
  }
  
  updatePath(inputDirection: string): boolean {
    const convertInputDirection = inputDirection.toString().toLocaleLowerCase();
    switch (convertInputDirection) {
      case Direction.up:
        if (this.characterRowLocation === 0) {
          console.log(`Can't go up.`);
          this.renderField();
          return true;
        } else {
          this.characterRowLocation--;
          if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
            console.log('You fell in a hole... Game Over!');
            return false;
          } else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
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
        } else {
          this.characterRowLocation++;
          if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
            console.log('You fell in a hole... Game Over!');
            return false;
          } else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
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
        } else {
          this.characterColumnLocation++;
          if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
            console.log('You fell in a hole... Game Over!');
            return false;
          } else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
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
        } else {
          this.characterColumnLocation--;
          if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hole) {
            console.log('You fell in a hole... Game Over!');
            return false;
          } else if (this.fieldMatrix[this.characterRowLocation][this.characterColumnLocation].cellValue === CellValue.hat) {
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
  private field: Field;
  private isPlaying: boolean = true;
  constructor() {
    this.field = new Field();
  }
  public play(): void {
    while (this.isPlaying) {
      console.log(this.field.getField());
      let directionInput = prompt("Which direction? ");
      this.checkUserInput(directionInput);
      this.isPlaying = this.field.updatePath(directionInput);
    }
  }
  private checkUserInput(userInput: String) {
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
