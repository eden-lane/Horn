;(function () {
  angular
  .module('Horn')
  .factory('Editor', function () {
    return {
      cm: null,

      init: function (cm) {
        this.cm = cm;
      },

      set: function (doc) {
        this.cm.swapDoc(doc);
      }
    };
  });
})();
