'use strict';
var Fless = require('../../');
var zmq = require('zmq');

describe('Fless', function(){
  it('should be a constructor', function(){
    expect(Fless).to.be.an('function');
  });
  describe('instance', function(){
    var flow;
    beforeEach(function(){
      flow = new Fless('flesstest');
    });
    it('should generate a object with same properties that ZMQ', function(){
      for(var property in zmq) expect(flow).to.have.property(property);
    });
    it('.socket and .createSocket should be the same function', function(){
      expect(flow.socket).to.be.equal(flow.createSocket);
    });
    describe('socket', function(){
      var pullSock, pushSock, addr = 'tcp://127.0.0.1:12345';
      before(function(){
        pullSock = flow.socket('pull');
        pushSock = flow.socket('push');
        pushSock.bindSync(addr);
        pullSock.connect(addr);
      });
      after(function(){
        pullSock.disconnect(addr);
        pushSock.unbindSync(addr);
      });
      it('should send and receive', function(done){
        this.timeout(1000);
        var randomText = Math.random().toString(36).substr(2,16);
        pullSock.on('message', function(msg){
          expect(msg.toString()).to.be.equal(randomText);
          done();
        });
        setInterval(function(){
          pushSock.send(randomText);
        }, 500);
      });
    });
  });
});
