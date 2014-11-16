;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnHtml', hrnHtml);
  
  function hrnHtml () {
    return {
      restrict: 'E',
      scope: {
        text: '='
      },
      require: '^editor',
      templateUrl: 'scripts/editor/hrn-html.html',
      link: link
    }
    
    function link (scope, element, attrs, editor) {
      
      var cm, doc,
      options = {
        mode: 'gfm',
        theme: 'kirin',
        tabSize: 4,
        lineWrapping: true,
        readOnly: true
      };

      
      init();
      
      /**
       * CodeMirror's initialization
       */
      function init () {
        var textarea = element.find('textarea')[0];
        cm = CodeMirror.fromTextArea(textarea, options);
        cm.setSize('100%', '100%');
        doc = new CodeMirror.Doc('', 'gfm');
        cm.swapDoc(doc);
      }
      
      scope.$watch('text', function (newValue, oldValue) {
        doc.setValue(newValue);
      })
    }
  }
  
})(angular)
