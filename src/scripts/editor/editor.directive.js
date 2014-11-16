;(function () {
  angular
  .module('Horn')
  .directive('editor', function ($sanitize, $timeout, Editor) {

    function Controller ($scope) {
      var vm = this;
      
      $scope.$watch('doc', function (newDoc) {
        $scope.$broadcast('editor:switched', newDoc);
      })

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
      var textarea = element.find('textarea')[0],
          // it's div.preview
          preview = element.find('div')[2];
      /*scope.cm = CodeMirror.fromTextArea(textarea, {
        mode: 'gfm',
        theme: 'kirin',
        tabSize: 2,
        lineWrapping: true,
        extraKeys: scope.keys
      });*/

      scope.renderedText = '';

//      Editor.init(scope.cm);
      
      /**
       * Load images for preview
       */
      function loadImage (img) {
        if (typeof img.length != 'undefined') {
          [].forEach.call(img, loadImage);
          return;
        }
        
        var src = img.src,
            xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
          img.src = window.URL.createObjectURL(xhr.response);
        };
        xhr.open('GET', src, true);
        xhr.send(null);
      }

      /*Editor.on('rendered', function (text) {
        scope.renderedText = text;
        var imgs = preview.querySelectorAll('img');
        loadImage(imgs);
      });*/
    }

    return {
      restrict: 'E',
      templateUrl: 'scripts/editor/editor.html',
      transclude: true,
      link: link,
      scope: {
        mode: '=',
        keys: '=',
        doc: '='
      },
      controller: Controller,
      controllerAs: 'editor'
    }
  })
})();
