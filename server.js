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

io.on('connection', socket => {
  console.log('user connected');
  io.emit('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', msg => {
    console.log(msg);
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000.');
});
