const socket = io();

socket.on('countUpdated', count => console.log('counter updated to: ' + count));

document.querySelector('#like-btn').addEventListener('click', e => {
  // console.log('one more like');
  socket.emit('increment');
});
