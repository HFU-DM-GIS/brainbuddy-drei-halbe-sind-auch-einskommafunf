
let flippedCard = false;
// Flag zum Verfolgen, ob eine Karte umgedreht ist
let lockBoard = false;
// Flag, um das Klicken auf Karten zu verhindern, während das Spielfeld gesperrt ist

let firstCard, secondCard;
// Variablen zum Speichern der ersten und zweiten angeklickten Karten
// Könnte auch stattdessen durch einen Array gelöst werden

let counter=0;
let counterCheck=0;

function flipCard() {
  if (lockBoard || this === firstCard) return;
  playSound("/soundfiles/CardsFlipCard_S08SP.149.wav");
  this.classList.add("selected", "back-side");
  changeVisibility(this, true);
  if (!flippedCard) {
    flippedCard = true;
    firstCard = this;
  } else {
    secondCard = this;
    checkForMatch();
  }
}

function changeVisibility(card, backsideVisible) {
  // Funktion zum Ändern der Sichtbarkeit der Karten-Seiten
  if (backsideVisible) {
    card.querySelector(".back-side").style.visibility = "visible";
    card.querySelector(".front-side").style.visibility = "hidden";
  } else {
    card.querySelector(".back-side").style.visibility = "hidden";
    card.querySelector(".front-side").style.visibility = "visible";
  }
}

function checkForMatch() {
  //Karten nach Match vergleichen
  // Evtl lösbar durch ein ID System anstatt durch die Hintergrundbilder
  const isMatch =
    firstCard.querySelector(".back-side").style.backgroundImage ===
    secondCard.querySelector(".back-side").style.backgroundImage;

  isMatch ? disableCards() : unflipCards();
  counterCheck++;
}

function disableCards() {
  //Karten die zusammengehören
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("correct");
  secondCard.classList.add("correct");
  playSound("/soundfiles/mixkit-instant-win-2021.wav");
  resetCards();

  counter++;
  console.log(counter);

  winningsound();
  //wird aufgerufen aber nur augeführt wenn counter und selectedValue gleich sind
  // Wo steht das ?
}

function unflipCards() {
  //zurückdrehen der Karten
  lockBoard = true;
  setTimeout(() => {
    changeVisibility(firstCard, false);
    changeVisibility(secondCard, false);
    
    resetCards();
  }, 1000);
}

function resetCards() {
  //Informationen der geflipped Karten auf Ursprung setzen
  
  [flippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function resetGame() {
  const memoryGame = document.querySelector(".memory-game");
  memoryGame.innerHTML = "";
  resetCards();
  counter=0;
}

function getTheme() {
  return document.getElementById("theme-input").value.trim();
}

// Logik für die Anzahl-Auswahl
const numberSelect = document.getElementById("numberSelect");

function updateValue() {
  const selectedValue = parseInt(numberSelect.value);
  console.log("Eingegebener Wert:", selectedValue);
  return selectedValue;
}

// Bilder von der Unsplash-API abrufen
async function getImages(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Bilder:", error);
  }
}
function createCard(imageUrl, index) {
  const card = document.createElement("div");
  card.classList.add("card");
  
  const frontSide = document.createElement("div");
  frontSide.classList.add("card-side", "front-side");
  frontSide.style.backgroundImage = 'url("./images/fun-memory.png")';
  frontSide.style.visibility = "visible";
  // Evtl hier die vorhin erwähnte ID zuordnen
  const backSide = document.createElement("div");
  backSide.classList.add("card-side", "back-side");
  backSide.style.backgroundImage = `url(${imageUrl})`;
  backSide.style.visibility = "hidden";
  card.appendChild(frontSide);
  card.appendChild(backSide);

  card.addEventListener("click", flipCard);
  
  return card;
}

// Initialisiere das Spiel durch Abrufen von Bildern und Erstellen von Karten
async function initializeGame() {
  resetGame();
  const value = updateValue();
  const theme = getTheme();
  const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apikey}&count=${value}&query=${theme}`;

  const images = await getImages(apiUrl);
  const doubledImages = [...images, ...images];
  //Hier das gesammte Audio bereits laden, um Ladefehler zu vermeiden
  doubledImages.sort(() => Math.random() - 0.5);

  const memoryGame = document.querySelector(".memory-game");
  cards = document.querySelectorAll(".card"); // Aktualisiere die Karten nach dem Reset
  doubledImages.forEach((image, index) => {
    const card = createCard(image.urls.small, index);
    memoryGame.appendChild(card);
  });
}

function startGame() {
  const themeInput = document.getElementById("theme-input");
  const errorMsg1 = document.querySelector(".error-msg1");
  const numberSelect = document.getElementById("numberSelect");
  const errorMsg2 = document.querySelector(".error-msg2");
  let themeerror = false;
  let numbererror = false;
  if (themeInput.value.trim() === "") {
    errorMsg1.style.display = "block";
    themeerror = true;
  } else {
    errorMsg1.style.display = "none";
  }

  if (numberSelect.value.trim() === "") {
    errorMsg2.style.display = "block";
    numbererror = true;
  } else {
    errorMsg2.style.display = "none";
  }

  if (!themeerror && !numbererror) {
    playSound("/soundfiles/mixkit-video-game-treasure-2066.wav");
    initializeGame();
  }
}
function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.play();
}


function winningsound(){
 // console.log("Test")
  if (counter===Number(numberSelect.value)){
  
   playSound("soundfiles/brass-fanfare-with-timpani-and-winchimes-reverberated-146260.mp3");
   counter=0;
 }
}
