/**
 * Service for CodeMirror
 */
.factory('cm', function () {

  var cm,
      mode = 'md',
      renderedText;

  var obj = {};
  obj.init = function (textarea) {
    var self = this;
    cm = CodeMirror.fromTextArea(textarea, {
      mode: 'gfm',
      theme: 'kirin',
      tabSize: 2,
      lineWrapping: true
    });

    cm.setSize('100%', '80%');

    if (angular.isFunction(obj.setup))
      obj.setup(cm);
  };

  obj.render = function () {
    renderedText = marked(cm.getValue());
  };

  obj.isMode = function (name) {
    return mode === name;
  };

  obj.setMode = function (name) {
    mode = name;
    obj.render();
  };

  obj.getText = function () {
    return cm.getValue();
  };

  obj.setText = function (text) {
    cm.setValue(text);
  };

  /**
   * Setup cm after init
   */
  obj.setup = null;

  return obj;
})
