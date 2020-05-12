const socket = io();

socket.on('message', message => console.log(message));

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();
  // const message = document.querySelector('#message').value;
  const message = e.target.elements.message.value; // referencing with name attribute
  if (!message) return alert('Please write some message!');
  // socket.emit('sendMessage', message);
  // socket.emit('sendMessage', message, () => console.log('delivered: ✔︎'));
  // socket.emit('sendMessage', message, serverAck => console.log('delivered: ✔︎', serverAck));
  socket.emit('sendMessage', message, error => {
    if (error) return alert(error);
    console.log('delivered: ✔︎');
  });
  e.target.elements.message.value = '';
});

document.querySelector('#loc-btn').addEventListener('click', e => {
  if (!navigator.geolocation) return alert('Geolocation: not supported by your browser');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        location: { lat: position.coords.latitude, long: position.coords.longitude },
        timestamp: position.timestamp
      },
      () => console.log('location shared 🎯') // acknowledgement callback
    );
  });
});
