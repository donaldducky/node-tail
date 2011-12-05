var fs = require('fs'),
  util = require('util'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if (!filename) return util.log('Usage: node server.js filename');

var tail = spawn('tail', ['-f', filename]);
util.log('Started tailing: ' + filename.toString());

var server = require('http').createServer(function(req, response){
  fs.readFile('index.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(data);
    response.end();
  });
});
server.listen(8228);
console.log('Running server http://localhost:8228');

var everyone = require('now').initialize(server);

everyone.connected(function(){
  //console.log('Joined: ' + this.now.name);
  util.log('Someone joined');
  everyone.getUsers(function(users){
    console.log('Total users: ', users.length);
    for (var i = 0; i < users.length; i++) console.log(users[i]);
  })
});

everyone.disconnected(function(){
  //console.log('Left: ' + this.now.name);
  util.log('Someone left');
  everyone.getUsers(function(users){
    console.log('Total users: ', users.length);
    for (var i = 0; i < users.length; i++) console.log(users[i]);
  })
});

everyone.now.sendLog = function(msg){
  everyone.now.addLog(msg);
};


tail.stdout.on('data', function(data){
  console.log('tail: ', data.toString());
  everyone.now.sendLog(data.toString());
});

