/* essential node examples */
/* hello, files */

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// npm isntall mime
var mime = require('mime');

function handler(req, res) {

  var m= {};
  m.doc = '';
  m.name = '';
  m.start = '.';
  m.textHtml = {'content-type' : 'text/html'};

  main();

  function main() {
    m.doc = url.parse(req.url).pathname;
    m.name = path.join(m.start, m.doc);
    path.exists(m.name, getFile);
  }

  function getFile(exists) {
    if(!exists) {
      res.writeHead(404, 'Not found', m.textHtml);
      res.end('<h1>File not found: '+m.name + '</h1>');
    }
    else {
      if(fs.statSync(m.name).isDirectory()) {
        m.name += './files/home.html';
      }
      fs.readFile(m.name, "binary", sendFile);
    }
  }

  function sendFile(err, file) {
    if(err) {
      res.writeHead(500, 'Server Error', m.textHtml);
      res.end('<h1>' + err.message + '</h1>');
    }
    else {
      res.writeHead(200, {'Content-Type' : mime.lookup(m.name)});
      res.write(file, "binary");
      res.end();
    }
  }
}

http.createServer(handler).listen(process.env.PORT);
