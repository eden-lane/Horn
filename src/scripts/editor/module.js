'use strict';

angular.module('Horn')
/**
 * Service for CodeMirror
 */
.factory('cm', function () {

  var cm,
      mode = 'md',
      renderedText;

  var obj = {};
  obj.init = function (textarea) {
    var self = this;

    cm = CodeMirror.fromTextArea(textarea, {
      mode: 'gfm',
      theme: 'kirin',
      tabSize: 2,
      lineWrapping: true
    });

    cm.setSize('100%', '80%');
/*
    cm.on('change', function (instance, changes) {
      current.body = instance.getValue();
      if (!switchingTabs) {
        current.isSaved = false;
        $rootScope.$apply();
      } else {
        switchingTabs = false;
      }
    });
*/
  },

  obj.on = this.cm,

  obj.render = function () {
    renderedText = marked(this.cm.getValue());
  },

  obj.isMode = function (name) {
    return mode === name;
  },

  obj.setMode = function (name) {
    mode = name;
    obj.render();
  };

  return obj;
})

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
