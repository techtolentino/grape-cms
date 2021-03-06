var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    expressValidator = require('express-validator'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    db = require('monk')('localhost/nodeblog'),
    flash = require('connect-flash'),
    util = require('util'),
    routes = require('./routes/index'),
    posts = require('./routes/posts');
    categories = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(cookieParser());

// Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


app.use(express.static(path.join(__dirname, 'public')));

// Connect-flash
app.use(flash());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
})

// Access db
app.use(function(req, res, next) {
    req.db = db;
    next();
})

app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
