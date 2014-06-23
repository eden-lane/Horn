'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute'])
  .controller('BaseCtrl', ['$scope', 'cm', function ($scope, cm) {
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

    $scope.current = 'text';

    $scope.actions = {
      newFile: function () {console.log('newfile')},
      setMode: cm.setMode,
      isMode: cm.isMode
    };
  }]);
