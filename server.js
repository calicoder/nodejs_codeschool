var http = require('http');
var port = 8080;

http.createServer(function(req, res) {
   res.writeHead(200);
   res.write("Hello DOGGY is running");

   setTimeout(function() {
     res.write("Dog is done");
     res.end();
   }, 5000);

}).listen(port);


//var server = http.createServer();
//server.on('request', function(request,response) {
//  res.writeHead(200);
//  res.write("Hello DOGGY is running");
//})

console.log('Listening on port ' + port);