'use strict';

var zmq = require('zmq');
var config = require('../config');

exports.list = function list(path){
  path = path || config.monitorPath;
  var receiver = zmq.socket('sub');
  receiver.identity = 'monitor ' + process.pid;
  receiver.on('message', function(data) {
    console.log('received data ' + data.toString());
  });
  receiver.bindSync(path);
  receiver.subscribe('EV');

  console.log('Monitoring thru channel "%s"', path);

};
