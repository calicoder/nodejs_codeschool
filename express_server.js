var express = require('express');
var request = require('request');
var url = require('url')
var app = express();

app.get('/', function(request, response) {
   response.sendfile(__dirname + '/index.html')
});

app.get('/tweeter/:username', function(req, response){
  console.log("1");
  var username = req.params.username
  options = {
    protocol: "http:",
    host: "api.twitter.com",
    pathname: "/1/statuses/user_timeline.json",
    query: {screen_name: username, count: 10}
  }

  var twitterURL = url.format(options);

  request(twitterURL, function(err, res, body) {
    var tweets = JSON.parse(body);
    console.log(tweets);
    response.render('tweets.ejs', {tweets: tweets, name: username});
  });
});

app.listen(8080);
console.log("Listening to 8080...\n")