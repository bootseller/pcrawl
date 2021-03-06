var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport'),Strategy;
var mongoose = require('mongoose');

// Connect to Mongo DB
mongoose.connect('mongodb://localhost:27017/pcrawl');
var db = mongoose.connection;
console.log("You are successfully connected to " + db.name);


// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');

// Initialize App
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Set Static Folder
//app.use(express.static(path.join('__dirname', 'public')));
app.use(express.static('public'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({secret: 'codingdefined', resave: false, saveUninitialized: true}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
	next();
});


//Mapping Routes
app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);

var port = 3333;
app.listen(port, function(){
	console.log('Server started on port ' + port);
});