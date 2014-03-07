var EventEmitter = require('events').EventEmitter;

var logger = new EventEmitter();
logger.on('error', function(message) {
   console.log('ERR: ' + message)
});
