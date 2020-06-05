var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var { handleError, ErrorHandler } = require('./helpers/error')
var locationsRouter = require('./routes/locations');
var contactRouter = require('./routes/contact');
var idRouter = require('./tools/idCounter');
var authRouter = require('./routes/auth');
var ratingRouter = require('./routes/ratings')

var app = express();

// set up mongoose connection
var mongoose = require('mongoose');
var db = require('./configs/database');
mongoose.connect(db.config.uri, db.config.options);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set CORS Policy
app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ratings', ratingRouter);
app.use('/locations', locationsRouter);
app.use('/contact', contactRouter);
app.use('/auth', authRouter);
app.use('/idcounts', idRouter);
app.use('/images', express.static('images'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/* app.get('/error', (req, res) => {
  throw new ErrorHandler(500, 'Internal server error');
}) */

/* //error handler
app.use((err, req, res, next) => {
  handleError(err, res);
}); */

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