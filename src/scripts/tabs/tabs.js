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

      scope.setTab = function (id) {
        scope.changeTab(id);
      };

      scope.isCurrent = function (obj) {

        return scope.current.cfs === obj.cfs;
      }
    }
  }
});
