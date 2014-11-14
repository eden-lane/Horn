/**
 * Directive for controlling tabs
 */
;(function () {
  angular
    .module('Horn')
    .directive('tabs', function () {

      function Controller ($rootScope, $scope, $q) {

        var vm = this;

        vm.set = function (id) {
          var tab = $scope.items[id];
          $scope.current = id;

          $scope.$emit('tabs:changed', {
            id: id,
            tab: tab
          });
        }

        /**
         * Check if tab is selected
         * @param {Number} id - number of tested tab
         */
        vm.isActive = function (id) {
          return id === $scope.current;
        }

        /**
         * Closing
         */
        vm.close = function (id) {
          var defer = $q.defer();
          $scope.$emit('tabs:closing', id, defer);

          defer.promise.then(function () {
            $scope.items.splice(id, 1);
            $scope.$emit('tabs:closed');
          });
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
    })
})();
