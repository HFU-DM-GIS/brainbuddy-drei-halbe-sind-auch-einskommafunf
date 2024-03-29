
let flippedCard = false;
// Flag zum Verfolgen, ob eine Karte umgedreht ist
let lockBoard = false;
// Flag, um das Klicken auf Karten zu verhindern, während das Spielfeld gesperrt ist

let firstCard, secondCard;
// Variablen zum Speichern der ersten und zweiten angeklickten Karten
let counter=0;
let counterCheck=0;

const ErrorSound = "/soundfiles/ErrorToneChime_S08TE.597.wav";
const WinningSound = "/soundfiles/brass-fanfare-with-timpani-and-winchimes-reverberated-146260.mp3";
const MatchSound = "/soundfiles/mixkit-instant-win-2021.wav";
const StartSound = "/soundfiles/mixkit-video-game-treasure-2066.wav";
const CardflipSound = "/soundfiles/CardsFlipCard_S08SP.149.wav";

function flipCard() {
  if (lockBoard || this === firstCard) return;
  playSound(CardflipSound);
  this.classList.add("selected", "back-side");
  changeVisibility(this, true); //Karte wird umgedreht
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
  const isMatch =
    firstCard.querySelector(".back-side").style.backgroundImage ===
    secondCard.querySelector(".back-side").style.backgroundImage;

  isMatch ? disableCards() : unflipCards();
  /*
  if (isMatch) {
    disableCards();
} else {
    unflipCards();
}
*/
  counterCheck++;
  document.getElementById("counter-Check").innerHTML = "Versuche : " + counterCheck; //Aktualisieren des Counters
}

function disableCards() {
  //Karten die zusammengehören
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("correct");
  secondCard.classList.add("correct");
  playSound(MatchSound);
  resetCards();
  counter++;
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
  document.getElementById("error-msg3").innerHTML = ""; 
  resetCards();
  counter=0;
  counterCheck=0;
  document.getElementById("counter-Check").innerHTML = "";
}

function getTheme() {
  return document.getElementById("theme-input").value.trim();
}

// Logik für die Anzahl-Auswahl
const numberSelect = document.getElementById("numberSelect");

function updateValue() {
  const selectedValue = parseInt(numberSelect.value);
  return selectedValue;
}

// Bilder von der Unsplash-API abrufen
async function getImages(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const ImageError = false;
    if (data.errors != undefined) {
      const ImageError = true;
      document.getElementById("error-msg3").innerHTML = "Keine Bilder gefunden!";
      playSound(ErrorSound); //Error Sound
      return;
   }
    else {
    playSound(StartSound); //Start Sound
    return data;
   }
  }


function createCard(imageUrl) {
  const card = document.createElement("div");
  card.classList.add("card");
  
  const frontSide = document.createElement("div");
  frontSide.classList.add("card-side", "front-side");
  frontSide.style.backgroundImage = 'url("./images/fun-memory.png")';
  frontSide.style.visibility = "visible";
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
  doubledImages.sort(() => Math.random() - 0.5);

  const memoryGame = document.querySelector(".memory-game");
  doubledImages.forEach((image) => {
    const card = createCard(image.urls.small);
    memoryGame.appendChild(card);
  });
  document.getElementById("counter-Check").innerHTML = "Versuche : " + counterCheck;
}

function startGame() {//Funktion zum Starten des Spiels
  const themeInput = document.getElementById("theme-input"); //Thema
  const errorMsg1 = document.querySelector(".error-msg1"); 
  const numberSelect = document.getElementById("numberSelect"); //Anzahl der Karten
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

  if (themeerror || numbererror){
    playSound(ErrorSound); // Error Sound
  }
  if (!themeerror && !numbererror) {
    initializeGame();
  }
}
function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.play();
}


function winningsound(){
  if (counter===Number(numberSelect.value)){
  
   playSound(WinningSound);
   counter=0;
 }
}
