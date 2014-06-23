'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute'])
  .controller('BaseCtrl', ['$scope', 'cm', function ($scope, cm) {

    $scope.tabs = {
      'untitled 1': {
        name: 'untitled 1',
        isSaved: true
      }
    };

    $scope.actions = {
      newFile: function () {console.log('newfile')},
      setMode: cm.setMode,
      isMode: cm.isMode
    };
  }]);
