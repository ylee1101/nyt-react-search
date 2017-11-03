const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3001
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

// initialize express for debugging and body parsing
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

// Database Configuration with Mongoose
// Connect to localhost if not a production environment
if (process.env.NODE_ENV == 'production') {
  mongoose.connect('myheroku mlab link');
}
else {
  mongoose.connect('mongodb://localhost/nytreact');
}
let db = mongoose.connection;

// Show any Mongoose errors
db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function () {
  console.log('Mongoose connection successful.');
});

// Import the Article model
const Article = require('./models/Article.js');

// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);

// serve static content?
app.use(express.static(process.cwd() + '/public'))

// Send every request to the React app
// Define any API routes before this runs
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`)
})
