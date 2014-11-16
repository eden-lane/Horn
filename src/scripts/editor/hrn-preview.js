;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnPreview', hrnPreview);
  
  function hrnPreview ($sanitize) {
    return {
      restrict: 'E',
      scope: {
        text: '='
      },
      templateUrl: 'scripts/editor/hrn-preview.html',
      link: link
    }
    
    function link (scope, element, attrs) {
      
    }
  }
  
})(angular)