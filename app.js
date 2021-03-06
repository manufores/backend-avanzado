var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resized')));

/**
 * Setup de i18n
 */
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);


/** 
 * Conexion con la base de datos
 */
require('./lib/connectMongoose');
require('./models/Anuncio');


/**
 * Rutas de mi API
 */
const tokenController = require('./routes/apiv1/tokenController');
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.post('/apiv1/authenticate', tokenController.loginJWT);
app.use('/images/anuncios', express.static(path.join(__dirname, 'public/images')));


app.locals.title='NodePOP';

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/change-locale', require('./routes/change-locale'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');

  function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
  }
  
});

module.exports = app;
