'use strict';
var zmq = require('zmq');
var util = require('util');
// var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EventEmitter = require('events').EventEmitter;

module.exports = Monitor;
function Monitor(monitorChannelPath, readyCallback){
  EventEmitter.call(this);
  this.sender = zmq.socket('pub');
  this.sender.identity = 'publisher' + process.pid;
  this.sender.bind(monitorChannelPath, readyCallback);
}
util.inherits(Monitor, EventEmitter);
//
// Monitor.prototype.event = function(event, alias, scope, args){
//   console.log('%s '+event, alias);
//   console.log(args);
// };
