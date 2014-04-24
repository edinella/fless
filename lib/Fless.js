'use strict';
var zmq = require('zmq');
var cuid = require('cuid');
var util = require('util');
var hooks = require('./hooks');

function Fless(alias, path, readyCallback){
  var path = path || 'tcp://*:5555';
  var instance = this;
  var emit = function(){};
  var instanceId = cuid();

  var sender = zmq.socket('pub');
  sender.identity = 'publisher' + process.pid;
  sender.bind(path, function(){
    emit = function(ev){
      // Fless.flessMachineId;
      // instanceId;
      // ev;
      // console.log('emmited %s', ev);
      sender.send('CMD '+ev);
      sender.send('ETC x');
    };
    emit('nodeCreated', alias);
    if(readyCallback) readyCallback();
  });

  var receiver = zmq.socket('sub');
  receiver.identity = 'subscriber' + process.pid;
  receiver.connect(path);
  receiver.subscribe('CMD');
  receiver.on('message', function(data) {
    console.log('received data ' + data.toString());
  })

  for(var i in zmq) this[i] = zmq[i];

  this.socket = this.createSocket = hooks.after(this.socket, socketDecorator);
  function socketDecorator(args, sock){
    emit('sockCreated', args, sock);

    sock.emit = hooks.before(sock.emit, emitterDecorator);
    function emitterDecorator(){

      emit('sockEvent', arguments);
      return arguments;
    }
    return sock;
  }
}

Fless.flessMachineId = cuid();
module.exports = Fless;
