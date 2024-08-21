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
    const squareElement = document.getElementById("square" + element);

    if (squareElement) {
      squareElement.style.animation = ".5s boxAnimation";
      squareElement.style.animationDelay = `${index * 0.02}s`;
      squareElement.style.animationFillMode = "forwards";
    }
  });
}
loadCardItems();
