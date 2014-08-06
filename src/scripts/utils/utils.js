/**
 * Service for common App's tasks
 */
;(function (angular) {
  'use strict';

  function Utils ($q, Settings, Db) {

    /**
     * Saves currently opened tabs
     * to settings
     * @param {Array.<Object>} tabs
     */
    function saveTabs(tabs) {
      var result = [];

      for (var i = 0, l = tabs.length; i < l; i++) {
        var tab = tabs[i];
        if (!tab.cfs)
          continue;

        result.push({cfs: tab.cfs});
      }
      Settings.set('tabs', result)
    }


    /**
     * Loads saved tabs
     * @returns {Promise) - will be resolved
     * when all tabs are loaded
     */
    function loadTabs() {
      var promises = [];

      Settings.get('tabs', function (storage) {
        var tabs = storage.tabs;
        for (var i = 0, l = tabs.length; i < l; i++) {
          var cfs = tabs[i].cfs;
          promises.push(openDocument(cfs));
        }
      })

      return $q.all(promises);
    }

    /**
     * Saves currently active tab in chrome
     * sync storage
     * @param {Object} tab - tab to save
     */
    function saveCurrentTab(tab) {
      if (!tab.cfs)
        return;

      Settings.set('current', {cfs: tab.cfs});
    }

    /**
     * Loads current tab from chrome sync storage
     */
    function loadCurrentTab() {
      Settings.get('current', function (storage) {
        var current = storage.current;
      });
    }

    /*function openDocument (cfs) {
//      return db.get({cfs: cfs}, true)
//        .then(function (dbFile) {
//          console.log('dbFile', dbFile);
//          var dbFile = angular.copy(dbFile);
//          dbFile.isSaved = true;
//          //$scope.actions.newFile(
//        });
//    };*/

    function openDocument(cfs) {
       return Db.get({cfs: cfs}, true);
    }

    return {
      saveTabs: saveTabs,
      loadTabs: loadTabs,
      saveCurrentTab: saveCurrentTab,
      loadCurrentTab: loadCurrentTab
    }
  }

  angular
    .module('Horn')
    .factory('Utils', Utils);

})(angular);
