angular
.module('Horn')
.directive('tabs', function (Tabs) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/tabs/tabs.html',
    scope: {
    },
    link: function (scope) {
      scope.tabs = Tabs.tabs;

      scope.isCurrent = function (obj) {
        return (Tabs.current && Tabs.current.cfs === obj.cfs);
      }

      scope.set = Tabs.set;
    }
  }
});
