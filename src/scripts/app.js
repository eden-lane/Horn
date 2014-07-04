'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('BaseCtrl', ['$rootScope', '$scope', 'cm', 'db', 'settings', 'ngDialog', function ($rootScope, $scope, cm, db, settings, ngDialog) {

    $scope.tabs = [
    ];

    $scope.current = {};

    window.tabs = $scope.tabs;

    loadTabsFromSettings();

    /**
     * Saves current tabs to settings
     */
    function saveTabsToSettings () {
      if ($scope.tabs.length == 0)
        return;
      var result = [];
      for (var i = 0, max = $scope.tabs.length; i < max; i++) {
        var tab = $scope.tabs[i];
        result.push({cfs: tab.cfs});
      };
      settings.set('tabs', result);

      //TODO: Save every tab in cfs
    };

    function saveCurrentTabToSettings() {
      settings.set('current', {cfs: $scope.current.cfs});
    };

    function loadTabsFromSettings () {
      settings.get('tabs', function(it) {
        var tabs = it.tabs;
        settings.get('current', function (it) {
          var current = it.current;
          for (var i = 0, max = tabs.length; i < max; i++) {
            (function (i) {
              db.get(tabs[i], true).then(function (t) {
                $scope.tabs.push(t);
                if (t.cfs === current.cfs)
                  $scope.changeTab(i);
              });
            })(i);
          };

        })
      });
    };

    $scope.$watch('tabs.length', function () {
    }, true);

    /**
     * Setup for cm editor
     */
    cm.setup = function (cm) {
      cm.on('change', function () {
        $scope.current.isSaved = false;
      });
    };

    /**
     * Called when user switches tab
     * @param {Number} id - number of tab in array
     */
    $scope.changeTab = function (id) {
      if ($scope.current)
        $scope.current.body = cm.getText();
      $scope.current = $scope.tabs[id];
      cm.setText($scope.current.body || "");
      saveCurrentTabToSettings();
    };



    $scope.closeTab = function (id) {
      var tab = $scope.tabs[id];
      if (tab.isNew) {

      } else {

      }
    };


    $scope.renameTab = function (id) {
      ngDialog.open({
        template: 'templates/fileSettings.html',
        scope: $scope
      });
    };

    /**
     * Actions for the toolbar
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
          saveCurrentTabToSettings();
        });
      },



      /**
       * Save file to database and cfs
       */
      saveFile: function (isNamed) {
        var current = $scope.current;

        current.body = cm.getText();

        db.update(current).then(function () {
          delete current.isNew;
          current.isSaved = true;
          saveTabsToSettings();
        });
      },

      openFile: function (name) {
        var self = this;
        db.getDb().then(function (db) {
          self.scope = $scope.$new(true);
          self.scope.files = db;
          ngDialog.open({
            template: 'templates/openFile.html',
            scope: self.scope
          });
        });
      },

      setMode: cm.setMode,

      isMode: cm.isMode
    };

  }]);

