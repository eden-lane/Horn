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

    db.getAll();

    /**
     * Called when user switches tab
     * @param {Number} id - number of tab in array
     */
    $scope.onChangeTab = function (id) {
      $scope.current.text = cm.getText();
      $scope.current = $scope.tabs[id];
      cm.setText($scope.current.text || "");
    };

    $scope.actions = {
      newFile: function () {console.log('newfile')},
      setMode: cm.setMode,
      isMode: cm.isMode
    };
  }]);
