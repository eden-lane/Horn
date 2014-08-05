angular
  .module('Horn')
  .directive('toolbar', function ($q, Editor) {

    function Controller ($scope) {

    }

    function link (scope, element, attrs) {

    }

    return {
      restrict: 'E',
      templateUrl: 'scripts/toolbar/toolbar.html',
      transclude: true,
      controller: Controller,
      link: link
    }
  });
