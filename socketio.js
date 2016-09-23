module.exports = function(io) {

  var usersTyping = [];

  io.on('connection', socket => {
    socket.on('user connected', data => {
      socket.emit('you connected');
      socket.broadcast.emit('user connected', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('user typing', data => {
      if (usersTyping.indexOf(data.username) === -1) {
        usersTyping.push(data.username);
        io.emit('user typing list change', usersTyping);
      }
      console.log(usersTyping);
    });

    socket.on('user not typing', data => {
      usersTyping = usersTyping.filter( user => {
        return user != data.username;
      });
      io.emit('user typing list change', usersTyping);
    })

    socket.on('chat message', data => {
      console.log(data);
      socket.broadcast.emit('chat message', data);
    });
  });

}
