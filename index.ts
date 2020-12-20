let buttons: NodeListOf<Element> = document.querySelectorAll(".button_game");
const menu: HTMLElement = document.getElementById("menu_container");
const main_container: HTMLElement = document.getElementById("main_container");
const end_of_game_container: HTMLElement = document.getElementById("end_of_game_container");
const play_Again_Button: HTMLElement = document.getElementById("play_again_button");
const result_Of_wrong_click_right_click: HTMLElement = document.getElementById("wrong_click_right_click");
const result_time_in_Play: HTMLElement = document.getElementById("time_in_play");
const winOrLoseTitle: HTMLElement = document.getElementById("win_or_lose_title");
type Levels = "Łatwy" | "Średni" | "Trudny";
const colorsArray: string[] = ["#6e0051", "#585d4f", "#ae49c4", "#c155a3", "#9d5c3b", "#013f00", "#905b4e",
  "#3a4391", "#646908", "#7c11b7", "#ca4959", "#d7b803", "#577ade", "#7556bb", "#4f7eaf", "#e65560", "#58a798", "#ebf8ca",
  "#5b2c59", "#6e6969", "#12b105", "#86baaa", "#204993", "#444446", "#53ac1d", "#51ade7"];

interface ColorObjects {
  color: string,
  id: string,
  isDiscover:boolean,
  number?:number
}
interface PropertyOfSquare{
  numberOfSquare: number,
  row: number,
  column: number,
  timeToShowColors: number,
  howMuchSameColor: number,
  gameWithNumber:boolean
  timeForPlay?:number
}
class Game{
  level: Levels;
  propOfSquare: PropertyOfSquare;
  map: HTMLElement;
  widthOfOneSquare: number;
  heightOfOneSquare: number;
  arrayOfColors: ColorObjects[];
  objectsInMap: any; 
  tmpCard: EventTarget;
  rightClicks: number = 0;
  wrongClicks: number = 0;
  endGame: boolean = false;
  timeInPlay: number = 0;
  interval;
  square_numbers: HTMLElement[] = []
  constructor(level:Levels) {
    this.level = level
    this.createMap()
  }
  createMap() {
    menu.style.display = 'none';
    this.map= document.createElement("div");
    this.map.className = "map_container";
    main_container.appendChild(this.map);
    this.propOfSquare = this.getNumberofSquare(this.level);
    this.widthOfOneSquare = (this.map.offsetWidth / (this.propOfSquare.column))-3;
    this.heightOfOneSquare = (this.map.offsetHeight / (this.propOfSquare.row))-3;
    this.pushReadyElementsToMap()
    this.objectsInMap = document.querySelectorAll(".square");
    this.eventsClickOnSquares()
  }
  countTimeInplay(OrCounter:boolean) {
    this.interval = setInterval(this.count.bind(this), 1000)
    if (OrCounter == false) {
      clearInterval(this.interval);
    }
  }
  count() {
    this.timeInPlay++;
  }
  eventsClickOnSquares() {
    let tmpCurrentCard: HTMLElement;
    let tmpCurrentCard2: HTMLElement;
    let tmpCurrentNumber: HTMLElement;
    let tmpCurrentNumber2: HTMLElement;
    function clearExistColors() {
      tmpCurrentCard2.style.backgroundColor = "black";
      tmpCurrentCard2.style.cursor = "pointer";
      tmpCurrentCard2 = undefined;
      tmpCurrentCard.style.backgroundColor = "black";
      tmpCurrentCard.style.cursor = "pointer";
      tmpCurrentCard = undefined;
      if (tmpCurrentNumber != undefined && tmpCurrentNumber2 != undefined) {
        tmpCurrentNumber2.innerHTML = "";
        tmpCurrentNumber.innerHTML = "";
        tmpCurrentNumber = undefined;
        tmpCurrentNumber2 = undefined;
      }
    }
    setTimeout(() => {
      this.countTimeInplay(true);
      let takeAllSquareNumber:NodeList =  document.querySelectorAll(".square_number");
      for (const eleNumber of takeAllSquareNumber) {
        (eleNumber as HTMLElement).innerHTML = "";
        this.square_numbers.push((eleNumber as HTMLElement))
      }
      for (const el of this.objectsInMap) {
        el.style.backgroundColor = "black";
        el.addEventListener("click", (e) => {
          if (tmpCurrentCard != undefined && tmpCurrentCard2 != undefined && this.endGame == false) {
            clearExistColors();
          }
          let ojb: ColorObjects = this.arrayOfColors.find(col => col.id === e.target.id);
          if (this.tmpCard == undefined && ojb.isDiscover == false && this.endGame == false) {
            this.tmpCard = e.target;
            e.target.style.cursor = "not-allowed";
            e.target.style.backgroundColor = ojb.color;
            if (this.propOfSquare.gameWithNumber) {
              tmpCurrentNumber2 = this.square_numbers.find(num => num.id === e.target.id);
              tmpCurrentNumber2.innerHTML = ojb.number.toString()
            }
            //jesli gra z numerami to pasowało by i numer wyswietlic
          }else if (this.tmpCard != undefined && (this.tmpCard as HTMLElement).id != e.target.id && ojb.isDiscover == false && this.endGame == false) {
            let ojbNew: ColorObjects = this.arrayOfColors.find(col => col.id === (this.tmpCard as HTMLElement).id)
            e.target.style.cursor = "not-allowed";
            e.target.style.backgroundColor = ojb.color;
            if (this.propOfSquare.gameWithNumber) {
              tmpCurrentNumber = this.square_numbers.find(num => num.id === e.target.id);
              tmpCurrentNumber.innerHTML = ojb.number.toString();
            }
            if (ojb.color === ojbNew.color && this.propOfSquare.gameWithNumber && ojbNew.number === ojb.number) {
              ojb.isDiscover = true;
              ojbNew.isDiscover = true;
              this.tmpCard = undefined;
              this.rightClicks++;
            }else if (ojb.color === ojbNew.color &&!this.propOfSquare.gameWithNumber) {
              ojb.isDiscover = true;
              ojbNew.isDiscover = true;
              this.tmpCard = undefined;
              this.rightClicks++;
            } else {
              this.wrongClicks++;
              tmpCurrentCard = this.tmpCard as HTMLElement;
              tmpCurrentCard2 = e.target as HTMLElement;
              this.tmpCard = undefined;
              setTimeout(() => {
                if (tmpCurrentCard2 != undefined && tmpCurrentCard != undefined) {
                  clearExistColors();
                }
              }, 500);
            }

          } 
          if (this.rightClicks == this.propOfSquare.numberOfSquare / 2 &&this.endGame == false) {
            this.endGameFunction(true);
          }
        })
      }
    }, this.propOfSquare.timeToShowColors);
  }
  endGameFunction(win_lose: boolean) {
    this.endGame = true;
    this.countTimeInplay(false);
    if (win_lose) {
      //true to wygrana
      winOrLoseTitle.innerHTML = "Gratulację wygrałeś!";
      result_Of_wrong_click_right_click.innerHTML = `Błędnych kliknięć: ${this.wrongClicks.toString()}`;
      result_time_in_Play.innerHTML = `Gra trwała ${this.timeInPlay.toString()} sekund`
    } else if (!win_lose) {
      winOrLoseTitle.innerHTML = "Zawiodłeś!";
      result_Of_wrong_click_right_click.innerHTML = `Poprawnych kliknięć: ${this.rightClicks.toString()}`;
      result_time_in_Play.innerHTML = `Twoje ${this.propOfSquare.timeForPlay} sekund mineło`
      //przegrana
    }
    end_of_game_container.style.display = "flex";
    play_Again_Button.addEventListener("click", () => {
      end_of_game_container.style.display = "none";
      this.map.remove();
      menu.style.display = 'flex';
    })
  }
  pushReadyElementsToMap() {
    this.arrayOfColors = this.getColors();
    for (const el of this.arrayOfColors) {
      let div: HTMLElement = document.createElement('div');
      div.id = el.id;
      div.className = "square";
      div.style.backgroundColor = el.color;
      div.style.height = this.heightOfOneSquare.toString() + 'px';
      div.style.width = this.widthOfOneSquare.toString() + 'px';
      if (el.number != undefined) {
        let p: HTMLElement = document.createElement('P');
        p.id = el.id;
        p.innerHTML = el.number.toString();
        p.className = "square_number"
        div.appendChild(p);
      }
      this.map.appendChild(div);
    }
  }
  getNumberofSquare(lvl: string): PropertyOfSquare {
   let property: PropertyOfSquare;
    if (lvl == "Łatwy") {
       property = {
        numberOfSquare: 24,
        row: 4,
        column: 6,
         timeToShowColors: 1000,
         howMuchSameColor: 2,
         gameWithNumber:true
      };
    } else if (lvl == "Średni") {
       property = {
        numberOfSquare: 30,
        row: 5,
        column: 6,
         timeToShowColors: 2000,
         howMuchSameColor: 2,
         gameWithNumber:false
      };
    } else if (lvl == "Trudny") {
       property = {
        numberOfSquare: 42,
        row: 7,
        column: 6,
         timeToShowColors: 1000,
         howMuchSameColor: 2,
         gameWithNumber:false
      };
    }
    return property;
  }
  getColors(): ColorObjects[]{
    let tmpArrayOfColors: string[] = colorsArray;
    let arraytToReturn: ColorObjects[] = [];
    let arrayOfNumbers: number[] = [];
    let tmp: number = 0;
    let tmpNumberToPlay: number;
    for (let k: number = 0; k < 50; k++){
      arrayOfNumbers.push(Math.floor(Math.random() * 501))
    }
    for (let i: number = 0; i < this.propOfSquare.numberOfSquare / this.propOfSquare.howMuchSameColor; i++){
      let numTmp: number = Math.floor(Math.random() * tmpArrayOfColors.length)
      for (let j: number = 0; j < this.propOfSquare.howMuchSameColor; j++){
        let col: ColorObjects = {
          color: tmpArrayOfColors[numTmp],
          id: Math.random().toString(36).substring(7).toString(),
          isDiscover:false
        }
        if (this.propOfSquare.gameWithNumber &&tmp == 0) {
          tmpNumberToPlay = Math.floor(Math.random() * arrayOfNumbers.length)
          col.number = tmpNumberToPlay
          tmp++;
        } else if (this.propOfSquare.gameWithNumber && tmp === 1) {
          col.number = tmpNumberToPlay;
          tmp = 0;
          let indexOfarNumber: number = arrayOfNumbers.indexOf(arrayOfNumbers[ tmpNumberToPlay])
          arrayOfNumbers.splice(indexOfarNumber, 1);
        }
        arraytToReturn.push(col);
      }

      let indexOfar: number = tmpArrayOfColors.indexOf(tmpArrayOfColors[numTmp])
      tmpArrayOfColors.splice(indexOfar, 1);
    }
    for (let x: number = arraytToReturn.length - 1; x > 0; x--){
      let j: number = Math.floor(Math.random() * (x + 1))
      let k: ColorObjects = arraytToReturn[x]
      arraytToReturn[x] = arraytToReturn[j]
      arraytToReturn[j]=k
    }
    console.log(arraytToReturn)
    return arraytToReturn
    
  }
}
class GameOnTime extends Game{
  constructor(level:Levels) {
    super(level)
  }
  count() {
    super.count();
    if (this.propOfSquare.timeForPlay - this.timeInPlay === 0) {
      clearInterval(this.interval)
      this.endGameFunction(false);
    }
  }

