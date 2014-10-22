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


    function getEntryData (fileEntry) {
      var defer = $q.defer();

      readFileEntry(fileEntry).then(function (text) {
        fs.getDisplayPath(fileEntry, function (path) {
          var data = {
            text: text,
            fileEntry: fileEntry,
            path: path,
            name: fileEntry.name,
            id: fs.retainEntry(fileEntry)
          };
          defer.resolve(data);
        });
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
        getEntryData(fileEntry).then(function (data) {
          defer.resolve(data);
        })
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
          var truncated = false;

          writer.onwriteend = function (e) {
            if (!truncated) {
              truncated = true;
              this.truncate(this.position);
            } else {
              defer.resolve();
            }
          }

          writer.onerror = function (e) {
            defer.reject(e);
          }

          fileEntry.file(function (file) {
            var blob = new Blob([text], {type: 'text/plain'});
            writer.write(blob);
          });
        })
      })

      return defer.promise;
    }


    function restore (id) {
      debugger;
      console.log('restore');
      var id = 'E170318E023F637D8AE99D8008A2E6A5:DEMO.md',
          defer = $q.defer();
      fs.restoreEntry(id, function (fileEntry) {
        getEntryData(fileEntry).then(function (data) {
          defer.resolve(data);
        })
      })

      return defer.promise;
    }

    return {
      open: open,
      save: save,
      restore: restore,
      getId: fs.retainEntry
    }
  }

  angular
    .module('Horn')
    .factory('Fs', Fs);

})(angular);