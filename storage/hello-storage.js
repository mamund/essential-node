/* essential node examples*/
/* hello-storage */

// native modules
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

// global vars
var g = {};
g.host = '0.0.0.0';
g.port = (process.env.PORT ? process.env.PORT : 80);

/* handle requests */
function handler(req, res) {

  var m = {};
  m.page = '';
  m.dataDir = './data/';

  m.homeUrl = '/';
  m.closeUrl = '/close';

  m.textHtml = {'Content-Type' : 'text/html'};
  m.errorMessage = '<h1>{@status} : {@msg}</h1>';
  m.taskline =
    '<li>' +
    '<form class="remove" action="{@closeUrl}" method="post">' +
    '<label>{@task}</label><input name="id" type="hidden" value="{@id}" />' +
    '<input type="submit" value="Done" />' +
    '</form>' + '</li>\n';

  // run code
  main();

  /* respond to callers */
  function main() {

    switch(req.url) {
      case m.homeUrl:
        switch(req.method) {
          case 'POST':
            processAdd();
            break;
          case 'GET':
            getHomePage();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.closeUrl:
        if(req.method === 'POST') {
          processClose();
        }
        else {
          showError(405, 'Method not allowed');
        }
        break;
      default:
        showError(404, 'Page not found');
        break;
    }
  }

  function getHomePage() {
    fs.readFile('./storage/home.html','ascii', function(err, data) {
      if(err) {
        showError(500, err.message);
      }
      else {
        m.page = data;
        fs.readdir(m.dataDir, processFiles);
      }
    });
  }

  function processFiles(err, files) {
    var i, x, item, output, line, data;

    if(err) {
      showError(500, err.message);
    }
    else {
      output = '';

      // process all the stored data files
      for(i=0, x=files.length; i<x; i++) {
        try {
          data = fs.readFileSync(m.dataDir+files[i], 'ascii');
          item = JSON.parse(data);

          line = m.taskline;
          line = line.replace('{@closeUrl}', m.closeUrl);
          line = line.replace('{@id}', files[i]);
          line = line.replace('{@task}', item.task);

          output += line;
        }
        catch(ex) {
          showError(500,ex.message);
        }
      }

      // populate the template
      m.page = m.page.replace('{@dateTime}', formatDate());
      m.page = m.page.replace('{@output}',output);
      m.page = m.page.replace('{@homeUrl}',m.homeUrl);

      // send it out
      res.writeHead(200, 'OK', m.textHrml);
      res.end(m.page);
    }
  }

  function processAdd() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      var id, item;

      id = getId();
      item = querystring.parse(body);

      fs.writeFile(m.dataDir+id, JSON.stringify(item), function(err) {
        if(err) {
          showError(500, err.message);
        }
        else {
          res.writeHead(200, "OK", m.textHtml);
          res.end('eof');
        }
      });
    });
  }

  function processClose() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      var item;

      item = querystring.parse(body);
      fs.unlink(m.dataDir+item.id, function(err) {
        if(err) {
          showError(500, err.message);
        }
        else {
          res.writeHead(200, "OK", m.textHtml);
          res.end('eof');
        }
      });
   });
  }

  /* show error page */
  function showError(status, msg) {
    res.writeHead(status, msg, m.textHtml);
    res.end(m.errorMessage.replace('{@status}', status).replace('{@msg}', msg));
  }

  // generate id
  function getId() {
    var dt, id;
    dt = new Date();
    id = dt.getMinutes().toString()+
      dt.getSeconds().toString()+
      dt.getMilliseconds().toString();

    return id;
  }

  function formatDate() {
    var dt, date, month, year;

    dt = new Date();
    date = dt.getDate();
    month = dt.getMonth() + 1;
    year = dt.getFullYear();

    return year + '-' + month + '-' + date;
  }
}

/* listen for callers */
http.createServer(handler).listen(g.port, g.host);