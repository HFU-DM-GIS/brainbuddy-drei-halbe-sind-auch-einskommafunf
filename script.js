

let cards = document.querySelectorAll(".card");
const resetButton = document.querySelector("#reset");
let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    console.log(this.classList)
    this.classList.add("selected", "flipped");
    console.log(this.classList)
    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    firstCard.classList.add("correct");
    secondCard.classList.add("correct");
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("selected", "flipped");
        });
        resetBoard();
    }, 1000);
}


function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() { 
    cards.forEach(card => {
        card.classList.remove("selected", "correct");
        card.firstChild.classList.remove("flipped");
        card.addEventListener('click', flipCard);
       
    });

    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


function getTheme() {
    return document.getElementById('theme-input').value.trim();
}

//
const numberSelect = document.getElementById('numberSelect');
const resultElement = document.getElementById('result');

function updateValue() {
  const selectedValue = parseInt(numberSelect.value);
  console.log('Eingegebener Wert:', selectedValue);
  return selectedValue;
}
//

async function getImages(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Bilder:', error);
    }
}
function createCard(imageUrl, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.card = index;

    const frontSide = document.createElement('div');
    frontSide.classList.add('card-side', 'front-side');
    frontSide.style.backgroundImage = 'url("/images/fun-memory.png")';

    const backSide = document.createElement('div');
    backSide.classList.add('card-side', 'back-side');
    backSide.style.backgroundImage = `url(${imageUrl})`;
    card.appendChild(frontSide);
    card.appendChild(backSide);

    card.addEventListener('click', flipCard);

    return card;
}

async function initializeGame() {
    resetGame(); // Füge diese Zeile hinzu, um das Spiel zurückzusetzen, bevor du neue Karten erstellst
    const value = updateValue();
    const theme = getTheme();
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apikey}&count=${value}&query=${theme}`;

    const images = await getImages(apiUrl);
    const doubledImages = [...images, ...images];
    doubledImages.sort(() => Math.random() - 0.5);

    const memoryGame = document.querySelector('.memory-game');
    cards = document.querySelectorAll(".card"); // Aktualisiere die Karten nach dem Reset
    doubledImages.forEach((image, index) => {
        const card = createCard(image.urls.small, index);
        memoryGame.appendChild(card);
    });
}
function startGame() {
    const themeInput = document.getElementById('theme-input');
    const errorMsg1 = document.querySelector('.error-msg1');
    const numberSelect = document.getElementById('numberSelect');
    const errorMsg2 = document.querySelector('.error-msg2');
    let themeerror = false;
    let numbererror = false;
    if (themeInput.value.trim() === '') {
        // Zeige die Fehlermeldung an, wenn das Feld nicht ausgefüllt ist
        errorMsg1.style.display = 'block';
        themeerror = true;
    } else {
        // Verberge die Fehlermeldung, wenn das Feld ausgefüllt ist
        errorMsg1.style.display = 'none';
    }

    if (numberSelect.value.trim() === '') {
        errorMsg2.style.display = 'block';
        numbererror = true;
    } else {
        errorMsg2.style.display = 'none';
    }

    if (!themeerror && !numbererror) {
        // Starte das Spiel nur, wenn keine Fehler vorliegen
        initializeGame();
    }
}