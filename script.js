// Player positions
const players = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0,
};

// Long jump mappings (Snakes and Ladders)
const longJumps = {
  12: 28,
  15: 47,
  49: 94,
  60: 78,
  67: 17,
  89: 51,
  97: 65,
};

// Constants
const jumpTime = 1000; // 1 second

// Load the game board
function loadGameBoard() {
  const indexArr = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  let cardArr = [];
  let count = 1;

  indexArr.forEach((element) => {
    const rowArr = [];
    for (let i = 10; i >= 1; i--) {
      rowArr.push(count);
      count++;
    }
    cardArr = cardArr.concat(element ? rowArr : rowArr.reverse());
  });

  cardArr.reverse().forEach((element) => {
    const squareDiv = document.createElement("div");
    squareDiv.className = "square";
    squareDiv.id = `square${element}`;

    const innerDiv = document.createElement("div");
    innerDiv.textContent = element;

    squareDiv.appendChild(innerDiv);
    document.querySelector(".cardContainer").appendChild(squareDiv);
  });

  // Start random movement after the board loads
  setTimeout(startRandomMovement, 200);
}

// Start random movement for players
function startRandomMovement() {
  movePlayer(1);
}

// Move a player based on a random dice roll
function movePlayer(playerIndex) {
  if (playerIndex <= 4 && players[`player${playerIndex}`] < 100) {
    const playerElement = document.getElementById(`player${playerIndex}`);
    playerElement.style.animation = "";

    setTimeout(() => {
      const steps = Math.floor(Math.random() * 5) + 1;
      players[`player${playerIndex}`] += steps;
      const nextPosition = getElementOffset(
        document.getElementById(`square${players[`player${playerIndex}`]}`)
      );

      animatePlayerJump(playerElement, nextPosition);

      if (longJumps[players[`player${playerIndex}`]]) {
        players[`player${playerIndex}`] =
          longJumps[players[`player${playerIndex}`]];
        const nextJumpPosition = getElementOffset(
          document.getElementById(`square${players[`player${playerIndex}`]}`)
        );

        setTimeout(() => {
          animatePlayerJump(playerElement, nextJumpPosition);
          movePlayer(playerIndex + 1);
        }, jumpTime);
      } else {
        movePlayer(playerIndex + 1);
      }
    }, jumpTime);
  } else {
    startRandomMovement();
  }
}

// Get the offset of an element
function getElementOffset(element) {
  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset + 5,
    left: rect.left + win.pageXOffset + 5,
  };
}

// Animate the player's jump
function animatePlayerJump(element, nextPosition) {
  element.style.animation = "onMove 1s linear";
  element.style.top = `${nextPosition.top}px`;
  element.style.left = `${nextPosition.left}px`;
}

// Load the game board on page load
loadGameBoard();
