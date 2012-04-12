/* essential node examples */
/* hello, files */

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// npm isntall mime
var mime = require('mime');

function handler(req,res) {

  var m = {};

  // unique per instance, right?
  m.doc = '';
  m.name = '';
  m.start = '.';
  m.req = req;
  m.res = res;

  // global/static?
  m.dir = './files/home.html';
  m.textHtml = {'content-type' : 'text/html'};

  m.doc = url.parse(req.url).pathname;
  m.name = path.join(m.start, m.doc);

  // this creates a function for each interation, right?
  path.exists(m.name, function(exists){getFile(exists, m);});
}

function getFile(exists, m) {
  if(!exists) {
    m.res.writeHead(404, 'Not found', m.textHtml);
    m.res.end('<h1>File not found: '+m.name + '</h1>');
  }
  else {
    if(fs.statSync(m.name).isDirectory()) {
      m.name += m.dir;
    }
    // this creates a function for each interation, right?
    fs.readFile(m.name, "binary", function(err, file){sendFile(err, file, m);});
  }
}

function sendFile(err, file, m) {
  if(err) {
    m.res.writeHead(500, 'Server Error', m.textHtml);
    m.res.end('<h1>' + err.message + '</h1>');
  }
  else {
    m.res.writeHead(200, {'Content-Type' : mime.lookup(m.name)});
    m.res.write(file, "binary");
    m.res.end();
  }
}

http.createServer(handler).listen(process.env.PORT);
