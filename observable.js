/*jslint indent: 2 */
(function (global) {
  'use strict';
  global.observable = function (that) {
    var listeners = [];

    that.observe = function (observer) {
      listeners.push(observer);
    };

    that.notify = function () {
      var i;
      for (i = 0; i < listeners.length; i += 1) {
        listeners[i](that);
      }
    };

    return that;
  };
}(this));
