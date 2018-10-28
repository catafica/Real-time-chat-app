var socket = io();

socket.on('connect', function(){
  console.log('connected to server');
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function(err){
    if (err){
        alert(err);
        window.location.href = '/';
    } else {
        console.log('No error');
    }
  });

});


socket.on('disconnect', function(){
  console.log('user was disconnected');
});

socket.on('updateUserList', function(users){
  var ol = document.createElement('ol')
  users.forEach(function(user){
    var li = document.createElement('li');
    li.innerHTML = `${user}`;
    ol.appendChild(li);
  });
  document.getElementById('users').appendChild(ol);
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('message-template').innerHTML;
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  var li = document.createElement('li');
  li.innerHTML = `${html}`;
   document.getElementById('messages').appendChild(li);
  // document.getElementById('messages').appendChild(html);
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // // console.log('newMessage', message);
  // var li = document.createElement('li');
  // li.innerHTML = `${message.from} ${formattedTime}: ${message.text}`;
  // document.getElementById('messages').appendChild(li);
});

socket.on('newLocationMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('location-message-template').innerHTML;
  var html = Mustache.render(template,{
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  var li = document.createElement('li');
  li.innerHTML = `${html}`;
  document.getElementById('messages').appendChild(li);
  // var li = document.createElement('li');
  // var a = document.createElement('a');
  // a.innerHTML = 'My current location';
  // a.setAttribute('target','_blank');
  // li.innerHTML = `${message.from} ${formattedTime}: `;
  // a.setAttribute('href', message.url);
  // li.appendChild(a);
  // document.getElementById('messages').appendChild(li);
});

document.getElementById('message-form').addEventListener('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from: 'user',
    text: document.getElementById('input').value
  }, function(){
    document.getElementById('input').value = '';
  });
});

var locationButton = document.getElementById('send-location');

locationButton.addEventListener('click',function(){
  if (!navigator.geolocation){
      return alert('geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function(){
    alert('unable to fetch location');
  });
});
