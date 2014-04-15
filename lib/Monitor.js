'use strict';
var zmq = require('zmq');
var Node = require('./Node');

module.exports = Monitor;
function Monitor(monitorChannelPath, readyCallback){
  this.sender = zmq.socket('pub');
  this.sender.identity = 'publisher' + process.pid;
  this.sender.bind(monitorChannelPath, readyCallback);
}

Monitor.prototype.node = function(alias){
  return new Node(this, alias);
};
