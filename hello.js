/* essential node samples */
/* hello, node */

// declare module to use
var http = require('http');

// handle requests
function handler(req, res) {

  res.writeHead(200, 'OK',{'Content-Type':'text/plain'});
  res.end('Hello, node!');
}

// listen for requests
http.createServer(handler).listen(process.env.PORT);