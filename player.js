let roomId = "";

function getRandomName() {
  const adjectives = [
    "Wacky",
    "Silly",
    "Dizzy",
    "Bouncy",
    "Zany",
    "Funky",
    "Crazy",
    "Jolly",
    "Quirky",
    "Groovy",
    "Snazzy",
    "Whimsical",
    "Cheeky",
    "Nifty",
    "Spunky",
    "Peppy",
    "Zippy",
    "Spicy",
    "Breezy",
    "Flashy",
  ];
  const nouns = [
    "Penguin",
    "Banana",
    "Rocket",
    "Unicorn",
    "Ninja",
    "Pirate",
    "Dolphin",
    "Wizard",
    "Dragon",
    "Koala",
    "Octopus",
    "Cactus",
    "Robot",
    "Gorilla",
    "Pancake",
    "Sloth",
    "Chameleon",
    "Yeti",
    "Phoenix",
    "Squirrel",
  ];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }`;
}

function pickRandomName() {
  document.getElementById(`player-name`).value = getRandomName();
}

function gameType(type) {
  const name = "document.getElementById(`player-name`).value";
  if (type == "host") {
    if (!roomId) {
      roomId = Math.floor(100000 + Math.random() * 900000).toString();

      const socket = io("localhost:3000");
      var user = { name: name ? name + " Host" : "Player 1" + " Host" };
      document.getElementById(`joincode`).innerHTML = roomId;
      socket.emit("hostRoom", { roomId, user });
    }
    document.getElementById("host").style.display = "flex";
    document.getElementById("join").style.display = "none";
  } else {
    document.getElementById("host").style.display = "none";
    document.getElementById("join").style.display = "flex";
  }

  // tabcontent = document.getElementsByClassName("tabcontent");
  // for (i = 0; i < tabcontent.length; i++) {
  //   tabcontent[i].style.display = "none";
  // }
  // tablinks = document.getElementsByClassName("tablinks");
  // for (i = 0; i < tablinks.length; i++) {
  //   tablinks[i].className = tablinks[i].className.replace(" active", "");
  // }
  // document.getElementById(cityName).style.display = "block";
  // evt.currentTarget.className += " active";
}
gameType("host");

function joinGame() {
  const joincode = document.getElementById(`join-input`).value;
  debugger;
  const infoElement = document.getElementById("info-content");
  if (!joincode || joincode.length < 6) {
    infoElement.innerHTML = "Please enter a valid 6-digit code.";
    infoElement.style.display = "block";
  } else {
    infoElement.style.display = "none";
  }
}
