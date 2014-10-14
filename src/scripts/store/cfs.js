;(function (angular) {
  'use strict';

  function Cfs ($q) {
    /**
     * @private
     * @return {Promise<FileEntry>}
     */
    function getFileEntry (name, createIfNotExists) {
      var deferred = $q.defer();
      if (!name)
        throw "name can't be empty";

      createIfNotExists = createIfNotExists == false ? false : true;
      chrome.syncFileSystem.requestFileSystem(function (fs) {
        fs.root.getFile(name, {create: createIfNotExists}, function (fileEntry) {
          deferred.resolve(fileEntry);
        });
      });

      return deferred.promise;
    };

    /**
     * Getting or creating file
     * @return {Promise<File>} -
     *
     * file = {
     *  name: 'some name.md',
     *  body: 'Content of file...'
     * }
     */
    function get (name, createIfNotExists) {
      var defer = $q.defer();
      name = name || getNewFileName();

      getFileEntry(name, createIfNotExists)
        .then(readFileEntry)
        .then(function (text) {
          var file = {
            name: name,
            body: text
          };

          defer.resolve(file);
        });

      return defer.promise;
    };

    /**
     * Set the new content of file
     */
    function set(name, body) {
      return getFileEntry(name)
        .then(function (fileEntry) {
          fileEntry.createWriter(function (fileWriter) {
            var truncated = false;
            fileWriter.onwriteend = function (e) {
              if (!truncated) {
                truncated = true;
                this.truncate(this.position);
              };
            };

            var blob = new Blob([body]);
            fileWriter.write(blob);
          });
        });
    };

    /**
     * Remove file from cfs
     */
    function remove(name) {
      var deferred = $q.defer();
      getFileEntry(name)
        .then(function (fileEntry) {
          fileEntry.remove(function () {
            deferred.resolve();
          });
        });

      return deferred.promise;
    };

    /**
     * Remove all
     */
    function removeAll() {
      chrome.syncFileSystem.requestFileSystem(function (fs) {
        var reader = fs.root.createReader();
        reader.readEntries(function (files) {
          for (var i = 0, l = files.length; i < l; i++) {
            remove(files[i].name);
          }
        });
      });
      chrome.storage.sync.clear();
    };

    /**
     * Generate uniq file name
     */
    function getNewFileName() {
      return +new Date + ".md";
    };


    /**
     * Reads content of the file
     * @param <FileEntry> fileEntry
     *
     * @return {Promise<String>} - content of the file
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

    function on(callback) {
      chrome.syncFileSystem.onFileStatusChanged.addListener(callback);
    };

    return {
      get: get,
      set: set,
      readFileEntry: readFileEntry,
      remove: remove,
      removeAll: removeAll,
      on: on
    }
  }

  angular
    .module('Horn')
    .factory('Cfs', Cfs);

})(angular);
