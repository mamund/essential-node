/* essential node */
/* hello, authentication */

var http = require('http');
var fs  = require('fs');

function handler(req, res) {

  var m = {};
  m.homeUrl = '/';
  m.secureUrl = '/secure';
  m.textHtml = {'Content-Type' : 'text/html'};
  m.errorMessage = '<h1>{@status} Error: {@msg}</h1>';

  main();

  function main() {

    switch(req.url) {
      case m.homeUrl:
        if(req.method==='GET') {
          getHomePage();
        }
        else {
          showError(405, 'Method not allowed');
        }
        break;
      case m.secureUrl:
        if(req.method==='GET') {
          validateUser(getSecurePage);
        }
        else {
          showError(405, 'Method not allowed');
        }
        break;
      default:
        showError(404, 'Not found');
    }
  }

  /* get home template */
  function getHomePage() {
    fs.readFile('./auth/home.html', 'ascii', sendHomePage);
  }
  function sendHomePage(err, data) {
    if(err) {
      showError(500,err.message);
    }
    else {
      data = data.replace('{@secureUrl}', m.secureUrl);
      data = data.replace('{@dateTime}',new Date());
      res.writeHead(200, "OK", m.textHtml);
      res.end(data);
    }
  }

  /* get home template */
  function getSecurePage() {
    fs.readFile('./auth/secure.html', 'ascii', sendSecurePage);
  }
  function sendSecurePage(err, data) {
    if(err) {
      showError(500,err.message);
    }
    else {
      data = data.replace('{@homeUrl}', m.homeUrl);
      data = data.replace('{@dateTime}',new Date());
      res.writeHead(200, "OK", m.textHtml);
      res.end(data);
    }
  }

  function validateUser(next) {

    var parts, auth, scheme, credentials;

    auth = req.headers['authorization'];
    if (!auth){
      return authRequired('hello-auth');
    }

    parts = auth.split(' ');
    scheme = parts[0];
    credentials = new Buffer(parts[1], 'base64').toString().split(':');

    if ('Basic' != scheme) {
      return badRequest();
    }
    req.credentials = credentials;

    // check the credentials:
    if(credentials[0]==='admin' && credentials[1]==='s3cr3t') {
      next();
    }
    else {
      return authRequired('hello-auth');
    }
  }

  /* not authorized */
  function forbidden() {

    var body = 'Forbidden';

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.statusCode = 403;
    res.end(body);
  }

  /* you must authorize first */
  function authRequired(realm) {
    var r = (realm||'Authentication Required');
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="' + r + '"');
    res.end('Unauthorized');
  }

  /* something sent bad */
  function badRequest() {
    res.statusCode = 400;
    res.end('Bad Request');
  }

  /* show error page */
  function showError(status, msg) {
    res.writeHead(status, msg, m.textHtml);
    res.end(m.errorMessage.replace('{@status}', status).replace('{@msg}', msg));
  }
}

http.createServer(handler).listen(process.env.PORT);