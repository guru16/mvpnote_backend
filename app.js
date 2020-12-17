var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subscriptionRouter = require('./routes/subscription')
require('dotenv').config()


var app = express();

app.use(
  cors({
      origin: ['http://mvpnotes-backend.herokuapp.com', 'https://mvpnote-frontend.herokuapp.com','https://mvpnote-frontend.herokuapp.com/','http://mvpnote-frontend.herokuapp.com','https://mvpnotes-backend.herokuapp.com'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Header':
      'Origin, X-Requested-With, Content-Type, Accept',
      
  })
);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', subscriptionRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
