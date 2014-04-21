'use strict';
var hooks = require('../../lib/hooks');

describe('hooks', function(){
  var scope, arg, res, hkRes;
  beforeEach(function(){
    scope = {};
    arg = {};
    res = {};
    hkRes = {};
  });
  it('.after should envelope a function and execute a hook after it', function(){
    var hooked = hooks.after(fn, hookFn);
    var hookedResult = hooked.call(scope, arg);
    expect(hookedResult).to.be.equal(hkRes);
    function fn(x){
      expect(this).to.be.equal(scope);
      expect(x).to.be.equal(arg);
      return res;
    }
    function hookFn(args, result){
      expect(this).to.be.equal(scope);
      expect(args[0]).to.be.equal(arg);
      expect(result).to.be.equal(res);
      return hkRes;
    }
  });
  it('.before should envelope a function and execute a hook before it', function(){
    var hooked = hooks.before(fn, hookFn);
    var hookedResult = hooked.call(scope, arg);
    expect(hookedResult).to.be.equal(res);
    function fn(x){
      expect(this).to.be.equal(scope);
      expect(x).to.be.equal(hkRes);
      return res;
    }
    function hookFn(callerArg){
      expect(this).to.be.equal(scope);
      expect(callerArg).to.be.equal(arg);
      return [hkRes];
    }
  });
});
