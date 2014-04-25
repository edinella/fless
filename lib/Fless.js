'use strict';
var zmq = require('zmq');
var cuid = require('cuid');
var util = require('util');
var hooks = require('./hooks');
var config = require('../config');
var machineId = cuid();

module.exports = function Fless(alias, path, callback){
  var sender = zmq.socket('pub');
  var instanceId = cuid();

  sender.identity = 'pub' + process.pid;
  sender.connect(path || config.monitorPath);

  for(var i in zmq) this[i] = zmq[i];

  this.socket = this.createSocket = hooks.after(this.socket, function(args, sock){

    console.log(sock.__proto__);

    for(var fnName in sock)
      if(sock.hasOwnProperty(fnName) && typeof sock[fnName] == 'function')
        sock[fnName] = hooks.before(sock[fnName], function(){
          sender.send('EV '+machineId+'.'+instanceId+'.'+args[0]+'.'+fnName+'('+arguments+')')
          return arguments;
        });

    // sock.emit = hooks.before(sock.emit, function(){
    //   sender.send('EV SOCK '+arguments[0]+' '+arguments[1]);
    //   sender.send('EV '+machineId+'.'+instanceId+'.'+args[0]+'.'+fnName+'('+arguments+')')
    //   return arguments;
    // });
    return sock;
  });

  sender.send('EV+'+machineId+'.'+instanceId);
  if(callback) callback(null, this);
}
