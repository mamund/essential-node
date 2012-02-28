/* essential node examples */
/* hello web */

var http = require('http');
var fs = require('fs');

function handler(req, res) {

  var m = {};
  m.homeUrl = '/';
  m.dataUrl = '/data';

  m.textHtml = {'Content-Type' : 'text/html'};
  m.errorMessage = '<h1>{@status} Error: {@msg}</h1>';

  m.remoteData = null;
  m.remoteHost = 'identi.ca';
  m.remoteUrl = 'http://{@remoteHost}/api/statuses/public_timeline.json';
  m.remoteFormat = '<dt>{@user}</dt><dd>{@msg}</dd>\n';

  main();

  function main() {
    switch (req.url) {
      case m.homeUrl:
        getHomePage();
        break;
      case m.dataUrl:
        getData();
        break;
      default:
        showError(404, "File not found");
        break;
    }
  }

  /* get home template */
  function getHomePage() {
    fs.readFile('web-home.html','ascii',sendHomePage);
  }

  function sendHomePage(err, data) {
    if(err) {
      showError(500,err.message);
    }
    else {
      data = data.replace('{@dataUrl}', m.dataUrl);
      data = data.replace('{@dateTime}',new Date());
      res.writeHead(200, "OK", m.textHtml);
      res.end(data);
    }
  }

  /* get data from web site */
  function getData() {
    var httpClient, clientReq, headers, body, url;

    body = '';
    url =  m.remoteUrl.replace('{@remoteHost}',m.remoteHost);
    headers = {
      'Host' : m.remoteHost,
      'Content-Type' : 'application/json'
    };

    httpClient = http.createClient(80, m.remoteHost);
    clientReq = httpClient.request('GET', url, headers);

    clientReq.on('response', function(clientRes) {

      clientRes.on('data', function(chunk) {
        body += chunk;
      });

      clientRes.on('end', function() {
        m.remoteData = JSON.parse(body);
        fs.readFile('web-data.html', 'ascii', sendData);
      });
    });

    // close connection
    clientReq.end();
  }

  /* send the data to the caller */
  function sendData(err, data) {
    var output, row, i, x;

    if(err) {
      showError(500,err.message);
    }
    else {

      output = '';
      for(i=0,x=m.remoteData.length;i<x;i++) {
        row = m.remoteFormat;
        row = row.replace('{@user}', m.remoteData[i].user.screen_name);
        row = row.replace('{@msg}', m.remoteData[i].statusnet_html);
        output += row;
      }

      data = data.replace('{@remoteHost}', m.remoteHost);
      data = data.replace('{@output}', output);

      res.writeHead(200, "OK", m.textHtml);
      res.end(data);
    }
  }

  /* show error page */
  function showError(status, msg) {
    res.writeHead(status, msg, m.textHtml);
    res.end(m.errorMessage.replace('{@status}', status).replace('{@msg}', msg));
  }

}

http.createServer(handler).listen(process.env.PORT);
