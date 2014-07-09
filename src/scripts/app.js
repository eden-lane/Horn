'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('BaseCtrl', ['$rootScope', '$scope', 'cm', 'db', 'settings', 'ngDialog', function ($rootScope, $scope, cm, db, settings, ngDialog) {

    var changingTabs = false;

    $scope.tabs = [
    ];

    $scope.closingTab;

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
                t.isSaved = true;
                $scope.tabs.push(t);
                if (t.cfs === current.cfs)
                  $scope.changeTab(i);
              });
            })(i);
          };
        })
      });
    };

    /**
     * Setup for cm editor
     */
    cm.setup = function (cm) {
      cm.on('change', function () {
        if (!changingTabs)
          $scope.current.isSaved = false;
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
      changingTabs = false;
      saveCurrentTabToSettings();
    };

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
        //TODO: close
      }
    };


    $scope.editTab = function (saveToDb) {
      ngDialog.open({
        template: 'templates/fileSettings.html',
        scope: $scope
      });
      if (saveToDb) {
        var tab = $scope.current;
        db.update(tab.cfs, {name: tab.name, tags: tab.tags});
      }
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

        db.updateBody(current).then(function () {
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

