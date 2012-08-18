/*jslint indent: 2 */
(function (global) {
  'use strict';
  var workerFileName = 'philosopher.js',
    names = ['Mal', 'Kaylee', 'Wash', 'Jayne', 'River'],
    forks = ['', '', '', '', ''],
    emptyClassNames = ['top', 'right', 'bottom-right', 'bottom-left', 'left'],
    timeout = 1000,
    workers = {},
    local = {};
  
  local.init = function () {
    var i,
      right;
    for (i = 0; i < names.length; i += 1) {
      right = i - 1;
      if (right < 0) {
        right = names.length - 1;
      }
      workers[names[i]] = new global.Worker(workerFileName);
      workers[names[i]].onmessage = local.handleMessage;
      workers[names[i]].onerror = local.handleError;
      workers[names[i]].postMessage({ type: 'init', name: names[i], left: i, right: right, timeout: timeout });
    }
  }; 
  
  local.handleMessage = function (event) {
    if (local.hasOwnProperty(event.data.type)) {
      local[event.data.type](event.data);
    }
  };
  
  local.handleError = function (event) {
    global.console.error('worker error', event);
  };
  
  local.request = function (message) {
    var worker = workers[message.name],
      left = false,
      right = false;
    
    if ((forks[message.left] === '' || forks[message.left] === message.name) && (forks[message.right] === '' || forks[message.right] === message.name)) {
      forks[message.right] = message.name;
      forks[message.left] = message.name;
      worker.postMessage({ type: 'forks', left: true, right: true });
    }
    
    local.updateForks();
  };
  
  local.release = function (message) {
    var worker = workers[message.name];
    
    if (forks[message.left] === message.name) {
      forks[message.left] = '';
    }
    
    if (forks[message.right] === message.name) {
      forks[message.right] = '';
    }
    
    local.updateForks();
    worker.postMessage({ type: 'forks', left: false, right: false });
  };
  
  local.updateForks = function () {
    var div = global.document.querySelectorAll('#forks div'),
      i;
    for (i = 0; i < div.length; i += 1) {
      if (forks[i] === '') {
        div[i].className = emptyClassNames[i];
      } else {
        div[i].className = emptyClassNames[i] + ' fork-' + forks[i];
      }
    }
  };
  
  local.status = function (status) {
    var index = names.indexOf(status.name) + 1,
      message = global.document.querySelector('#messages div:nth-child(' + index + ') .message'),
      plate = global.document.querySelector('#philosophers div:nth-child(' + index + ')');
    message.innerHTML = status.hunger + ' hunger, ' + status.state + 'ing';
    if (status.state === 'eat') {
      plate.classList.add('eating');
    } else {
      plate.classList.remove('eating');
    }
  };
  
  local.init();
}(this));
