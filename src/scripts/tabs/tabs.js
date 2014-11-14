/**
 * Directive for controlling tabs
 */
;(function () {
  'use strict';

  angular
    .module('Horn')
    .directive('tabs', function () {

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

      function Controller ($rootScope, $scope, $q) {

        var vm = this;

        /**
         * Set tab as currently active
         * @event 'tabs:changed'
         */
        vm.set = function (id) {
          var tab,
              length = $scope.items.length;

          id = id >= length ? 0 : id;
          id = id < 0 ? length - 1 : id;

          tab = $scope.items[id];
          $scope.current = id;

          $scope.$emit('tabs:changed', {id: id, tab: tab});
        }


        /**
         * Check if tab is selected
         * @param {Number} id - number of tested tab
         */
        vm.isActive = function (id) {
          return id === $scope.current;
        }


        /**
         * Closes tab
         */
        vm.close = function (id) {
          var defer = $q.defer();
          $scope.$emit('tabs:closing', id, defer);

          defer.promise.then(function () {
            $scope.items.splice(id, 1);
            $scope.$emit('tabs:closed');
          });
        }

        /**
         * Watch for tabs count and if any tab is added,
         * set it as currently active tab
         */
        $scope.$watchCollection('items', function (newValue, oldValue) {
          var newLength = newValue.length,
              oldLength = oldValue.length;

          if (newLength > oldLength)
            vm.set(newLength - 1);
        });


        /**
         * Listen for changing tabs outside directive
         * args: {
         *  id - id of new tab
         * }
         */
        $scope.$on('tabs:change', function (ev, args) {
          vm.set(args.id);
        })

      }
    })
})();
