'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute'])
  .controller('BaseCtrl', ['$scope', 'cm', function ($scope, cm) {
    $scope.actions = {
      newFile: function () {console.log('newfile')},
      setMode: cm.setMode,
      isMode: cm.isMode
    }
  }]);
