const path = require('path');
const http = require('http');
const expres = require('express');
const socketio = require('socket.io');

const app = expres();
const server = http.createServer(app);
const io = socketio(server);

app.use(expres.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 4500;

io.on('connection', socket => {
  console.log('new connection');
  socket.emit('message', 'Welcome!');

  socket.broadcast.emit('message', 'A new user joined.');

  socket.on('sendMessage', message => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

server.listen(port, () => console.log(`App is ready at- http://localhost:${port} 🚀`));
