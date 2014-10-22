/**
 * Module for working with local file system
 *
 */

;(function (angular) {
  'use strict';

  function Fs ($q) {

    var fs = chrome.fileSystem,
        settings = {
      type: 'openWritableFile',
      accepts: [
        { extensions: ['md'] },
        { extensions: ['txt'] }
      ]
    };


    /**
     * Read file content from file entry
     *
     * @param {FileEntry}
     * @return {Promise<String>} - text content of fileEntry
     */
    function readFileEntry (fileEntry) {
      var defer = $q.defer();
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          defer.resolve(e.target.result);
        };

        reader.readAsText(file);
      });
      return defer.promise;
    }

    /**
     * Start a dialog for opening file from
     * local file system
     */
    function open () {
      var defer = $q.defer();
      fs.chooseEntry(settings, function (fileEntry) {
         readFileEntry(fileEntry).then(function (text) {

           fs.getDisplayPath(fileEntry, function (path) {
             var data = {
               text: text,
               fileEntry: fileEntry,
               path: path,
               name: fileEntry.name
             };

             defer.resolve(data);
           });
         });
      });

      return defer.promise;
    }


    /**
     * Save file content of the given FileEntry
     * @param {FileEntry} - entry that will be overwritten
     * @param {String} - new text of file
     */
    function save (fileEntry, text) {
      var defer = $q.defer();
      var getWritableEntry = fs.getWritableEntry;
      getWritableEntry(fileEntry, function (writableFileEntry) {
        writableFileEntry.createWriter(function (writer) {
          fileEntry.file(function (file) {
            var blob = new Blob([text], {type: 'text/plain'});
            writer.write(blob);
            defer.resolve();
          })
        })
      })

      return defer.promise;
    }

    return {
      open: open,
      save: save
    }
  }

  angular
    .module('Horn')
    .factory('Fs', Fs);

})(angular);
