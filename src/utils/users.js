const users = [];

const addUser = ({ id, username, room }) => {
  // validate the data
  if (!username || !room) return { error: 'Username and room are required' };

  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check for existing user
  const existingUser = users.find(user => user.username === username && user.room === room);
  if (existingUser) return { error: 'Username already exists.' };

  // Store User
  const user = { id, username, room };
  users.push(user);
  return user;
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];

  return { error: 'Usern does not exist.' };
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

module.exports = { addUser, getUser, getUsersInRoom, removeUser };
