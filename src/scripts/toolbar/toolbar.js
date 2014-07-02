/**
 * @name Toolbar
 * @description
 * This directive needs an `actions` object with callbacks
 * for main toolbars function:
 *
 * - newFile
 * - openFile
 *
 * - setView('markdown'|'preview'|'html')
 * - isMode(name)
 */
angular
  .module('Horn')
  .directive('toolbar', [function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/toolbar/toolbar.html',
      scope: {
        actions: '='
      },

      controller: function ($scope) {


      },
      link: function (scope) {
        if (!scope.actions)
          throw 'Toolbar needs an `actions` object with callbacks for functions';

        scope.newFile = scope.actions.newFile;
        scope.openFile = scope.actions.openFile ;
        scope.saveFile = scope.actions.saveFile ;

        scope.setMode = scope.actions.setMode;
        scope.isMode = scope.actions.isMode;
      }
    }
  }]);
