var http = require('http');
var colors = require('colors');
const displayContent = require('./routes');

var server = http.createServer(displayContent);

server.listen(3000);


