/*jslint indent: 2 */
(function (global) {
  'use strict';
  var eatState,
    thinkState,
    worker;
    
  global.importScripts('observable.js');
  
  global.philosopher = function (name) {
    var that = {},
      state = thinkState(that),
      forks = { left: false, right: false },
      hunger = 0;
      
    that = global.observable(that);
      
    that.name = function () {
      return name;
    };
    
    that.tick = function () {
      state = state.tick();
      that.notify();
    };
    
    that.hunger = function () {
      return hunger;
    };
    
    that.feed = function () {
      hunger -= 5;
      if (hunger < 0) {
        hunger = 0;
      }
    };
    
    that.hungry = function () {
      hunger += 1;
    };
    
    that.leftFork = function (state) {
      if (state === undefined) {
        return forks.left;
      } else {
        forks.left = state;
      }
    };
    
    that.rightFork = function (state) {
      if (state === undefined) {
        return forks.left;
      } else {
        forks.left = state;
      }
    };
    
    that.state = function () {
      return state.type();
    };
    
    return that;
  };
  
  thinkState = function (philosopher) {
    var that = {};
    
    that.type = function () {
      return 'think';
    };
    
    that.tick = function () {
      philosopher.hungry();
      
      if (philosopher.leftFork() && philosopher.rightFork()) {
        return eatState(philosopher);
      }
      
      worker.requestForks();
      return that;
    };
    
    return that;
  };
  
  eatState = function (philosopher) {
    var that = {};
    
    that.type = function () {
      return 'eat';
    };
    
    that.tick = function () {
      philosopher.feed();
      
      if (philosopher.hunger() === 0) {
        worker.releaseForks();
        return thinkState(philosopher);
      }
      
      return that;
    };
    
    return that;
  };
  
  worker = (function () {
    var that = {},
      timer,
      timeout,
      philosopher,
      leftForkIndex,
      rightForkIndex;
    
    that.init = function (config) {
      timeout = config.timeout;
      leftForkIndex = config.left;
      rightForkIndex = config.right;
      philosopher = global.philosopher(config.name);
      philosopher.observe(that.listener);
      that.run();
    };
    
    that.listener = function () {
      that.post('status', philosopher.name(), philosopher.leftFork(), philosopher.rightFork(), philosopher.hunger(), philosopher.state());
    };
    
    that.run = function () {
      philosopher.tick();
      timer = global.setTimeout(that.run, timeout);
    };
    
    that.forks = function (forks) {
      philosopher.leftFork(forks.left);
      philosopher.rightFork(forks.right);
    };
    
    that.post = function (type, name, left, right, hunger, state) {
      global.postMessage({ type: type, name: name, left: left, right: right, hunger: hunger, state: state });
    };
    
    that.requestForks = function () {
      that.post('request', philosopher.name(), leftForkIndex, rightForkIndex);
    };
    
    that.releaseForks = function () {
      that.post('release', philosopher.name(), leftForkIndex, rightForkIndex);
    };
    
    return that;
  }());
  
  global.onmessage = function (event) {
    if (worker.hasOwnProperty(event.data.type)) {
      worker[event.data.type](event.data);
    }
  };
  
}(this));
