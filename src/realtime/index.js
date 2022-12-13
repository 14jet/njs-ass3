const { v4: uuid } = require("uuid");

const realtimeHandler = (socket, io) => {
  socket.on("new-message", (data) => {
    const { roomID, message } = data;

    let new_room = roomID;
    if (!roomID) {
      new_room = uuid();
    }
    console.log(new_room);
    socket.join(new_room);

    io.to(new_room)
      .to("admin-room")
      .emit("new-message", { ...data, roomID: new_room });
  });

  socket.on("join-admin", () => {
    socket.join("admin-room");
  });
};

module.exports = realtimeHandler;
