# fless
Frictionless monitored flow manager

## Features
* Graph monitoring
  * Structure
  * Processes
    * Properties
    * Vital signals
  * Sockets
    * Properties
    * Status
    * Activities
    * Data sampling

## Dependencies
* [ZeroMQ](http://www.zeromq.org)

## Installation & usage

```sh
npm install --save fless
```

producer.js
```js
var Fless = require('fless');
var flow = new Fless('producer');
var sock = flow.socket('push');
sock.bindSync(3000);
setInterval(function(){
  sock.send('hello');
}, 150);
```

worker.js
```js
var Fless = require('fless');
var flow = new Fless('worker');
var sock = flow.socket('pull');
sock.connect(3000);
sock.on('message', function(msg){
  console.log('work: %s', msg.toString());
});
```

monitor.js
```js
var Fless = require('fless');
var flow = new Fless('monitor');
var handle = Fless.panel(9000);
flow.monitor(handle);
flow.monitor(function(){
  this.on('message', function(){});
});
```

## Contribute
Environment setup instructions for developing and testing

### Dependencies
* [GIT](http://git-scm.com)
* [Vagrant](http://vagrantup.com)
* [VirtualBox](http://virtualbox.org)

### Installation

```sh
git clone https://github.com/edinella/fless.git && cd fless

vagrant up
vagrant ssh
```

### Testing

```js
npm test
```
