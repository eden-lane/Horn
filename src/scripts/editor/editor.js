;(function () {
  angular
  .module('Horn')
  .directive('editor', function ($sanitize, $timeout, Editor) {

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

    function Controller ($scope) {
      var vm = this;

      vm.isMode = function (name) {
        return $scope.mode == name;
      }

      vm.setMode = function (name) {
        $scope.mode = name;
      }
    }

    function link (scope, element, attributes) {

      scope.renderedText = '';
      
      var md = new Remarkable({
        html: true,
        breaks: false,
        linkify: true
      });

      scope.$watch('mode', render);
      scope.$watch('doc', render)

      function render () {
        if (scope.doc)
          scope.renderedText = md.render(scope.doc.getValue());
      }
      
      /**
       * Load images for preview
       */
      //TODO: Move to hrnPreview
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
  })
})();
