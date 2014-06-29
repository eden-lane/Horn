'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('BaseCtrl', ['$scope', 'cm', 'db', 'settings', 'ngDialog', function ($scope, cm, db, settings, ngDialog) {

    $scope.tabs = [
      {
        name: 'Watch Dogs',
        isSaved: true
      },
      {
        name: 'untitled 1',
        isSaved: false
      }
    ];

    $scope.current = $scope.tabs[0];
    $scope.text = "name it !";

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

    chrome.storage.sync.get('tabs', function (obj) {
      console.log(obj.tabs);
    });

    /**
     * Called when user switches tab
     * @param {Number} id - number of tab in array
     */
    $scope.onChangeTab = function (id) {
      $scope.current.body = cm.getText();
      $scope.current = $scope.tabs[id];
      cm.setText($scope.current.body || "");
    };

    /**
     * Actions for the toolbar
     */
    $scope.actions = {
      /**
       * Creates a new tab
       */
      newFile: function () {
        $scope.tabs.push({
          name: 'untitled',
          isSaved: false
        });
        $scope.current = $scope.tabs[$scope.tabs.length - 1];
      },

      /**
       * Save file to database and cfs
       */
      saveFile: function () {
        var dialog = ngDialog.open({
          template: 'templates/newfile.html',
          scope: $scope
        });
        window.s = $scope;
        window.x = dialog;
        return;
        var current = $scope.current;
        current.body = cm.getText();

        if (current.cfs)
          db.update(current);
        else {

          db.create(current);
        };
      },
      setMode: cm.setMode,
      isMode: cm.isMode
    };

  }]);

