let roomId = "";
const socket = io("https://breezy-rubetta-vinayu-c093cb29.koyeb.app/");
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
  document.getElementById(`player-name-input`).value = getRandomName();
}
function showGameSettingScreen() {
  gameType("join");
  addPlayers();
  document.getElementById("host-game").style.transform = "translateX(0%)";
}

function gameType(type) {
  const name = document.getElementById(`player-name-input`).value;
  if (type == "host") {
    if (!roomId) {
      roomId = Math.floor(100000 + Math.random() * 900000).toString();
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
}

function joinGame() {
  const joincode = document.getElementById(`join-input`).value;
  debugger;
  const infoElement = document.getElementById("info-content");
  if (!joincode || joincode.length < 6) {
    infoElement.innerHTML = "Please enter a valid 6-digit code.";
    infoElement.style.display = "block";
  } else {
    const name = document.getElementById(`player-name-input`).value;
    const user = { name: name ? name : "" };
    socket.emit("joinRoom", { roomId: joincode, user });
    infoElement.style.display = "none";
  }
}

function addPlayers() {
  socket.on("userJoined", (data) => {
    console.log("New User Joined :", data);
    if (data && data.length > 0) {
      document.getElementById("scoreboard").style.marginRight = "00px";
      const playerList = document.querySelector("#players-list");
      playerList.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const player = document.createElement("div");
        player.className = "player-info";
        player.id = data[i].no;
        player.innerHTML =
          "<div class='player-number' id='playerColor" +
          data[i].no +
          "'>" +
          data[i].no +
          "</div><div class='player-name'>" +
          data[i].name +
          "</div>";
        playerList.appendChild(player);
      }
    }
  });
  socket.on("error", (data) => {
    const infoElement = document.getElementById("info-content");
    infoElement.innerHTML = data;
    infoElement.style.display = "block";
  });
}
