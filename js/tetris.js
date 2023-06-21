//DOM
const playground = document.querySelector(".playground > ul");

//Setting
const GAME_ROWS = 20;
const GMAE_COLS = 10;



console.log(playground)

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
    tree: [
        [[2,1],[0,1],[1,1],[1,0]],
        [],
        [],
        [],
    ]
}
let movingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 3,
};
init()
//functions
function init(){
    tempMovingItem = { ...movingItem };
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    renderBlocks()
}
function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j<GMAE_COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(){
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].forEach(block => {
        const x = block[0] +left;
        const y = block[1] +top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            setTimeout(()=>{
                renderBlocks();
                if(moveType === "top"){
                    seizBlock();
                }
            }, 0)
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizBlock(){

}
function checkEmpty(target){
    if(!target){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks()
}

// event handling
document.addEventListener("keydown", e=> {
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
                default:
                    break;
    }
    //console.log(e)
})