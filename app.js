const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"
const db = pgp(connectionString)
const expressSession = require('express-session')
const expressValidator = require('express-validator')

users = []

app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({ secret: 'asdfdsa', saveUninitialized: false, resave: false}))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


app.get('/view-posts', function(req,res){
  res.render('view-posts')
})

app.get('/create-post', function(req,res){
  res.render('create-post')
})

app.post('/create-post', function(req,res){
  let postTitle = req.body.postTitle
  let postBody = req.body.postBody

  db.none('INSERT INTO posts(title, body, userId) VALUES ($1,$2,$3)',[postTitle, postBody, 5]).then(function(){
    res.redirect('/view-posts')
  })
  .catch(function(error){
    console.log(error)
  })
})

app.get('/register', function(req,res){
  res.render('register')
})

app.post('/register', function(req,res){
  let registerUsername = req.body.username
  let registerPassword = req.body.password

  db.none('INSERT INTO users(username, password) VALUES ($1,$2)',[registerUsername, registerPassword]).then(function(){
    res.redirect('/login')
  })
  .catch(function(error){
    console.log(error)
  })
})

app.get('/login', function(req,res){
  res.render('login')
})

app.post('/login', function(req,res){
  let loginUsername = req.body.username
  let loginPassword = req.body.password


  db.one('SELECT userid, username FROM users').then(function(result){
    res.send(result)
  })
  req.session.user = loginUsername

})

app.get('/', function(req,res){
  res.redirect('/login')
})

app.listen(3000, function(req, res){
  console.log('Server is running...')
})
