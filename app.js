let createError = require('http-errors');
let express = require('express');
let path = require('path');
let apiRouter = require('./routes/api');
let authRouter = require('./routes/auth');
let app = express();


require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', apiRouter);
app.use('/api/v1/auth', authRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.status(404).send({message: "route not found"});
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});

module.exports = app;
