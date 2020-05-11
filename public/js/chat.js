const socket = io();

socket.on('message', message => console.log(message));

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();
  // const message = document.querySelector('#message').value;
  const message = e.target.elements.message.value; // referencing with name attribute
  if (!message) return alert('Please write some message!');
  socket.emit('sendMessage', message);
  e.target.elements.message.value = '';
});
