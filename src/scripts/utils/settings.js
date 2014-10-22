/**
 * Service for working with chrome
 * sync settings API
 */
;(function (angular, chrome) {
  'use strict';

  function Settings () {

    /**
     * Saves item to storage
     *
     * @param {String} name
     * @param {~} value
     * @param {Boolean} isLocalScope (optional)
     * @param {Function} callback
     */
    function set (name, value, isLocalScope, callback) {
      var item = {},
          scope = 'sync';
      item[name] = value;

      if (typeof isLocalScope == 'function') {
        callback = isLocalScope;
      } else if (isLocalScope) {
        scope = 'local';
      }

      if (typeof callback != 'function')
        callback = null;

      chrome.storage[scope].set(item, callback);
    };


    /**
     * Loads item from storage
     *
     * @param {String} name
     * @param {Boolean} isLocalScope (optional)
     * @param {Function} callback
     */
    function get (name, isLocalScope, callback) {
      var scope = 'sync';

      if (typeof isLocalScope == 'function') {
        callback = isLocalScope;
      } else if (isLocalScope) {
        scope = 'local';
      }

      chrome.storage[scope].get(name, callback);
    };

    return {
      set: set,
      get: get
    }

  }

  angular
  .module('Horn')
  .factory('Settings', Settings);

})(angular, chrome);
