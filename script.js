let players = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0,
};

const jumpTime = 1000; //1sec
let longJumps = {
  12: 28,
  15: 47,
  49: 94,
  60: 78,
  67: 17,
  89: 51,
  97: 65,
};

function loadCardItems() {
  let indexArr = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  let cardArr = [];
  let count = 1;

  indexArr.forEach((element) => {
    let rowArr = [];
    for (let index = 10; index >= 1; index--) {
      rowArr.push(count);
      count++;
    }
    cardArr = cardArr.concat(element ? rowArr : rowArr.reverse());
  });

  cardArr.reverse().forEach((element, index) => {
    let squareDiv = document.createElement("div");
    squareDiv.className = "square";
    squareDiv.id = "square" + element.toString();

    let innerDiv = document.createElement("div");
    innerDiv.textContent = element;

    squareDiv.appendChild(innerDiv);
    document.querySelector(".cardContainer").appendChild(squareDiv);
  });
  setTimeout(() => {
    randomMoveOnLoad();
  }, 2000);
}

function randomMoveOnLoad() {
  var i = 1;
  moveSteps(i);
}

loadCardItems();

function moveSteps(index) {
  if (index <= 4) {
    if (players["player" + index] < 100) {
      var player = document.getElementById("player" + index);
      player.style.animation = "";
      setTimeout(() => {
        const steps = Math.floor(Math.random() * 5) + 1;
        players["player" + index] = players["player" + index] + steps;
        const nextSteps = getOffset(
          document.getElementById("square" + players["player" + index])
        );

        addJumpAnimation(player, nextSteps);
        if (longJumps[players["player" + index]]) {
          players["player" + index] = longJumps[players["player" + index]];
          const nextSteps = getOffset(
            document.getElementById("square" + players["player" + index])
          );
          setTimeout(() => {
            addJumpAnimation(player, nextSteps);
            moveSteps(index + 1);
          }, jumpTime);
        } else moveSteps(index + 1);
      }, jumpTime);
    }
  } else {
    randomMoveOnLoad();
  }
}

function getOffset(element) {
  let rect = element.getBoundingClientRect();
  let win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset + 5,
    left: rect.left + win.pageXOffset + 5,
  };
}

function addJumpAnimation(element, nextSteps) {
  element.style.animation = "onMove 1s linear";
  element.style.top = nextSteps.top + "px";
  element.style.left = nextSteps.left + "px";
}
