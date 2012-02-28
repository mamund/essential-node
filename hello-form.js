/* essential node */
/* hello form */

// modules
var http = require('http');
var querystring = require('querystring');

function handler(req, res) {

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
    + '<p><a href="/">return</a></p>'

  main();

  function main() {
    if(req.url === g.url) {
      switch(req.method) {
      case 'GET':
        handleGet();
        break;
      case 'POST':
        handlePost();
        break;
      default:
        sendResponse(405, 'Method not allowed', '<h1>405 - Method not allowed</h1>');
      }
    }
    else {
      sendResponse(404, 'Not found', '<h1>404 - Not found</h1>');
    }
  }

  function handleGet() {
    sendResponse(200, 'OK', g.form);
  }

  function handlePost() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      var results = querystring.parse(body);
      sendResponse(200, 'OK', g.output.replace('{@email}',results.email));
    });

  }

  function sendResponse(status, text, body) {
    res.writeHead(status, text, g.textHtml);
    res.end(body);
  }

}

http.createServer(handler).listen(process.env.PORT);