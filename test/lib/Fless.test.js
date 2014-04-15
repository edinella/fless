'use strict';
var Fless = require('../../');
var zmq = require('zmq');

describe('Fless', function(){
  it('should be a constructor', function(){
    expect(Fless).to.be.an('function');
  });
  it('should generate a object with same properties that ZMQ', function(){
    var flow = new Fless();
    for(var property in zmq)
      expect(flow).to.have.property(property);
  });
  it('.socket and .createSocket should be the same function', function(){
    var flow = new Fless();
    expect(flow.socket).to.be.equal(flow.createSocket);
  });
});

// var flow = new Fless('tcp://*:5555', function(){
//   var sock = flow.socket('pull');
//   return sock;
// });
