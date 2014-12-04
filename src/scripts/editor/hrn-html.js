;(function (angular) {
  'use strict';
  
  angular
    .module('Horn')
    .directive('hrnHtml', hrnHtml);
  
  function hrnHtml () {
    return {
      restrict: 'E',
      require: ['^editor'],
      templateUrl: 'scripts/editor/hrn-html.html',
      link: link
    }
    
    function link (scope, element, attrs, ctrls) {
      var cm, doc,
      options = {
        mode: 'gfm',
        theme: 'kirin',
        tabSize: 4,
        lineWrapping: true,
        readOnly: true
      };


      

    }
  }
  
})(angular)
