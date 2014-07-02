'use strict';

angular.module('Horn')
.service('settings', [function () {

  function set(name, value, callback) {
    var item = {};
    item[name] = value;

    if (typeof callback != 'function')
      callback = null;

    chrome.storage.sync.set(item, callback);
  };

  function get(name, callback) {
    chrome.storage.sync.get(name, callback);
  };

  return {
    set: set,
    get: get
  }

}]);
