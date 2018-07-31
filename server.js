// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
// require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Express server listening on port ' + port);


// app.get('/', (req, res) => {
//   db.collection('todoitems').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('index.ejs', {messages: result})
//   })
// })
//
// app.get('/react', (req, res) => {
//   db.collection('todoitems').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.json(result)
//   })
// })
//
// app.post('/todoitems', (req, res) => {
//   db.collection('todoitems').save({item:req.body.item, thumbUp: 0, thumbDown:0}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/')
//   })
// })
//
// app.put('/messages', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({item:req.body.item}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })
//
// app.delete('/deleteitem', (req, res) => {
//   console.log("working?")
//   db.collection('todoitems').findOneAndDelete({item:req.body.item}, (err, result) => {
//     if (err) return res.send(500, err)
//     res.send('Message deleted!')
//   })
// })
