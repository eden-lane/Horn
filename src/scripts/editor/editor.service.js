;(function () {
  angular
  .module('Horn')
  .factory('Editor', function () {
    return {
      cm: null,

      init: function (cm) {
        this.cm = cm;
      },

      setDoc: function (doc) {
        this.cm.swapDoc(doc);
      },

      getDoc: function () {
        return this.cm.getDoc();
      },

      getText: function () {
        return this.cm.getValue();
      },
    };
  });
})();
