const http = require('http');
const util = require('util');
const fs = require('fs');
const path = require('path');

function listen(hostname, port) {
  const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(util.format(new Date).replace(/[-:.]/g, '_'));
    console.log(req.method);
    console.log(req.connection.remoteAddress);
    console.log(req.headers['x-q-filename']);
    console.log('===');
    
    if (req.method === 'GET') {
      res.statusCode = 200;
      
      if (req.url === '/favicon.ico') {
        res.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream('favicon.ico').pipe(res);
      } else {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        fs.createReadStream('index.html').pipe(res);
        //res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        //fs.createReadStream('send-3.js').pipe(res);
      }
    } else {
      var fn = req.headers['x-q-filename'] || decodeURIComponent(req.url);
      var ext;
      
      if (fn) {
        ext = path.extname(fn);
        fn = path.basename(fn, ext);
      }
      
      ext = ext || '.bin';
      
      var name = (fn ? fn + ' [' : '') + util.format(new Date).replace(/[-:.]/g, '_') + (fn ? ']' : '') + ' [' + req.connection.remoteAddress.replace(/:/g, '_') + ']' + ext;
      req.pipe(fs.createWriteStream('files/' + name)).on('finish', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(name);
        console.log("DONE: %s", name);
        console.log("===");
      });
    }
  });
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname.indexOf(':') !== -1 ? `[${hostname}]` : hostname}:${port}/`);
    console.log('===');
  });
}

//listen('0.0.0.0', 5157);
listen('::', 5157);
