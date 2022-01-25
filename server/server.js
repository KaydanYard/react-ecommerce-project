const express = require("express");
const bodyParser = require("body-parser");
const products = require("./products.json")
const users = require("./users.json")
const fs = require('fs')
var cors = require('cors');

const app = express();
const port = 8000;
app.use(cors())
app.use(bodyParser.json())


function getUsers() {
  const usersJSON = fs.readFileSync('./users.json')
  return JSON.parse(usersJSON)
}

const connectedStores = {}

// Sign Up
app.post("/sign-up", (req, res) => {
  const users = getUsers()

  console.log('users', users)

  const signUpForm = req.body;
  console.log(signUpForm)

  const { password, confirmPassword, ...user } = signUpForm;
  const hash = btoa(`${user.username}${password}`);
  users[hash] = signUpForm;

  fs.writeFileSync('./users.json', JSON.stringify(users))

  res.send({
    data: signUpForm,
    status: 'success'
  });
});

// Login 
app.post("/login", (req, res) => {
  const users = getUsers()

  const { username, password } = req.body
  const hash = btoa(`${username}${password}`);
  const foundUser = users[hash]

  res.send({
    data: foundUser,
    status: !!foundUser ? 'success' : 'error',
    message: !!foundUser ? '' : 'Could not find user'
  });
})

// Retrieve Products
app.get("/store", (req, res) => {
  const users = getUsers()

  res.send({
    data: products,
    status: 'success'
  })
})

// Port
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
