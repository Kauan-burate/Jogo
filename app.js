const cardsData = [

    {id:1,img:"assets/img/monalisa.jpg"},
    {id:1,img:"assets/img/monalisa.jpg"},

    {id:2,img:"assets/img/homemVitruviano.jpg"},
    {id:2,img:"assets/img/homemVitruviano.jpg"},

    {id:3,img:"assets/img/ultimaCeia.jpg"},
    {id:3,img:"assets/img/ultimaCeia.jpg"},

    {id:4,img:"assets/img/damaComUmArminho.webp"},
    {id:4,img:"assets/img/damaComUmArminho.webp"},

    {id:5,img:"assets/img/ginevra-benci.jpg"},
    {id:5,img:"assets/img/ginevra-benci.jpg"},

    {id:6,img:"assets/img/OBatismodeCristo.jpeg"},
    {id:6,img:"assets/img/OBatismodeCristo.jpeg"},

    {id:7,img:"assets/img/aAnunciação.png"},
    {id:7,img:"assets/img/aAnunciação.png"},

    {id:8,img:"assets/img/OnetKultura.png"},
    {id:8,img:"assets/img/OnetKultura.png"}
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;

const memoryBoard = document.getElementById("memory-board");
const piecesContainer = document.getElementById("pieces-container");
const pairCounter = document.getElementById("pairs");

shuffle(cardsData);

cardsData.forEach(cardData => {

    const card = document.createElement("div");
    card.classList.add("card");

    card.dataset.id = cardData.id;

    card.innerHTML = `
        <div class="face front">
            <img src="assets/img/verso.png">
        </div>

        <div class="face back">
            <img src="${cardData.img}">
        </div>
    `;

    card.addEventListener("click", flipCard);

    memoryBoard.appendChild(card);
});

function flipCard(){

    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.add("flip");

    if(!firstCard){
        firstCard = this;
        return;
    }

    secondCard = this;

    checkMatch();
}

function checkMatch(){

    let match =
        firstCard.dataset.id === secondCard.dataset.id;

    match ? disableCards() : unflipCards();
}

function disableCards(){

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    pairsFound++;

    pairCounter.textContent = pairsFound;

    unlockPuzzlePiece(pairsFound);

    resetBoard();
}

function unflipCards(){

    lockBoard = true;

    setTimeout(()=>{

        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();

    },1000);
}

function resetBoard(){

    [firstCard,secondCard,lockBoard] =
    [null,null,false];
}

function shuffle(array){

    array.sort(()=>Math.random()-0.5);
}

function unlockPuzzlePiece(number){

    const piece = document.createElement("img");

    piece.src = `assets/img/puzzle/p${number}.jpg`;
    piece.classList.add("piece");

    piece.draggable = true;

    piece.dataset.slot = number-1;

    piece.addEventListener("dragstart", dragStart);

    piecesContainer.appendChild(piece);

    if(number === 8){

        setTimeout(()=>{
            alert("Todas as peças foram conquistadas!");
        },500);
    }
}

function dragStart(e){

    e.dataTransfer.setData(
        "piece",
        e.target.src
    );

    e.dataTransfer.setData(
        "slot",
        e.target.dataset.slot
    );
}

const slots = document.querySelectorAll(".slot");

slots.forEach(slot=>{

    slot.addEventListener("dragover",e=>{
        e.preventDefault();
    });

    slot.addEventListener("drop",dropPiece);
});

function dropPiece(e){

    e.preventDefault();

    const src =
    e.dataTransfer.getData("piece");

    const slotIndex =
    e.dataTransfer.getData("slot");

    if(
      this.dataset.slot === slotIndex
    ){

        this.innerHTML =
        `<img src="${src}">`;

        checkPuzzleComplete();
    }
}

function checkPuzzleComplete(){

    let completed = true;

    document
    .querySelectorAll(".slot")
    .forEach(slot=>{

        if(slot.children.length === 0){
            completed = false;
        }

    });

    if(completed){

        document
        .getElementById("winnerMessage")
        .innerHTML =
        "🏆 RESTAURAÇÃO CONCLUÍDA!";
    }
}