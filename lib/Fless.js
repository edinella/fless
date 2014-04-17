'use strict';
var zmq = require('zmq');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Fless;
function Fless(alias, monitorChannelPath, readyCallback){
  EventEmitter.call(this);
  var instance = this;

  // monitor
  monitorChannelPath = monitorChannelPath || 'tcp://*:5555';
  var sender = zmq.socket('pub');
  sender.identity = 'proc' + process.pid;
  sender.bind(monitorChannelPath, readyCallback);

  // create monitor
  this.on('flessActivity', function(){
    console.log('flessActivity');
    console.log(arguments);
  });
  this.on('sockActivity', function(){
    console.log('sockActivity');
    console.log(arguments);
  });

  // import zmq properties
  for(var i in zmq) this[i] = zmq[i];

  // monitore emit
  this.emit = envelope(this.emit, function(){
    instance.emit('flessActivity', arguments);
  });

  // monitore socket
  this.socket = this.createSocket = envelope(this.socket, null, function(){
    instance.emit('sockActivity', arguments);
  });
}

function envelope(fn, before, after){
  return function(){
    if(before) before.apply(this, arguments);
    var result = fn.apply(this, arguments);
    if(after) after.apply(this, arguments);
    return result;
  };
}

util.inherits(Fless, EventEmitter);
