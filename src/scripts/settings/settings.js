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

  return {
    set: set
  }

}]);
