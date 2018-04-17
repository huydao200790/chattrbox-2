var http = require('http');
var fs = require('fs');
var extract = require('./extract'); // import extract module
var mime = require('mime');
var wss = require('./websockets-server'); //import websockets-server

var handleError = function(err, res) {
  res.writeHead(301, {
    "Location": "https://http.cat/404"
  });

  res.end();
};

var server = http.createServer(function(req, res) {
  console.log('Responding to a request.');

  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {

      //  console.log(mime.getType(filePath));
      res.setHeader('Content-Type', mime.getType(filePath))
      res.end(data);
    }

  });
});
server.listen(3000);
