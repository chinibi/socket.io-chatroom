var express = require('express');
var logger = require('morgan');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.sendfile('./public/index.html');
});

require('./socketio')(io);

var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening on port 3000.');
});
