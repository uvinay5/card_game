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

let rooms = {};

io.on("connection", (socket) => {
  socket.on("hostRoom", ({ roomId, user }) => {
    console.log("Room Created " + roomId);
    socket.join(roomId);
    rooms[roomId] = [{ ...user, no: 1 }];
    io.to(socket.id).emit("roomCreated", rooms[roomId], roomId);
  });

  socket.on("start", ({ roomId }) => {
    io.to(roomId).emit("start", "start");
  });

  socket.on("play", ({ roomId, no }) => {
    io.to(roomId).emit("move", no);
  });

  socket.on("position", ({ roomId, no, position }) => {
    io.to(roomId).emit("moveTo", { no, position });
  });

  socket.on("joinRoom", ({ roomId, user }) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size > 0) {
      if (rooms[roomId].length <= 4) {
        if (!user.name) user.name = "Player " + (rooms[roomId].length + 1);
        socket.join(roomId);
        rooms[roomId] = [
          ...rooms[roomId],
          { ...user, no: rooms[roomId].length },
        ];
        io.to(roomId).emit("userJoined", rooms[roomId]);
      } else io.to(socket.id).emit("error", "Room is full");
    } else io.to(socket.id).emit("error", "Room does not exist");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 8080");
});
