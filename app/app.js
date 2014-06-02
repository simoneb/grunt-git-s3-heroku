require('http').createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(require('../package.json').version);
}).listen(process.env.PORT || 3000);