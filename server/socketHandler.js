module.exports = function (io) {
  const maxRoomSize = 4;
  let rooms = {};

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("hostRoom", ({ roomId, user }) => {
      let room;
      do {
        room = roomId;
      } while (rooms[room]);

      rooms[room] = 1;
      socket.join(room);
      console.log(`User ${socket.id} created and joined room: ${room}`);
      socket.emit(room, { id: rooms[roomId], ...user });
    });

    socket.on("joinRoom", ({ roomId }) => {
      let room;

      if (rooms[roomId] < maxRoomSize) {
      }

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
};
