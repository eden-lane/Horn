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
      scope.current = Tabs.current;
      scope.set = Tabs.set;

      window.tdir = scope;
    }
  }
});
