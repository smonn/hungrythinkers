/*jslint indent: 2 */
(function (global) {
  'use strict';
  var file = 'philosopher.js',
    names = ['Mal', 'Kaylee', 'Wash', 'Jayne', 'River'],
    forks = ['', '', '', '', ''],
    emptyClassNames = ['top', 'right', 'bottom-right', 'bottom-left', 'left'],
    workers = [],
    current = null,
    updateForks,
    updateMessage,
    timer,
    post,
    handler,
    error,
    init;
  updateForks = function () {
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
  updateMessage = function (name, state, hunger) {
    //console.log(index, state);
    var index = names.indexOf(name) + 1,
      message = global.document.querySelector('#messages div:nth-child(' + index + ') .message');
    message.innerHTML = hunger + ' hunger, ' + state + 'ing';
  };
  init = function () {
    var i,
      right;
    for (i = 0; i < names.length; i += 1) {
      right = i - 1;
      if (right < 0) {
        right = names.length - 1;
      }
      workers.push(new global.Worker(file));
      workers[i].onmessage = handler;
      workers[i].onerror = error;
      workers[i].postMessage({ type: 'init', name: names[i], left: i, right: right });
    }
    current = 0;
    timer = global.setTimeout(post, 500);
  };
  post = function () {
    workers[current].postMessage({ type: 'tick', forks: forks });
    current += 1;
    if (current >= workers.length) {
      current = 0;
    }
    timer = global.setTimeout(post, 500);
  };
  error = function () {
    global.console.log('error', arguments);
  };
  handler = function (event) {
    if (event.data.type === 'dropped') {
      forks[event.data.index] = '';
      updateForks();
    } else if (event.data.type === 'picked') {
      forks[event.data.index] = event.data.name;
      updateForks();
    } else if (event.data.type === 'state') {
      updateMessage(event.data.name, event.data.state, event.data.hunger);
    }
  };
  init();
}(this));
