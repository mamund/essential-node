/* hello, oscon */

var http = require('http');
var port = (process.env.PORT || 1337);

function handler(req, res) {

	res.writeHead(200, 'OK', {'Content-Type' : 'text/html'});
	res.end('<h1>Hello, OSCON from ' + req.url + '</h1>');
}

http.createServer(handler).listen(port);
