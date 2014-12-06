;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnHtml', hrnHtml);
  
  function hrnHtml () {
    return {
      restrict: 'E',
      require: '^editor',
      scope: {
        text: '='
      },
      templateUrl: 'scripts/editor/hrn-html.html',
      link: link
    }
    
    function link (scope, element, attrs, editorCtrl) {
      var cm, doc,
      options = {
        mode: 'htmlmixed',
        theme: 'kirin',
        tabSize: 2,
        lineWrapping: true,
        readOnly: true
      };

      init();
      
      function init() {
        var textarea = element.find('textarea')[0];
        cm = CodeMirror.fromTextArea(textarea, options);
        cm.setSize('100%', '95%');
      };
      
      scope.$watch(isHtmlMode, setVisibility);
      
      scope.$watch('withTemplate', setContent);
      
      /**
       * Check if current mode is HTML
       */
      function isHtmlMode () {
        return editorCtrl.isMode('html');
      }
      
      /**
       * Shows and hides directive
       */
      function setVisibility (isVisible) {
        if (isVisible) {
          element.css('display', 'block');
          setContent();
          cm.refresh();
        } else {
          element.css('display', 'none');
        }
      }

      /**
       * Change content of CodeMirror
       */
      function setContent () {
        var content;
        content = scope.text;
          
        cm.setValue(content);
      }
      
    }
  }
  
})(angular)
