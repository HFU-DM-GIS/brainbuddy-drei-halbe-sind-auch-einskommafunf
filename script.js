let cards = [];
// Array zum Speichern von Kartenelementen
const resetButton = document.querySelector("#reset");
// Referenz auf den Zurücksetzen-Button (aktuell nicht verwendet)
let flippedCard = false;
// Flag zum Verfolgen, ob eine Karte umgedreht ist
let lockBoard = false;
// Flag, um das Klicken auf Karten zu verhindern, während das Spielfeld gesperrt ist
let firstCard, secondCard;
// Variablen zum Speichern der ersten und zweiten angeklickten Karten

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  // Verhindere das Umdrehen derselben Karte oder zu schnelles Klicken
  console.log(this.classList);
  this.classList.add("selected", "back-side");
  changeVisibility(this, true);
  // Drehe die Karte um und ändere ihre Sichtbarkeit
  console.log(this.classList);
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
  // Überprüfe, ob die ausgewählten Karten übereinstimmen
  const isMatch =
    firstCard.querySelector(".back-side").style.backgroundImage ===
    secondCard.querySelector(".back-side").style.backgroundImage;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  // Deaktiviere übereinstimmende Karten und entferne Event-Listener
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("correct");
  secondCard.classList.add("correct");
  resetBoard();
}

function unflipCards() {
  // Drehe Karten um, wenn sie nicht übereinstimmen
  lockBoard = true;
  setTimeout(() => {
    changeVisibility(firstCard, false);
    changeVisibility(secondCard, false);
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [flippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function resetGame() {
  // Setze das Spiel zurück, indem der Memory-Game-Container gelöscht wird
  const memoryGame = document.querySelector(".memory-game");
  memoryGame.innerHTML = "";
  [flippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function getTheme() {
  // Hole den Wert des Themen-Eingabefeldes
  return document.getElementById("theme-input").value.trim();
}

// Logik für die Anzahl-Auswahl
const numberSelect = document.getElementById("numberSelect");
const resultElement = document.getElementById("result");

function updateValue() {
  // Aktualisiere den ausgewählten Wert aus der Anzahl-Auswahl
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
  // Erstelle ein Karten-Element mit Vorder- und Rückseite
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.card = index;

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
  cards += card;
  console.log(cards);
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
  cards = document.querySelectorAll(".card");
  doubledImages.forEach((image, index) => {
    const card = createCard(image.urls.small, index);
    memoryGame.appendChild(card);
  });
}

function startGame() {
  // Starte das Spiel, indem Eingaben validiert und das Spiel initialisiert wird
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
    initializeGame();
  }
}
