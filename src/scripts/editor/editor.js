;(function () {
  angular
  .module('Horn')
  .directive('editor', ['$sanitize', function ($sanitize) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/editor/editor.html',
      transclude: true,
      controllerAs: 'editor',
      link: function (scope, element) {
        var textarea = element.find('textarea')[0];
        scope.cm = CodeMirror.fromTextArea(textarea, {
          mode: 'gfm',
          theme: 'kirin',
          tabSize: 2,
          lineWrapping: true
        });
      },
      controller: function ($scope) {
        $scope.mode = 'md';

        window.editor = $scope;

        $scope.renderedText;

        /**
         * Check current editors's mode
         * @return {Boolean}
         */
        this.isMode = function (name) {
          return $scope.mode == name;
        };

        /**
         * Set up current editor's mode
         * @param {String} name - md|preview|html
         */
        this.setMode = function (name) {
          $scope.mode = name;
          $scope.renderedText = marked($scope.cm.getValue());
        };

        /**
         * Creates a new document, swaps current document to
         * it and returns previous document
         * @param {String} text - text of new document
         * @return {CodeMirror.Doc} - previous document
         */
        this.create = function (text) {
          var doc, oldDoc;
          text = text || '';
          doc = new CodeMirror.Doc(text, 'gfm');
          oldDoc = $scope.cm.swapDoc(doc);
          return oldDoc;
        };

      }
    }
  }])
})();
