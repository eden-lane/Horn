.factory('core', [function () {
  var mode = 'markdown',
      switchingTabs = false,
      tabs = [
        {
          name: "untitled 1",
          isSaved: true
        }
      ],
      current = tabs[0],
      cm;

  return {
    renderedText: '',
    tabs: tabs,
    init: function (textarea) {
      var self = this;

      cm = CodeMirror.fromTextArea(textarea, {
        mode: 'gfm',
        theme: 'kirin',
        tabSize: 2,
        lineWrapping: true
      });

      cm.setSize('100%', '80%');

      cm.on('change', function (instance, changes) {
        current.body = instance.getValue();
        if (!switchingTabs) {
          current.isSaved = false;
          $rootScope.$apply();
        } else {
          switchingTabs = false;
        }
      });
  },

  setMode: function (name) {
    mode = name;
    if (name != 'markdown')
      this.render();
  },

  setTab: function (number) {
    current = tabs[number];
    switchingTabs = true;
    cm.setValue(current.body || "");
  },

  isMode: function (name) {
    return mode === name;
  },

  render: function () {
    this.renderedText = marked(cm.getValue());
  },
}]);
