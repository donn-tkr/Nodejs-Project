import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './users/users.routes.js';

dotenv.config()
const app = express()

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Users Management API'
});
});

app.use('/users', usersRouter);


const port= process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});




/*
const listener = (request, response) => {
  if (request.url === "/users") {
    return listUsers(request, response);
  }

  return Json(response, 404, {
    message: "Not found",
  });
};

const server = http.createServer(listener);
server.listen(3000);

console.log("Server running at http://localhost:3000/");


*/

