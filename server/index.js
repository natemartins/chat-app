const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// middlewares
app.use(router);
app.use(cors());

// implement socket connection
io.on("connection", (socket) => {
  // receive emitted event
  socket.on("join", ({ name, room }, callback) => {
    // get values returned from server
    const { error, user } = addUser({ id: socket.id, name, room });

    // handle errors by using a callback()
    if (error) {
      return callback(error);
    }

    console.log(`${name} has joined`); // TODO: DELETE LATER

    // emit a new event to user notifying him of his joining
    socket.emit("message", {
      user: "Admin",
      text: `Welcome, ${user.name.toUpperCase()}`,
    });
    // broadcast to everyone in room of the user's join
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name.toUpperCase()} has joined` });

    // if no errors, join user to room
    socket.join(user.room);

    // get users in room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // events for user-generated messages
  socket.on("sendMessage", (message, callback) => {
    // get user sending the message
    const user = getUser(socket.id);

    // specify the room the message is being sent to with the message
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });

    //TODO: UPDATE USERS IN ROOM
    // update users in room
    io.to(user.room).emit("roomData", {
      user: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // disconnect user
  socket.on("disconnect", () => {
    // get values returned from server
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name.toUpperCase()} has left`,
      });
      // TODO! REMOVE log BEFORE PRODUCTION
      console.log(`${user.name} has left`);
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
