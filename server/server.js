const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

const maxRoomSize = 4;
let rooms = {};

function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("hostRoom", () => {
    let room;

    do {
      room = generateRoomId();
    } while (rooms[room]);

    rooms[room] = 1;
    socket.join(room);
    console.log(`User ${socket.id} created and joined room: ${room}`);
    socket.emit("roomHosted", room);
  });

  socket.on("joinRoom", () => {
    let room;

    for (let [roomId, size] of Object.entries(rooms)) {
      if (size < maxRoomSize) {
        room = roomId;
        break;
      }
    }

    if (room) {
      socket.join(room);
      rooms[room] += 1;
      console.log(`User ${socket.id} joined room: ${room}`);
      socket.emit("joinedRoom", room);
      io.to(room).emit("message", `User ${socket.id} has joined the room.`);

      if (rooms[room] === maxRoomSize) {
        io.to(room).emit("roomFull", "The room is now full.");
      }
    } else {
      socket.emit(
        "noAvailableRoom",
        "No available room to join. Try hosting a new one."
      );
    }
  });

  socket.on("disconnect", () => {
    for (let [roomId, size] of Object.entries(rooms)) {
      if (io.sockets.adapter.rooms.get(roomId)?.has(socket.id)) {
        rooms[roomId] -= 1;
        if (rooms[roomId] === 0) {
          delete rooms[roomId];
        }
        console.log(`User ${socket.id} left room: ${roomId}`);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 8080");
});
