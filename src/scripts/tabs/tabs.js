angular
.module('Horn')
.directive('tabs', function () {
  return {
    restrict: 'E',
    templateUrl: 'scripts/tabs/tabs.html',
    scope: {
      tabs: '=items',
      current: '=',
      changeTab: '=',
      closeTab: '=',
      editTab: '='
    },
    link: function (scope) {
      scope.isCurrent = function (obj) {
        return scope.current && scope.current.cfs === obj.cfs;
      }
    }
  }
});
