'use strict';
var zmq = require('zmq');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Monitor;
function Monitor(monitorChannelPath, readyCallback){
  EventEmitter.call(this);
  this.sender = zmq.socket('pub');
  this.sender.identity = 'publisher' + process.pid;
  this.sender.bind(monitorChannelPath, readyCallback);
}

util.inherits(Monitor, EventEmitter);
