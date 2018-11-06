const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"
const db = pgp(connectionString)

users = []

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


app.get('/register', function(req,res){
  res.render('register')
})
app.post('/register', function(req,res){
  let registerUsername = req.body.username
  let registerPassword = req.body.password

  let userInfo = { username : registerUsername, password : registerPassword}
  users.push(userInfo)
  console.log(users)

  res.redirect('/login')
})

app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', function(req,res){
  let loginUsername = req.body.username
  let loginPassword = req.body.password

  for(let index = 0; index < users.length; index++){
    if (loginUsername == users[index].username && loginPassword == users[index].password){
      console.log("Login successful")
      res.redirect('/')
    } else {
      console.log('Username or password is incorrect')
      res.redirect('/login')
    }
  }
})

app.get('/', function(req,res){
  res.redirect('/login')
})

app.listen(3000, function(req, res){
  console.log('Server is running...')
})
