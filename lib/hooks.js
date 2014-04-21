'use strict';

exports.after = function after(fn, hookFn){
  return function(){
    return hookFn.call(this, arguments, fn.apply(this, arguments));
  };
}

exports.before = function before(fn, hookFn){
  return function(){
    return fn.apply(this, hookFn.apply(this, arguments));
  };
}
