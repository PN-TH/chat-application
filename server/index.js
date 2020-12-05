const express = require('express');
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const router = require('./router');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const app = express();
app.use(router);
app.use(cors());

var typingUsers = [];

const server = app.listen(PORT, () =>
  console.log(`Server has started on ${PORT}.`)
);

const io = require('socket.io')(server, {
  cors: { origin: true },
});

io.on('connection', (socket) => {
  console.log('connection !!!!!');

  

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log(name, room);

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}.`,
    });



    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    console.log('sendMessage');

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('start-typing', function () {
    // Ajout du user à la liste des utilisateurs en cours de saisie
    console.log("typing")
    io.emit('update-typing', typingUsers);
  });

  /**
   * Réception de l'événement 'stop-typing'
   * L'utilisateur a arrêter de saisir son message
   */
  socket.on('stop-typing', function () {
    io.emit('update-typing', typingUsers);
    console.log("not typing")
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
