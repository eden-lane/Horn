;(function () {
  angular
  .module('Horn')
  .factory('Editor', function ($timeout) {
    return {
      cm: null,

      init: function (cm) {
        this.cm = cm;
      },

      setDoc: function (doc) {
        var cm = this.cm;
        $timeout(function () {
          cm.swapDoc(doc)
        }, 0);
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
