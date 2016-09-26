var username;

while (!username) {
  username = window.prompt('enter your username');
}

var socket = io();

socket.emit('user connected', {username: username});

$('form').submit(function(event) {
  event.preventDefault();
  var message = $('#m').val();

  if (message.match(/^@/)) {
    var recipient = message.match(/[^\s@]+/)[0];
    var messageArr = message.split(' ');
    messageArr.shift();
    message = messageArr.join(' ');

    socket.emit('whisper send', {
      sender: username,
      recipient: recipient,
      message: message
    });

  } else {
    socket.emit('chat message', {
      username: username,
      message: message
    });
  }

  $('#messages').append($('<li><strong>' + username + ': </strong>' + $('#m').val() + '</li>'));
  $('#m').val('');
});

socket.on('user list', function(users) {
  $('#user-list').html('');

  for (var user in users) {
    $('#user-list').append($('<li>').text(users[user]));
  }
});

socket.on('you connected', function() {
  toastr.info('You have joined the chat');
});

socket.on('user connected', function(data) {
  toastr.info(data.username + ' has joined the chat');
});

$('#m').on('change keyup paste', function() {
  if ( $(this).val() && !$(this).val().match(/^@/) ) {
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

socket.on('whisper receive', function(data) {
  $('#messages').append($('<li><strong>Whisper from ' + data.sender + ': ' + '</strong>' + data.message + '</li>'));
});
