angular
.module('Horn')
.directive('tabs', function () {
  return {
    restrict: 'E',
    templateUrl: 'scripts/tabs/tabs.html',
    scope: {
      tabs: '=items',
      current: '=',
      onChangeTab: '='
    },
    link: function (scope) {
      scope.setTab = function (id) {
        console.log(scope);
        scope.onChangeTab(id);
      };

      scope.isCurrent = function (obj) {
        return scope.current.name === obj.name;
      }
    }
  }
});
