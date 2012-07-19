/* essential node samples */
/* hello, node */

// declare module to use
var http = require('http');
var port = (process.env.PORT || 1337);

// handle all requests
function handler(req, res) {
  res.writeHead(200, 'OK',{'Content-Type':'text/plain'});
  res.end('Hello, node!  from '+ req.url);
}

// listen for requests
http.createServer(handler).listen(port);
