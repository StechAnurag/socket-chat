const path = require('path');
const http = require('http');
const expres = require('express');
const socketio = require('socket.io');

const app = expres();
const server = http.createServer(app);
const io = socketio(server);

app.use(expres.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 4500;

let count = 0;
// server (emit) -> client (recieve) - countUpdated event
// client (emit) -> server (recieve) - increment event

io.on('connection', socket => {
  console.log('new websocket connection');
  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    count++;
    // It only emits to the specific connection
    // socket.emit('countUpdated', count);
    // It emits to every single connection
    io.emit('countUpdated', count);
  });
});

server.listen(port, () => console.log(`App is ready at- http://localhost:${port} 🚀`));
