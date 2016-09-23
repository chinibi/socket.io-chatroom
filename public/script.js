var username = window.prompt('enter your username');

var socket = io();

socket.emit('user connected', {username: username});

$('form').submit(function(event) {
  event.preventDefault();
  socket.emit('chat message', {
    username: username,
    message: $('#m').val()
  });

  $('#messages').append($('<li><strong>' + username + ': </strong>' + $('#m').val() + '</li>'));
  $('#m').val('');
});

socket.on('you connected', function() {
  toastr.info('You have joined the chat');
});

socket.on('user connected', function(data) {
  toastr.info(data.username + ' has joined the chat');
});

$('#m').on('change keyup paste', function() {
  if ($(this).val()) {
    socket.emit('user typing', {username: username});
  } else {
    socket.emit('user not typing', {username: username});
  }
});

socket.on('user typing list change', function(users) {
  users = users.filter(function(user) {
    return user != username;
  });

  var usersString = users.reduce(function(acc, user, currIndex) {
    if (currIndex !== users.length - 1) {
      return acc + user + ', ';
    } else {
      return acc + user;
    }
  }, '');

  if (users.length === 1) {
    $('#whos-typing').html(usersString + " is typing.");
  }
  else if (users.length > 1) {
    $('#whos-typing').html(usersString + " are typing.");
  } else {
    $('#whos-typing').html("");
  }
});

socket.on('chat message', function(data) {
  $('#messages').append($('<li><strong>' + data.username + ': </strong>' + data.message + '</li>'));
});