  getNumberofSquare(lvl: string): PropertyOfSquare {
    let property: PropertyOfSquare;
     if (lvl == "Łatwy") {
        property = {
         numberOfSquare: 24,
         row: 4,
         column: 6,
          timeToShowColors: 1000,
          timeForPlay:60,
          howMuchSameColor: 2,
          gameWithNumber:true
       };
     } else if (lvl == "Średni") {
        property = {
         numberOfSquare: 30,
         row: 5,
         column: 6,
          timeToShowColors: 2000,
          howMuchSameColor: 2,
          timeForPlay:120,
          gameWithNumber:false
       };
     } else if (lvl == "Trudny") {
        property = {
         numberOfSquare: 42,
         row: 7,
         column: 6,
          timeToShowColors: 1000,
          timeForPlay:180,
          howMuchSameColor: 2,
          gameWithNumber:false
       };
     }
     return property;
   }
}
class GameOnNumbers extends Game{
  constructor(level:Levels) {
    super(level)
  }
  getNumberofSquare(lvl: string): PropertyOfSquare {
    let property: PropertyOfSquare;
    if (lvl == "Łatwy") {
      property = {
       numberOfSquare: 24,
       row: 4,
       column: 6,
        timeToShowColors: 4000,
        howMuchSameColor: 8,
        gameWithNumber:true
     };
   } else if (lvl == "Średni") {
     property = {
       numberOfSquare: 36,
       row: 6,
       column: 6,
        timeToShowColors: 3000,
       howMuchSameColor: 6,
       gameWithNumber:true
       
     };
   } else if (lvl == "Trudny") {
     property = {
       numberOfSquare: 42,
       row: 6,
       column: 7,
        timeToShowColors: 2000,
       howMuchSameColor: 6,
       gameWithNumber:true
     };
   }
   return property;
  }
}
class GamesOnNumberWithTime extends GameOnTime{
  constructor(level: Levels) {
    super(level)
  }
  getNumberofSquare(lvl: string): PropertyOfSquare {
    let property: PropertyOfSquare;
    if (lvl == "Łatwy") {
      property = {
       numberOfSquare: 24,
       row: 4,
       column: 6,
        timeToShowColors: 4000,
        timeForPlay:60,
        howMuchSameColor: 8,
        gameWithNumber:true
     };
   } else if (lvl == "Średni") {
     property = {
       numberOfSquare: 36,
       row: 6,
       column: 6,
       timeToShowColors: 3000,
        timeForPlay:120,
       howMuchSameColor: 6,
       gameWithNumber:true
       
     };
   } else if (lvl == "Trudny") {
     property = {
       numberOfSquare: 42,
       row: 6,
       column: 7,
       timeToShowColors: 2000,
        timeForPlay:180,
       howMuchSameColor: 6,
       gameWithNumber:true
     };
   }
   return property;
  }
}
for (const but of buttons) {
  but.addEventListener("click", (e) => {
    let level: Levels = ((e.target as Element).textContent) as Levels
    if (but.parentElement.id === "Only_Colors") {
      let game = new Game(level)
    }else if (but.parentElement.id === "Colors_For_Time") {
      let gameOnTime = new GameOnTime(level);
    }else if (but.parentElement.id === "Colors_and_numbers") {
      let gameOnNumbers = new GameOnNumbers(level);
    }else if (but.parentElement.id === "Colors_and_numbers_on_time") {
      let gameOnNumbersWithTime = new GamesOnNumberWithTime(level)
    }
  })
}

