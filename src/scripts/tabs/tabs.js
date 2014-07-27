angular
.module('Horn')
.directive('tabs', function () {
  return {
    restrict: 'E',
    templateUrl: 'scripts/tabs/tabs.html',
    scope: {
    },
    controllerAs: 'tabs',
    link: function (scope) {
      scope.current = {
        doc: new CodeMirror.Doc('texttext')
      };

      console.log(scope.current);
      scope.isCurrent = function (obj) {
        return scope.current && scope.current.cfs === obj.cfs;
      }
    }
  }
});
