const path = require('path');
const http = require('http');
const expres = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMsg, generateLocMsg } = require('./utils/messages');
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users');

const app = expres();
const server = http.createServer(app);
const io = socketio(server);

app.use(expres.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 4500;

io.on('connection', socket => {
  console.log('new connection');

  // JOIN EVENT
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) return callback(error);

    // allow user to join a room
    socket.join(user.room);

    // socket.emit('message', generateMsg('Admin',`Welcome ${user.username}!`));
    socket.emit('message', generateMsg(`Welcome ${user.username} !`));
    socket.broadcast.to(user.room).emit('message', generateMsg(`${user.username} has joined`));
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  // SENDING MESSAGES
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(message)) return callback('Profanity is not allowed');

    io.to(user.room).emit('message', generateMsg(user.username, message));
    callback();
  });

  // SENDING LOCATIONS
  socket.on('sendLocation', (data, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      'locationMessage',
      generateLocMsg(user.username, `https://google.com/maps?q=${data.location.lat},${data.location.long}`)
    );
    cb();
  });

  // HANDLING DISCONNECT
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMsg(`${user.username} has left`));
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(port, () => console.log(`App is ready at- http://localhost:${port} 🚀`));
