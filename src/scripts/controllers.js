'use strict';

(function () {
  var app = angular.module("Horn.controllers", ["Horn.services", 'ngSanitize']);

  app.controller('HornController', ['$scope', 'editor', function ($scope, editor) {
    var current = { title: 'example', value: ''};
  }]);

  /*
   * Toolbar Tab Directive
   */

  app.directive('toolbar', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/toolbar.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;
      },
      scope: {
      },
      transclude: true,
      controller: function ($scope) {
        $scope.saveFile = function () {

        }
      }
    };
  }]);

  /*
   * Current Tab Directive
   */

  app.directive('tab', [function () {
    return {
      restrict: 'E',
      templateUrl: 'partial/tab.html',
      transclude: true,
      link: function ($scope, element, attrs) {

      }
    };
  }]);


  app.directive('viewModes', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/viewModes.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;
      },
      controller: function () {

      }
    };
  }]);

  /*
   * Views modes
   */

  app.directive('codemirror', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/codemirror.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;

        var textarea = element[0].getElementsByTagName('textarea')[0];
        editor.init(textarea);
      },
      controller: function () {

      }
    }
  }]);

  app.directive('hrnPreview', ['editor', function (editor) {
    return {
      restrict: 'A',
      templateUrl: 'partial/preview.html',
      link: function ($scope, element, attrs) {
        //$scope.html = editor.renderedText;
      }
    };
  }])

})();
