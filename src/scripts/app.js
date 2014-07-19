'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('BaseCtrl', ['$rootScope', '$scope', 'cm', 'db', 'settings', 'ngDialog', '$q', function ($rootScope, $scope, cm, db, settings, ngDialog, $q) {

    var changingTabs = false;

    $scope.tabs = [];
    $scope.current = {};
    $scope.closingTab;

    loadTabs();


    /**
     * Saves current tabs to settings
     */
    function saveTabs () {
      if ($scope.tabs.length == 0)
        return;
      var result = [];
      for (var i = 0, max = $scope.tabs.length; i < max; i++) {
        var tab = $scope.tabs[i];
        result.push({cfs: tab.cfs});
      };
      settings.set('tabs', result);
    };


    /**
     * Load last opened tabs
     */
    function loadTabs () {
      $scope.loader = true;
      settings.get('tabs', function(it) {
        var tabs = it.tabs,
            promises = [];
        if (!tabs.length)
          $scope.loader = false;

        for (var i = 0, max = tabs.length; i < max; i++) {
          var cfs = tabs[i].cfs;
          promises.push(openDocument(cfs));
        };

        $q.all(promises).finally(function () {
          loadCurrentTab();
          $scope.loader = false;
        })
      });
    };


    /**
     * Saves active tab to settings
     */
    function saveCurrentTab () {
      settings.set('current', {cfs: $scope.current.cfs});
    };


    /**
     * Load last active tab from settings
     */
    function loadCurrentTab () {
      settings.get('current', function (it) {
        var current = it.current;
        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
          var tab = $scope.tabs[i];
          if (tab.cfs == current.cfs) {
            $scope.$apply(function () {
              $scope.changeTab(i);
              $scope.loader = false;
            });
            return;
          }
        };
      });
    };

    /**
     * Open document by it's cfs
     */
    function openDocument (cfs) {
      return db.get({cfs: cfs}, true)
        .then(function (dbFile) {
          dbFile.isSaved = true;
          var l = $scope.tabs.push(dbFile);
          $scope.changeTab(l - 1);
        });
    };

    /**
     * Setup for cm editor
     */
    cm.setup = function (cm) {
      cm.on('change', function () {
        if (!changingTabs && $scope.current.isSaved)
          $scope.$apply(function () {
            $scope.current.isSaved = false;
          });
      });
    };

    /**
     * Called when user switches tab
     * @param {Number} number - number of tab in array
     */
    $scope.changeTab = function (number) {
      changingTabs = true;
      if ($scope.current)
        $scope.current.body = cm.getText();
      $scope.current = $scope.tabs[number];
      cm.setText($scope.current.body || "");
      $scope.actions.setMode($scope.current.mode || 'md');
      changingTabs = false;
      saveCurrentTab();
    };

    /**
     * Closes tab
     */
    $scope.closeTab = function (number, close) {
      var tab = $scope.tabs[number];
      // User agreed with deleting document
      if (tab.isNew && close) {
        db.remove(tab.cfs);
        $scope.tabs.splice(number,1);
        $scope.current = (number - 1 >= 0) ? $scope.tabs[number - 1] : $scope.tabs[0];
      } else
      // first atempt to close tab
      if (tab.isNew && !close) {
        $scope.closingTab = number;
        ngDialog.open({
          template: 'templates/prompt.html',
          scope: $scope
        });
      } else {
        $scope.tabs.splice(number,1);
        $scope.current = (number - 1 >= 0) ? $scope.tabs[number - 1] : $scope.tabs[0];
      }
    };


    $scope.editTab = function (saveToDb) {
      if (saveToDb) {
        var tab = $scope.current;
        db.update(tab.cfs, {name: tab.name, tags: tab.tags});
      } else {
        ngDialog.open({
          template: 'templates/fileSettings.html',
          scope: $scope
        });
      }
    };

    /**
     * Action commands for toolbars buttons
     */

    $scope.actions = {

      /**
       * Creates a new tab
       */
      newFile: function () {
        var l = $scope.tabs.push({
          name: 'untitled',
          isSaved: false,
          isNew: true
        });
        $scope.changeTab(l - 1);
        db.create($scope.current).then(function () {
          saveCurrentTab();
        });
      },


      /**
       * Save file to database and cfs
       */
      saveFile: function (isNamed) {
        var current = $scope.current;

        current.body = cm.getText();

        db.updateBody(current).then(function () {
          delete current.isNew;
          current.isSaved = true;
          saveTabs();
        });
      },


      /**
       * Open existing file from cfs
       */
      openFile: function (name) {
        var self = this;
        db.getDb().then(function (db) {
          self.scope = $scope.$new(true);
          self.scope.files = db;
          self.scope.openDocument = openDocument;
          ngDialog.open({
            template: 'templates/openFile.html',
            scope: self.scope
          });
        });
      },


      /**
       * Set current preview mode
       */
      setMode: function (name) {
        $scope.current.mode = name;
        db.update($scope.current.cfs, {mode: name});
        cm.setMode(name);
      },

      /**
       * Check currently active mode
       */
      isMode: cm.isMode
    };

  }]);
