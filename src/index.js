const path = require('path');
const http = require('http');
const expres = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMsg, generateLocMsg } = require('./utils/messages');

const app = expres();
const server = http.createServer(app);
const io = socketio(server);

app.use(expres.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 4500;

io.on('connection', socket => {
  console.log('new connection');
  socket.emit('message', generateMsg('Welcome!'));

  socket.broadcast.emit('message', generateMsg('A new user joined.'));

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) return callback('Profanity is not allowed');

    io.emit('message', generateMsg(message));
    callback();
  });

  socket.on('sendLocation', (data, cb) => {
    io.emit('locationMessage', generateLocMsg(`https://google.com/maps?q=${data.location.lat},${data.location.long}`));
    cb();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMsg('A user has left'));
  });
});

server.listen(port, () => console.log(`App is ready at- http://localhost:${port} 🚀`));
