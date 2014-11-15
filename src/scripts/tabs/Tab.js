/**
 * @class Tab
 *
 * @description
 *
 * Class Tab used for storing important information about
 * tab's content
 *
 * @param {String} name - name of document
 *
 * @param {String} mode - Editor's mode, used last time
 *   tab has been active
 *
 * @param {CodeMirror.Doc} doc - CM's document assigned to this tab
 *
 * @param {String} id - chrome's id for document, opened from local
 *   machine. It will help to restore it after app's closing
 *
 * @param {FileEntry} fileEntry - link to FileEntry from local machine
 *
 * @param {Boolean} isSaved - changes to `false` every time CM content is
 *  changed. When Tab is created, it automaticly sets to `true`, if document
 *  has been loaded from local file system
 */

;(function (angular) {
  'use strict';

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

