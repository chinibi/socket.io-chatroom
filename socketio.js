var _ = require('lodash');

module.exports = function(io) {

  var users = {};
  var usersTyping = [];

  io.on('connection', socket => {
    socket.on('user connected', data => {
      socket.emit('you connected');
      users[socket.id] = data.username;
      io.emit('user list', users);
      socket.broadcast.emit('user connected', data);
    });

    socket.on('disconnect', () => {
      delete users[socket.id];
      io.emit('user list', users);
    });

    socket.on('user typing', data => {
      if (usersTyping.indexOf(data.username) === -1) {
        usersTyping.push(data.username);
        io.emit('user typing list change', usersTyping);
      }
    });

    socket.on('user not typing', data => {
      usersTyping = usersTyping.filter( user => {
        return user != data.username;
      });
      io.emit('user typing list change', usersTyping);
    })

    socket.on('chat message', data => {
      socket.broadcast.emit('chat message', data);
    });

    socket.on('whisper send', data => {
      var recipientID = _.findKey(users, user => {
        return user == data.recipient;
      });

      if (recipientID) {
        io.to(recipientID).emit('whisper receive', {
          sender: data.sender,
          message: data.message
        });
      }
    });
  });
}
