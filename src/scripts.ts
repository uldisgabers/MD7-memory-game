const cardContainer: HTMLDivElement = document.querySelector(".card-wrapper");
const colors = ["red", "red", "blue", "blue", "green", "green"];
const cardCount = colors.length;
let winCount: number = 0;
const winCounterDiv = document.querySelector(".win-counter");
// let timer = 1;

// Game
let revealedCount = 0;      // How many cards have been flipped
let activeCard: HTMLDivElement = null;      // The card that is going to be selected
let awaitingEndOfMove = false;      // false, when you have to wait for 2 cards to be checked

function buildCard(color: string) {
    const element = document.createElement("div");      // we make a div by a name "element"

    element.classList.add("card");                      // add class="card" for this div
    element.setAttribute("data-color", color);          // we make our own atribute using "data-" prefix. Set it's value to color that was passed in the function
    element.setAttribute("data-revealed", "false");     // we make our own atribute using "data-" prefix. Set it to false

    // Clicking a div
    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed")      // variable "revealed", that shows if the card is flipped or not

        if (awaitingEndOfMove || revealed === "true" || element == activeCard) {        // 1. doesn't let pick more cards, than 2
            return;     // exits the function                                           // 2. doesn't let pick already revealed cards
        }                                                                               // 3. doesn't let it match against itself

        element.style.backgroundColor = color;  // show color / flip card
        
        if (!activeCard) {              // if there is no active card
            activeCard = element;       // then the new active card is this element/card
            
            return;                     // when you got an active card, exit the funcition
        }

        const colorToMatch = activeCard.getAttribute("data-color")      // get the color of 1st selected card (from our own atribute)

        
        // If 2 selected cards are the same color / match
        if (colorToMatch === color) {
            element.setAttribute("data-revealed", "true");          // set our made atribute, so that it stays revealed if rigth
			activeCard.setAttribute("data-revealed", "true");       // set our made atribute, so that it stays revealed if rigth

			activeCard = null;              // clear the active card, so another move can be made
			awaitingEndOfMove = false;      // not waiting for a move
			revealedCount += 2;             // update revealed count

            if (revealedCount === cardCount) { // If You WON
                winCount += 1;
                winCounterDiv.innerHTML = `Wins: ${winCount}`   // Display the win count
                displayWinner()
            }
            return;
        }

        awaitingEndOfMove = true;       // when 2 cards are selected, don't let any more cards to be selected

        // hide the cards after 1 second, if selected cards don't match.
        setTimeout(() => {
            activeCard.style.backgroundColor = null;        // hide the color of 1st selected card
			element.style.backgroundColor = null;           // hide the color of 2nd selected card

            awaitingEndOfMove = false;      // reset the move, so 2 cards can be selected again
            activeCard = null;              // cleared 1st activeted card
        }, 1000);
    });

    return element;     // card is made and sent
}

// Build cards
function initializeGame() {
    for (let i = 0; i < cardCount; i++) {
        const randomIndex = Math.floor(Math.random() * colors.length);      // Takes a random element from array
        const color = colors[randomIndex];      // we choose the color, from colors array, and assign it to "color"
        const card = buildCard(color)           // make a new card, using buildCard function

        colors.splice(randomIndex, 1);          // removes the random index we just used for card color
        cardContainer.appendChild(card)         // Makes a child element(card) in the cardContainer
    }
}

// Start the game button
const startButton = document.querySelector<HTMLButtonElement>(".button-start");
startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    cardContainer.style.display = "grid"
    initializeGame()
})

// Show that you are a winner, and gives option to play again
const showWinner = document.querySelector<HTMLDivElement>(".winner");
const resetButton = document.querySelector<HTMLDivElement>(".play-again");

function displayWinner() {
    cardContainer.style.display = "none";
    showWinner.style.display = "block";
    resetButton.style.display = "block";
}

function restartGame() {
    // Reset game variables
    revealedCount = 0;
    activeCard = null;
    awaitingEndOfMove = false;
    
    // Remove existing cards
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }

    // Reset colors array
    colors.length = 0;
    colors.push("red", "red", "blue", "blue", "green", "green");

    // Hide winner display and show card container
    showWinner.style.display = "none";
    resetButton.style.display = "none";
    cardContainer.style.display = "grid";
 
    initializeGame();       // Initialize the game with new set of cards
}

resetButton.addEventListener("click", restartGame);     // Add click event listener to the reset button
