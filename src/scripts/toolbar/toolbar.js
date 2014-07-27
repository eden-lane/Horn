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
  .directive('toolbar', function ($q) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/toolbar/toolbar.html',
      require: '^editor',
      scope: {
        actions: '='
      },
      link: function (scope, element, attrs, editor) {
        console.log('toolbar,scope', scope);
        var actions = scope.actions || {};

        scope.isMode = editor.isMode;
        scope.setMode = editor.setMode;

        window.toolbar = editor;

        /**
         * Creates a new file in editor and
         * calls actions.newFile(doc) where
         * doc {CodeMirror.Doc} - previous file
         */
        scope.newFile = function () {
          var doc = editor.create();
          if (angular.isFunction(actions.newFile))
            actions.newFile(doc);
        };

        /**
         * Calls actions.openFile(defer) where
         * defer is Deffered object which should
         * be resolved with text of opened file
         */
        scope.openFile = function () {
          if (!angular.isFunction(actions.openFile))
            return;

          var defer = $q.defer();
          defer.promise.then(function (text) {
            editor.create(text);
          });
          actions.openFile(defer);
        };
       /* scope.newFile = scope.actions.newFile;
        scope.openFile = scope.actions.openFile ;
        scope.saveFile = scope.actions.saveFile ;

        scope.setMode = scope.actions.setMode;
        scope.isMode = scope.actions.isMode;*/
      }
    }
  });
