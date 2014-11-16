;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnMd', hrnMd);
  
  function hrnMd () {
    return {
      restrict: 'E',
      scope: {
        doc: '='
      },
      require: '^editor',
      templateUrl: 'scripts/editor/hrn-md.html',
      link: link
    }
    
    function link (scope, element, attrs, editor) {
      
      var cm;
      
      init();
      
      /**
       * CodeMirror's initialization
       */
      function init () {
        var textarea = element.find('textarea')[0];
        cm = CodeMirror.fromTextArea(textarea, {
          mode: 'gfm',
          theme: 'kirin',
          tabSize: 4,
          lineWrapping: true
        });
        cm.setSize('100%', '100%')
      }
      
      scope.$watch('doc', function (newValue, oldValue) {
        if (newValue != oldValue)
          cm.swapDoc(newValue);
      })
    }
  }
  
})(angular)