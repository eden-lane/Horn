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
    }

    function link (scope, element, attributes) {
      var textarea = element.find('textarea')[0],
          // it's div.preview
          preview = element.find('div')[2];
      
      var md = new Remarkable({
        html: true,
        breaks: false,
        linkify: true
      });

      scope.renderedText = '<i>text</i>';

      scope.isMode = function (mode) {
        return scope.mode === mode;
      }
      
      scope.$watch('mode', function (newValue, oldValue) {
        if (newValue != 'md')
          scope.renderedText = md.render(scope.doc.getValue());
      })
      
      scope.$watch('doc', function (newDoc) {
        scope.$broadcast('editor:switched', newDoc);
      })
      
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
  })
})();
