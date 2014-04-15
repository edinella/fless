'use strict';
var zmq = require('zmq');
var Monitor = require('./Monitor');

module.exports = Fless;
function Fless(alias, monitorChannelPath, readyCallback){
  var monitor = new Monitor(monitorChannelPath || 'tcp://*:5555', readyCallback);
  for(var i in zmq) this[i] = zmq[i];
  var self = this;
  var socket = this.socket;
  this.socket = this.createSocket = function(){
    var sock = socket.apply(this, arguments);
    var send = sock.send;
    sock.send = function(){
      var result = send.apply(this, arguments);
      monitor.node(alias).sended.apply(this, arguments);
      return result;
    };
    return sock;
  };
}
