'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute'])
  .controller('BaseCtrl', ['$scope', 'cm', 'db', function ($scope, cm, db) {
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
      },
      saveFile: function () {
        var current = $scope.current;

        current.body = cm.getText();
        db.update(current.name, current);
      },
      setMode: cm.setMode,
      isMode: cm.isMode
    };
  }]);
