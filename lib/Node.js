'use strict';

module.exports = Node;
function Node(monitor, alias){
  this.monitor = monitor;
  this.alias = alias;
}

Node.prototype.sended = function(){
  console.log('%s sended', this.alias);
  console.log(arguments);
};

Node.prototype.received = function(){
  console.log('%s recieved', this.alias);
  console.log(arguments);
};
