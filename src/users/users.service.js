const users = [
  {
    id: 1,
    name: 'bako',
    email: 'bakoledur@gmail.com'
  },
  {
    id: 2,
    name: 'osias',
    email: 'eltimidente@gmail.com'
  }
];

export function getUsers() {
  return users;
}

export function getUserById(id) {
  return users.find((user) => user.id === id);
}
