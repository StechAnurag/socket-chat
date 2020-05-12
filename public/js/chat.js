const socket = io();

// Selecting DOM elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $sendLocationBtn = document.querySelector('#loc-btn');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', message => {
  const html = Mustache.render(messageTemplate, {
    message
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', e => {
  e.preventDefault();
  // Disable
  $messageFormBtn.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;
  if (!message) return alert('Please write some message!');
  socket.emit('sendMessage', message, error => {
    // Enable
    $messageFormBtn.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) return alert(error);
    console.log('delivered: ✔︎');
  });
});

$sendLocationBtn.addEventListener('click', e => {
  if (!navigator.geolocation) return alert('Geolocation: not supported by your browser');

  // Disable
  $sendLocationBtn.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        location: { lat: position.coords.latitude, long: position.coords.longitude },
        timestamp: position.timestamp
      },
      () => {
        // Enable
        $sendLocationBtn.removeAttribute('disabled');
        console.log('location shared 🎯');
      }
    );
  });
});
