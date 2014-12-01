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
    
    function link (scope, element, attrs, editorCtrl) {
      
      var cm,
          options = {
            mode: 'gfm',
            theme: 'kirin',
            tabSize: 4,
            lineWrapping: true
          };
      
      init();
      
      /**
       * CodeMirror's initialization
       */
      function init () {
        var textarea = element.find('textarea')[0];
        window.cm = cm = CodeMirror.fromTextArea(textarea, options);
        cm.setSize('100%', '100%');
      }
      
      scope.$watch(isMdMode, setVisibility);

      scope.$watch('doc', function (newValue, oldValue) {
        if (newValue != oldValue) {
          cm.swapDoc(newValue);
        }
      })

      /**
       * Check if current mode is MD
       */
      function isMdMode () {
        return editorCtrl.isMode('md');
      }

      /**
       * Shows and hides directive
       */
      function setVisibility (isVisible) {
        if (isVisible) {
          element.css('display', 'block');
          cm.refresh();
        } else {
          element.css('display', 'none');
        }
      }


    }
  }
  
})(angular)
