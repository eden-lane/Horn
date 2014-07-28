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

      scope.$watch(function () {return scope.current.id}, function () {
        scope.$emit('tabs:currentChanged', scope.current);
      });

      window.tdir = scope;
    }
  }
});
