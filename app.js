require('dotenv').config()
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const {checkUser} = require('./middleware/authMiddleware')
const cookieSession = require('cookie-session')

// router initialization
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes')


const app = express();

// CORS settings
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

app.options('*', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});



//Cookie settings
app.use(
  cookieSession({
    keys: process.env.JWT_SECRET,
    secure: true,
    httpOnly: true,
    maxAge: maxAge*1000,
    sameSite: 'none'
  })
)

//DB connection
mongoose.connect( process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// global user variable
app.use(function(req, res, next) {
    res.locals.currentUser = null;
    next();
  });

// userChecks
app.get('*', checkUser)


// routes
app.use(authRouter);
app.use('/blogs', userRouter)


module.exports = app;



// connect to front end first?
// - need to upload to heroku first and then use fetch api qwihtin react app.


// add validation to blog post creation

// add validation to comment creation

// protect routes, check when if they have a JSON web token
// app.get('*', checkUser) - works on all routes


// do i always need to send JSON data on current user? To help popualte whatever is being rendered to users?
// is there a way to do this using JWT? perhaps when checking JWT on routes (ie the '*' route checks)
// or i could store this in a React thingy

// should every JSON return include a user and an error field?
