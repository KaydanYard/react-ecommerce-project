const express = require("express");
const bodyParser = require("body-parser");
const categories = require("./categories.json")
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

function getUsersCart() {
  const usersCartJSON = fs.readFileSync('./usersCart.json')
  return JSON.parse(usersCartJSON)
}

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
app.get("/shopzone", (req, res) => {
  const users = getUsers()

  res.send({
    data: categories,
    status: 'success'
  })
})

app.get("/users/cart/:userId", (req, res) => {
  const usersCart = getUsersCart()
  const { userId } = req.params
  const cart = usersCart[userId]

  res.send({
    data: cart,
    status: 'success'
  })
})

app.post("/users/cart/:userId/:categoryId/:productId", (req, res) => {
  const usersCart = getUsersCart()
  const { userId, categoryId, productId } = req.params
  const cart = usersCart[userId] || []

  cart.push({ categoryId: +categoryId, productId: +productId });
  usersCart[userId] = cart;
  fs.writeFileSync('./usersCart.json', JSON.stringify(usersCart))

  res.send({
    data: cart,
    status: 'success'
  })
})

app.delete("/users/cart/:userId/:productId", (req, res) => {
  const usersCart = getUsersCart()
  const { userId, productId } = req.params
  const cart = usersCart[userId] || []

  cart.splice(cart.indexOf(productId), 1);
  usersCart[userId] = cart;
  fs.writeFileSync('./usersCart.json', JSON.stringify(usersCart))

  res.send({
    data: cart,
    status: 'success'
  })
})

// Port
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
