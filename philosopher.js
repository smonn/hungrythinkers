(function (global) {
  'use strict';
  var initialized,
    observable,
    philosopher,
    eatState,
    thinkState,
    fork,
    handler;
  
  observable = function (that) {
    var observers = [];
    
    that.observe = function (observer) {
      observers.push(observer);
    };
    
    that.notify = function () {
      var i;
      for (i = 0; i < observers.length; i += 1) {
        observers[i](that);
      }
    };
    
    return that;
  };
  
  fork = function (index) {
    var that = {},
      pickedByName = '',
      picked = false;
    
    that = observable(that);
    
    that.index = function () {
      return index;
    };
    
    that.pickup = function (name) {
      if (picked === false) {
        picked = true;
        pickedByName = name
        that.notify();
        return true;
      }
      
      return false;
    };
    
    that.drop = function (name) {
      if (picked === true && pickedByName === name) {
        picked = false;
        pickedByName = '';
        that.notify();
        return true;
      }
      
      return false;
    };
    
    that.pickedByName = function (name) {
      return pickedByName === name;
    };
    
    that.name = function () {
      return pickedByName;
    };
    
    that.silentUpdate = function (name, state) {
      pickedByName = name;
      picked = state;
    };
    
    return that;
  };
  
  eatState = function (philosopher) {
    var that = {},
      name = philosopher.name(),
      left = philosopher.leftFork(),
      right = philosopher.rightFork();
    
    that.type = 'eat';
    
    that.tick = function () {
      philosopher.fed();
      
      if (philosopher.hunger() === 0) {
        left.drop(name);
        right.drop(name);
        return thinkState(philosopher);
      } else {
        return that;
      }
    };
    
    return that;
  };
  
  thinkState = function (philosopher) {
    var that = {},
      name = philosopher.name(),
      left = philosopher.leftFork(),
      right = philosopher.rightFork();
      
    that.type = 'think';
    
    that.tick = function () {
      left.pickup(name);
      right.pickup(name);
      
      if (left.pickedByName(name) && right.pickedByName(name)) {
        return eatState(philosopher);
      }

      left.drop(name);
      right.drop(name);
      philosopher.hungry();
      
      return that;
    };
    
    return that;
  };
  
  philosopher = function (name, leftFork, rightFork) {
    var that = {},
      hunger = 0,
      state;
      
    that = observable(that);
    
    that.name = function () {
      return name;
    };
    
    that.hungry = function () {
      hunger += 1;
    };
    
    that.fed = function () {
      hunger -= 2;
      
      if (hunger < 0) {
        hunger = 0;
      }
    };
    
    that.leftFork = function () {
      return leftFork;
    };
    
    that.rightFork = function () {
      return rightFork;
    };
    
    that.tick = function () {
      state = state.tick();
      that.notify();
    };
    
    state = thinkState(that);
    
    that.state = function () {
      return state.type;
    };
    
    that.hunger = function () {
      return hunger;
    };
    
    return that;
  };
  
  handler = (function () {
    var that = {},
      data = {
        philosopher: null,
        leftFork: null,
        rightFork: null
      };
    
    that.init = function (name, leftForkIndex, rightForkIndex) {
      data.leftFork = fork(leftForkIndex);
      data.rightFork = fork(rightForkIndex);
      data.philosopher = philosopher(name, data.leftFork, data.rightFork);
      that.observe();
    };
    
    that.observe = function () {
      data.leftFork.observe(that.updateFork);
      data.rightFork.observe(that.updateFork);
      data.philosopher.observe(that.updatePhilosopher);
    };
    
    that.updateFork = function (fork) {
      var type = (fork.name() === '') ? 'dropped' : 'picked',
        index = fork.index(),
        name = fork.name();
      global.postMessage({ type: type, index: index, name: name });
    };
    
    that.updatePhilosopher = function (philosopher) {
      global.postMessage({ type: 'state', state: philosopher.state(), hunger: philosopher.hunger(), name: philosopher.name() });
    };
    
    that.tick = function (forks) {
      var i;
      
      for (i = 0; i < forks.length; i += 1) {
        if (data.leftFork.index() === i) {
          data.leftFork.silentUpdate(forks[i], forks[i] !== '');
        }
        if (data.rightFork.index() === i) {
          data.rightFork.silentUpdate(forks[i], forks[i] !== '');
        }
      }
      
      data.philosopher.tick();
    };
    
    return that;
  }());
  
  global.onmessage = function (event) {
    if (event.data.type === 'init') {
      handler.init(event.data.name, event.data.left, event.data.right);
    } else if (event.data.type === 'tick') {
      handler.tick(event.data.forks);
    }
  };
  
}(this));
