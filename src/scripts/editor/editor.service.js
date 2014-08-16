;(function () {
  angular
  .module('Horn')
  .factory('Editor', function ($timeout) {

    var callbacks = {
      changed: [],
      rendered: []
    };

    return {
      cm: null,

      init: function (cm) {
        this.cm = cm;
      },

      render: function () {
        var cm = this.cm;
        $timeout(function () {
        var text = marked(cm.getValue());
          callbacks.rendered.forEach(function (f) {
            f(text);
          });
        })
      },

      setDoc: function (doc) {
        var cm = this.cm;
        $timeout(function () {
          cm.swapDoc(doc)
        }, 0);
      },

      createDoc: function (text) {
        text = text || '';
        console.log('create doc', text);
        return new CodeMirror.Doc(text, 'gfm')
      },

      on: function (event, callback) {
        callbacks[event].push(callback);
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
