var express = require('express');
var redis = require('redis');
var haml = require('hamljs');
var db = redis.createClient();
var app = express();

app.engine('.haml', require('hamljs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

app.get('/hello2.txt', function(req, res){
  res.send("Hello World");
});

app.get('/', function(req, res){
  res.send(req.online.length + ' users online');
  //res.send('hi there');
});


app.listen(3000);
console.log('listening to port 3000');

//app.set('view engine', 'html');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(function(req, res, next){
  var ua = req.headers['user-agent'];
  db.zadd('online', Date.now(), ua, next);
});
app.use(function(req, res, next){
  var min = 60 * 1000;
  var ago = Date.now() - min;
  db.zrevrangebyscore('online', '+inf', ago, function(err, users){
    if (err) return next(err);
    req.online = users;
    next();
  });
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
