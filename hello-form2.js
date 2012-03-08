/* essential node */
/* hello form */

// modules
var http = require('http');
var querystring = require('querystring');

http.createServer(handler).listen(process.env.PORT);

var g = {};
g.url = '/';
g.textHtml = {'Content-Type':'text/html'};
g.form = '<h1>hello, form!</h1>'
  + '<form method="post" action="/" >'
  + '<label>Email: </label>'
  + '<input name="email" type="email" value="" placeholder="user@example.org" required="true" />'
  + '<input type="submit" />'
  + '</form>';
g.output = '<h1>hello, form!</h1>'
  + '<p>{@email}</p>'
  + '<p><a href="/">return</a></p>';

function handler(req, res) {

  if(req.url === g.url) {
    switch(req.method) {
    case 'GET':
      handleGet(req,res);
      break;
    case 'POST':
      handlePost(req,res);
      break;
    default:
      sendResponse(req, res, 405, 'Method not allowed', '<h1>405 - Method not allowed</h1>');
    }
  }
  else {
    sendResponse(req, res, 404, 'Not found', '<h1>404 - Not found</h1>');
  }
}

function handleGet(req, res) {
  sendResponse(req, res, 200, 'OK', g.form);
}

function handlePost(req, res) {
  var body = '';

  req.on('data', function(chunk) {
    body += chunk.toString();
  });

  req.on('end', function() {
    var results = querystring.parse(body);
    sendResponse(req, res, 200, 'OK', g.output.replace('{@email}',results.email));
  });
}

function sendResponse(req, res, status, text, body) {
  res.writeHead(status, text, g.textHtml);
  res.end(body);
}