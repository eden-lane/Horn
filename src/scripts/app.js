'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('BaseCtrl', ['$rootScope', '$scope', 'cm', 'db', 'settings', 'ngDialog', function ($rootScope, $scope, cm, db, settings, ngDialog) {

    $scope.tabs = [
    ];

    $scope.current = $scope.tabs[0];

    /**
     * Saves current tabs to settings (if they are saved)
     */
    function saveTabsToSettings () {
      var result = [];
      for (var i = 0, max = $scope.tabs.length; i < max; i++) {
        var tab = $scope.tabs[i];
        if (tab.cfs)
          result.push({cfs: tab.cfs});
      };
      settings.set('tabs', result);

      //TODO: Save every tab in cfs
    };

    function loadTabsFromSettings () {
      settings.get('tabs', function(it) {
        for (var i = 0, max = it.tabs.length; i < max; i++) {
          //TODO: db.open;
        };
      });
    };

    $scope.$watch('tabs.length', function () {
      saveTabsToSettings();
    }, true);

    cm.setup = function (cm) {
      cm.on('change', function () {
        $scope.current.isSaved = false;
      });
    };

    /**
     * Called when user switches tab
     * @param {Number} id - number of tab in array
     */
    $scope.onChangeTab = function (id) {
      if ($scope.current)
        $scope.current.body = cm.getText();
      $scope.current = $scope.tabs[id];
      cm.setText($scope.current.body || "");
      settings.set('current', {cfs: $scope.current.cfs});
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
        $scope.onChangeTab(l - 1);
      },

      /**
       * Save file to database and cfs
       */
      saveFile: function (isNamed) {
        var current = $scope.current;

        if (isNamed)
          delete current.isNew;

        if (current.isNew) {
          ngDialog.open({
            template: 'templates/newfile.html',
            scope: $scope
          });
          return;
        }

        current.body = cm.getText();

        if (current.cfs)
          db.update(current);
        else
          db.create(current);

        current.isSaved = true;
      },
      setMode: cm.setMode,
      isMode: cm.isMode
    };

  }]);

