'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute'])
  .controller('BaseCtrl', ['$scope', 'cm', 'db', 'settings', function ($scope, cm, db, settings) {
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

    /**
     * @return array of tabs without unnecessary information
     * for storing it in settings
     */
    function getCompactTabs () {
      var result = [];
      for (var i = 0, max = $scope.tabs.length; i < max; i++) {
        var tab = $scope.tabs[i],
            clone = {};
        if (tab.cfs)
          clone.cfs = tab.cfs;
        else
          clone.name = tab.name;

        result.push(clone);
      };

      return result;
    };

    $scope.current = $scope.tabs[0];
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
      newFile: function () {
        $scope.tabs.push({
          name: 'untitled',
          isSaved: false
        });
        $scope.current = $scope.tabs[$scope.tabs.length - 1];
        settings.set('tabs', getCompactTabs());
      },
      saveFile: function () {
        var current = $scope.current;

        current.body = cm.getText();
        db.update(current);

      },
      setMode: cm.setMode,
      isMode: cm.isMode
    };
  }]);
