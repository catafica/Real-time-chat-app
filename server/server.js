const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');
const {isRealString} = require ('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');



  socket.on('join', function(params, callback){
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',{
      from: 'Admin',
      text: 'Welcome to chat app',
      createdAt: new Date().getTime()
    });
    socket.broadcast.to(params.room).emit('newMessage',{
      from: 'admin',
      text: `${params.name} joined the room`,
      createdAt: new Date().getTime()
    });
    callback();
  });



  socket.on('createMessage',function(data, callback){
    console.log(data);
    io.emit('newMessage',{
      from: data.from,
      text: data.text,
      createdAt: new Date().getTime()
    });
    callback();
  });

  socket.on('createLocationMessage',function(coords){
    io.emit('newLocationMessage',{
      from: 'Admin',
      url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', function(){
    var user = users.removeUser(socket.id);
    if (user){
      io.to(user[0].room).emit('updateUserList', users.getUserList(user[0].room));
      io.to(user[0].room).emit('newMessage',{
        from: 'Admin',
        text: `${user[0].name} has left the room`
      });
    }
  });

});


server.listen(3000 ,() => {
  console.log('server up and runnin')
})
