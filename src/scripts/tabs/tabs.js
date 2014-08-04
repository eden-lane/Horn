angular
.module('Horn')
.directive('tabs', function () {

  function Controller ($scope) {

    var tabs = $scope.items;

    this.set = function (id) {
      $scope.$emit('tabs:beforeChanged');
      $scope.current = id;
      $scope.$emit('tabs:changed', id);
    }

    this.isActive = function (id) {
      return id === $scope.current;
    }
  }

  return {
    restrict: 'E',
    scope: {
      items: '=',
      current: '='
    },
    templateUrl: 'scripts/tabs/tabs.html',
    controller: Controller,
    controllerAs: 'tabs'
  }
});
