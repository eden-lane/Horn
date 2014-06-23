.directive('editorArea', ['cm', function (cm) {
  var mode = 'markdown';

  return {
    restrict: 'E',
    templateUrl: 'scripts/editor/editorArea.html',
    transclude: true,
    link: function (scope, element) {
      var textarea = element.find('textarea')[0];
      cm.init(textarea);
    },
    controller: function ($scope) {

      $scope.isMode = cm.isMode;
      $scope.setMode = cm.setMode;

    }
  }
}])
