/**
 * Service for working with chrome
 * sync settings API
 */
;(function (angular, chrome) {
  'use strict';

  function Settings () {

    /**
     * Saves item to storage
     * @param {String} name
     * @param {~} value
     * @param {Function} callback
     */
    function set(name, value, callback) {
      var item = {};
      item[name] = value;

      if (typeof callback != 'function')
        callback = null;

      chrome.storage.sync.set(item, callback);
    };

    /**
     * Loads item from storage
     * @param {String} name
     * @param {Function} callback
     */
    function get(name, callback) {
      chrome.storage.sync.get(name, callback);
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
