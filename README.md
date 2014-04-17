# fless
Frictionless monitored flow manager

## Structure
* Machine
  * Fless instances
    * Sockets
      * Messages

## Monitoring data

### Data structure
* Machine
  * id
  * _disk_ (HOT DATA)
  * _memory_ (HOT DATA)
  * _load_ (HOT DATA)
  * Fless instances
    * id
    * alias
    * _process_
      * pid
      * cwd
      * argv
      * _memory_ (HOT DATA)
      * _load_ (HOT DATA)
    * _Sockets_
      * type
      * _status_ (HOT DATA)
      * _Messages_ (HOT DATA)
        * count
        * _io data sample_

### Cold data
[ Instance ] PUB -> SUB [ Monitor ]

* Machine
  * id
  * Fless instances
    * id
    * alias
    * _process_
      * pid
      * cwd
      * argv
    * _Sockets_
      * type

### Hot data
[ Instance ] RES <- REQ [ Monitor ]

* machine
  * disk
  * memory
  * load
  * processes
    * memory
    * load
  * instances
    * sockets
      * status
      * messages
        * count
        * sampling

### Hotest data (each event)
[ Instance ] PUB -> SUB [ Monitor ]

* machine up
* machine error
* instance up
* instance error
* socket status change

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
sock.bindSync('tcp://*:3000');
setInterval(function(){
  sock.send('hello');
}, 150);
```

worker.js
```js
var Fless = require('fless');
var flow = new Fless('worker');
var sock = flow.socket('pull');
sock.connect('tcp://*:3000');
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
