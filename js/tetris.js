import BLOCKS from "./blocks.js";

//DOM 
const playground = document.querySelector(".playground > ul"); //- ulを呼び出す(選択)
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");


//Setting 
const GAME_ROWS = 20; 
const GMAE_COLS = 10;

//variables
let score = 0;      //点数
let duration = 500; //ブロックが落下する時間
let downInterval;
let tempMovingItem; //movingItemを実行する前に保管する変数


const movingItem = {      //ブロックの情報を持っている変数
    type: "",
    direction: 0,       //ブロックの回転
    top: 0,             //ブロックの高さ
    left: 3,            //ブロックの左右
};
init() //Scriptが始めるときに一番最初に呼び出される

function init(){
    tempMovingItem = { ...movingItem }; 
    for(let i = 0; i < GAME_ROWS; i++) {           // li 20個作成
        prependNewLine()
    }
    generateNewBlock()  // ブロック作成関数実行
}
function prependNewLine(){                       // li 10個作成
    const li = document.createElement("li");   
    const ul = document.createElement("ul");
    for(let j=0; j<GMAE_COLS; j++){                 
        const matrix = document.createElement("li");    
        ul.prepend(matrix); 
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(moveType = ""){       //ブロック作成機能
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");//移動した後に与えたClassを抜く
    movingBlocks.forEach((moving) =>{
        moving.classList.remove(type, "moving"); 
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] +left;               //ブロックの初期の位置
        const y = block[1] +top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;　//playground座標外にブロックが出たか確認
        const isAvailable = checkEmpty(target); //下にブロックがあるか確認
        if (isAvailable){
            target.classList.add(type, "moving") //ブロックにクラスを与える
        } else {
            tempMovingItem = { ...movingItem } //範囲外に出たとき元に戻す
            if(moveType ==="retry"){           //ゲーム終了機能
                clearInterval(downInterval);
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry')       
                if(moveType === "top"){
                    seizBlock();                
                }
            }, 0)
            return true;
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function showGameoverText() {
    gameText.style.display = "flex";
  }
function seizBlock(){       //ブロックが一番下まで降りた時に固定する機能
    const movingBlocks = document.querySelectorAll(".moving");  
    movingBlocks.forEach(moving =>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
    }
    function checkMatch(){          //１段が隙間なく埋まると一段を消す機能
        
        const childNodes = playground.childNodes;
        childNodes.forEach(child=>{
                let matched = true;
                child.children[0].childNodes.forEach(li=>{
                    if(!li.classList.contains("seized")){
                        matched = false;
                    }
                })
                if(matched){
                    child.remove();
                    prependNewLine()    //一番上の１段を新たに追加
                    score++             //スコアが追加する
                    scoreDisplay.innerText = score;
                }
        })

        generateNewBlock()
    }
    function generateNewBlock(){        //新たにブロック作成機能
        clearInterval(downInterval);    //自動で下に降りる
        downInterval = setInterval(()=>{
            moveBlock('top',1)
        },duration)
        const blockArray = Object.entries(BLOCKS);  //ランダムでブロックが作成
        const randomIndex = Math.floor(Math.random()* blockArray.length)
        movingItem.type = blockArray[randomIndex][0]
        movingItem.top = 0;
        movingItem.left = 3;
        movingItem.direction = 0;
        tempMovingItem = { ...movingItem};
        renderBlocks()
    }
function checkEmpty(target){            //下にブロックがあるか確認する機能
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {      //ブロックの移動機能
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function changeDirection(){         //ブロックを回す機能
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction =0 : tempMovingItem.direction+=1;   
    renderBlocks()
}
function dropBlock(){                   //スペースバーを押したら早い速度で落下する機能
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top",1)
    }, 10);
}
// event handling
document.addEventListener("keydown", e=> {      //キ方向キーを押すとTOP,LEFTの値を変更する機能
    switch(e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
            case 37:
                moveBlock("left", -1);
                break;
            case 40:
                moveBlock("top", 1);
                break;
            case 38:
                changeDirection();          
                break;
            case 32 :
                dropBlock();
                break;
                default:
                    break;
    }
})

restartButton.addEventListener("click", ()=>{   //reStartする機能
    playground.innerHTML = "";
    gameText.style.display = "none"
    init()
})