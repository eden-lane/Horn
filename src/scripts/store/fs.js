/**
 * Module for working with local file system
 *
 */

;(function (angular) {
  'use strict';

  function Fs ($q) {

    var settings = {
      type: 'openWritableFile',
      accepts: [
        {
          extensions: ['md']
        },
        {
          extensions: ['txt']
        }
      ]
    },
        fs = chrome.fileSystem;


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
               path: path,
               name: fileEntry.name
             };

             defer.resolve(data);
           });
         });
      });

      return defer.promise;
    }

    return {
      open: open
    }
  }

  angular
    .module('Horn')
    .factory('Fs', Fs);

})(angular);
