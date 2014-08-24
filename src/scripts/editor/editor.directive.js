;(function () {
  angular
  .module('Horn')
  .directive('editor', function ($sanitize, $timeout, Editor) {

    function Controller ($scope) {
      var vm = this;

      vm.isMode = function (name) {
        return $scope.mode == name;
      }

      /**
       * Check current mode
       */
      vm.setMode = function (name) {
        $scope.mode = name || 'md';
      }

      /**
      * Creates a new document, swaps current document to
      * it and returns previous document
      * @param {String} text - text of new document
      * @return {CodeMirror.Doc} - previous document
      */
      vm.create = function (text) {
        var doc, oldDoc;
        text = text || '';
        doc = new CodeMirror.Doc(text, 'gfm');
        oldDoc = $scope.cm.swapDoc(doc);
        return doc;
      };

    }

    function link (scope, element, attributes) {
      var textarea = element.find('textarea')[0];
      scope.cm = CodeMirror.fromTextArea(textarea, {
        mode: 'gfm',
        theme: 'kirin',
        tabSize: 2,
        lineWrapping: true
      });

      scope.renderedText = '';

      Editor.init(scope.cm);

      Editor.on('rendered', function (text) {
        scope.renderedText = text;
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'scripts/editor/editor.html',
      transclude: true,
      link: link,
      scope: {
        mode: '='
      },
      controller: Controller,
      controllerAs: 'editor'
    }
  })
})();
