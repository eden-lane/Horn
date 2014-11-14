/**
 * @class Tab
 */

;(function (angular){
  angular
    .module('Horn')
    .factory('Tab', function (Editor, Fs) {
      /**
       * @constructor
       * @data {Object}
       */
      function Tab (data) {
        var data = data || {
          name: 'untitled',
          text: '',
          mode: 'md',
          isSaved: false
        };

        this.doc = Editor.createDoc(data.text)
        this.name = data.name || 'untitled';
        this.mode = data.mode || 'md';
        this.id = data.id;
        this.fileEntry = data.fileEntry;
        this.isSaved = !!data.fileEntry;
      }


      /**
       * Saves Tab content to local file
       */
      Tab.prototype.save = function () {
        var self = this,
            text = self.doc.getValue();

        if (!self.cfs) {
          Fs.save(self.fileEntry, text).then(function (fileEntry) {
            self.isSaved = true;
            self.fileEntry = fileEntry;
            self.name = fileEntry.name;
          });
        }
      }

      return Tab;

    });
})(angular)

