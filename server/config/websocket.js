const jwt = require("jwt-simple");
const { authSecret } = require("../.env");

const isValid = (token, app) => {
  try {
    const userData = jwt.decode(token, authSecret);

    if (new Date(userData.exp * 1000) > new Date()) {
      return true;
    }
  } catch (err) {
    return false;
  }
};

const extractToken = (socket) => {
  try {
    return jwt.decode(socket.handshake.query.token, authSecret);
  } catch (err) {
    return {
      id: null,
      name: null,
      email: null,
      admin: null,
      iat: null,
      exp: null,
    };
  }
};

module.exports = (app, io) => {
  // Authentication middleware
  io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if (isValid(token)) {
      return next();
    }
    return next(new Error("authentication error"));
  });

  const users = {};
  const psycho = {};
  // Establishes the socket and creates listeners for it.
  io.on("connection", (socket) => {
    const userData = extractToken(socket);
    // If the user connected isn't already connected
    // then adds their username and socket ID to the respective object.
    if (userData.admin) {
      if (!psycho[userData.name]) {
        psycho[userData.name] = socket.id;
      }
    } else {
      if (!users[userData.name]) {
        users[userData.name] = socket.id;
      }
    }
    // Emits the ID and username of who connects.
    socket.emit("yourID", [userData.name, socket.id]);
    // Emits the list of currently connected users.
    io.sockets.emit("allUsers", [users, psycho]);
    // When a user disconnects, deletes it from users' or psychologists' list.
    if (userData.admin) {
      socket.on("disconnect", () => {
        delete psycho[userData.name];
        io.sockets.emit("allUsers", [users, psycho]);
      });
    } else {
      socket.on("disconnect", () => {
        delete users[userData.name];
        io.sockets.emit("allUsers", [users, psycho]);
      });
    }
    // Listener for when a user tries to call another.
    socket.on("callUser", (data) => {
      // The signal is sent from the caller user to this namespace
      // and then is sent to whom it may concern.
      io.to(data.userToCall).emit("hey", {
        signal: data.signalData,
        from: data.from,
      });
    });
    // Listerner for when a user accepts a call signal from another.
    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};
