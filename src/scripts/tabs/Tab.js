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
    .factory('Tab', function (Fs) {

      var defaults = {
        name: 'untitled',
        text: '',
        mode: 'preview',
        isSaved: false,
        language: 'gfm'
      }

      /**
       * @constructor
       * @data {Object}
       */
      function Tab(data) {
        var params = angular.extend({}, defaults, data);

        this.doc = CodeMirror.Doc(params.text, params.language)
        this.name = params.name;
        this.mode = params.mode;
        this.id = params.id;
        this.fileEntry = params.fileEntry;
        this.isSaved = !!params.fileEntry;
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

