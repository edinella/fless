'use strict';
var zmq = require('zmq');
var util = require('util');
var hooks = require('./hooks');
var EventEmitter = require('events').EventEmitter;

module.exports = Fless;
function Fless(alias, monitorChannelPath, readyCallback){
  EventEmitter.call(this);
  var instance = this;

  // monitor setup
  monitorChannelPath = monitorChannelPath || 'tcp://*:5555';
  var sender = zmq.socket('pub');
  sender.identity = 'proc' + process.pid;
  sender.bind(monitorChannelPath, readyCallback);

  // create monitor
  this.on('sockCreated', function(){
    console.log('sockCreated');
    console.log(arguments);
  });
  this.on('sockEvent', function(){
    console.log('sockEvent');
    console.log(arguments);
  });

  // import zmq properties
  for(var i in zmq) this[i] = zmq[i];

  // monitore socket creation
  this.socket = this.createSocket = hooks.after(this.socket, function(args, sock){
    instance.emit('sockCreated', args, sock);

    // monitore socket events
    sock.emit = hooks.before(sock.emit, function(){
      instance.emit('sockEvent', arguments);
      return arguments;
    });
    return sock;
  });
}

util.inherits(Fless, EventEmitter);
