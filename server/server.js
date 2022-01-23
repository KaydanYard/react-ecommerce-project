const express = require("express");
const bodyParser = require("body-parser");
const companies = require("./companies.json")
const users = require("./users.json")
const fs = require('fs')
var cors = require('cors');

const app = express();
const port = 8080;
app.use(cors())
app.use(bodyParser.json())


function getUsers() {
  const usersJSON = fs.readFileSync('./users.json')
  return JSON.parse(usersJSON)
}

const connectedCompanies = {}

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

app.post("/login", (req, res) => {
  const users = getUsers()

  const { username, password } = req.body
  const hash = btoa(`${username}${password}`);
  const foundUser = users[hash]

  res.send({
    data: foundUser,
    status: !!foundHash ? 'success' : 'error',
    message: !!foundHash ? '' : 'Could not find user',
  });
})

app.get("/companies", (req, res) => {
  const users = getUsers()

  res.sent({
    data: companies,
    status: 'success'
  })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
