;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnPreview', hrnPreview);
  
  function hrnPreview ($sanitize) {
    return {
      restrict: 'E',
      require: '^editor',
      scope: {
        text: '='
      },
      templateUrl: 'scripts/editor/hrn-preview.html',
      link: link
    }
    
    function link (scope, element, attrs, editorCtrl) {
      
      scope.$watch(isPreviewMode, setVisibility);

      /**
       * Check if current mode is MD
       */
      function isPreviewMode () {
        return editorCtrl.isMode('preview');
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
