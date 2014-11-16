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

      md: null,

      init: function (cm) {
        this.cm = cm;
        cm.on('change', function (sender, args) {
          callbacks.changed.forEach(function (f) {
            f(sender, args);
          });
        });
        cm.setSize('100%', '100%');

        this.md = new Remarkable({
          html: true,
          breaks: false,
          linkify: true
        });
      },

      render: function () {
        var cm = this.cm,
            md = this.md;
        $timeout(function () {
//        var text = md.render(cm.getValue());
          callbacks.rendered.forEach(function (f) {
            f("");
          });
        });
      },

      setDoc: function (doc) {
        var cm = this.cm,
            self = this;
        $timeout(function () {
          //cm.swapDoc(doc);
          self.render();
        });

      },

      setValue: function (value) {
        this.cm.setValue(value || "");
      },

      createDoc: function (text) {
        text = text || '';
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
