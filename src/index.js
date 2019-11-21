const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

require('dotenv').config({ path: '.env' })

// helpers
const { vardump } = require('./helper')

// db
const db = require('./config/database')
require('./models/projectModel')
require('./models/taskModel')
require('./models/userModel')

db.sync()
  .then(() => console.log('Database ok') )
  .catch(err => { console.log('Unable to connect to database, error: ' + err) })

// View engine
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

// Static files
app.use('/public' , express.static('public'));

// Middlewares
app.use(express.urlencoded({extended: false}));

app.use(flash())
app.use(cookieParser())
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  //res.locals.erros = req.flash('errors')
  res.locals.success = req.flash('success')
  res.locals.vardump = vardump
  res.locals.user = {...req.user} || null 
  next()
})

// Routes
app.use(require('./routes/index'));

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, () => {
  console.log('Server running on port ' + port)
});


