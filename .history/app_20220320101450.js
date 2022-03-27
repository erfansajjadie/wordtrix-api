let createError = require('http-errors');
let express = require('express');
let path = require('path');


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return "not found";
});

// error handler
app.use(function(err, req, res, next) {
  return "error";
});

module.exports = app;