var http = require('http')
var express = require('express');
var app = express();
var server = http.createServer(app)
var io = require("socket.io").listen(server);

var redis = require('redis')
var rclient = redis.createClient(6379, "localhost");

var messages = [];

var storeMessage = function(name, data) {
  var message = JSON.stringify({name:name, data:data});
  rclient.lpush("messages", message, function(err, response) {
    rclient.ltrim("messages", 0, 10)
  });
}

io.sockets.on('connection', function(client) {
  console.log('Client has connected...');

  client.on('join', function(name) {
    client.broadcast.emit("add chatter", name)

    rclient.smembers('names', function(err, names) {
      names.forEach(function(name){
        client.emit("add chatter", name)
      });
    });

    rclient.sadd("names", name)

    rclient.lrange("messages", 0, -1, function(err, messages) {
//      messages = messages.reverse;
      messages.forEach(function(message) {
        message = JSON.parse(message)
        client.emit("message", message.name + ": " + message.data)
      });
    });

    console.log(name + " has connected");
    client.set("nickname", name);
    client.broadcast.emit('chat', name + " joined the chat");
  });

  client.on('messages', function(message) {
    client.get("nickname", function(err, name) {
      client.broadcast.emit('message', name + ": " + message);
      storeMessage(name, message);
    })
  });
});

app.get("/chat", function(req, res) {
  res.render('chat.ejs');
})

server.listen(8080);