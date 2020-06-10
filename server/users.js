const users = [];

const addUser = ({ id, name, room }) => {
  // rewrite name to all lowercase and as one work
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check if existing user
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser) {
    return { error: "Username is taken" };
  }

  // set user with variables gotten
  const user = { id, name, room };
  // push user to users array OR save user to db
  users.push(user);
  
  // return user
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  // if user found
  if (index !== -1) {
    // delete
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// export all functions
module.exports = {addUser, removeUser, getUser, getUsersInRoom}
