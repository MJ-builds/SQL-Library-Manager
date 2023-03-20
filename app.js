var createError = require('http-errors');

var express = require('express');
// install sequelize
const {sequelize} = require('./models/index');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Test connection to the database and log a message
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  // Sync the model with the database
sequelize.sync()
.then(() => {
  console.log('Models have been synced with the database');
})
.catch(err => {
  console.error('Error syncing models with the database:', err);
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
