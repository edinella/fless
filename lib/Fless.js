'use strict';
var zmq = require('zmq');
var Monitor = require('./Monitor');

module.exports = Fless;
function Fless(alias, monitorChannelPath, readyCallback){
  var self = this;

  // create monitor
  var monitor = new Monitor(monitorChannelPath || 'tcp://*:5555', readyCallback);
  monitor.on('flessActivity', function(){
    console.log('flessActivity');
    console.log(arguments);
  });
  monitor.on('sockActivity', function(){
    console.log('sockActivity');
    console.log(arguments);
  });

  // import zmq properties
  for(var i in zmq) this[i] = zmq[i];

  // extend zmq events
  var flessEmit = this.emit;
  this.emit = function(event){
    monitor.emit('flessActivity', arguments);
    flessEmit.apply(this, arguments);
  };

  // extend socket events
  var socket = this.socket;
  this.socket = this.createSocket = function(){
    var sock = socket.apply(this, arguments);
    var sockEmit = sock.emit;
    sock.emit = function(event){
      monitor.emit('sockActivity', arguments);
      sockEmit.apply(this, arguments);
    };
    return sock;
  };
}
