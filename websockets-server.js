var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = "";
var newtopic = "";
console.log('websocketes server started');

ws.on('connection', function(socket) {
  console.log('client connection established');
  socket.send(topic);
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  var checkChangeTopic = 0;
  socket.on('message', function(data) {
    console.log('message received: ' + data);
    var firstWord = data.split(" ");
    if (firstWord[0].localeCompare('/topic') == 0) {
      newtopic = "**Topic change to " + data.slice(6) + "***";
      topic = "Topic is " + data.slice(6);
      data = "";
      checkChangeTopic = 1;
    } else {
      checkChangeTopic = 0;
      messages.push(data);
    }

    ws.clients.forEach(function(clientSocket) {
      if (checkChangeTopic == 1) {
        clientSocket.send(newtopic);
      } else {
        clientSocket.send(data);
      }

    });
    //  socket.send(data);
  });
});
