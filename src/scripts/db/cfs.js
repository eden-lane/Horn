'use strict';

/**
 * Chrome File System service
 */
angular
.module('Horn')
.factory('cfs', ['$q', function ($q) {

  /**
   * @private
   * @return {Promise<FileEntry>}
   */
  function getFileEntry (name, createIfNotExists) {
    var deferred = $q.defer();

    if (!name)
      throw "name of FileEntry cannot be undefined";

    createIfNotExists = createIfNotExists || true;
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
    var deferred = $q.defer();

    name = name || getNewFileName();

    getFileEntry(name, createIfNotExists)
      .then(function (fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var file = {
              name: name,
              body: e.target.result
            };

            deferred.resolve(file);
          };

          reader.readAsText(file);
        });
      });

    return deferred.promise;
  };

  /**
   * Set the new content of file
   */
  function set(name, body) {
    getFileEntry(name)
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
  };

  /**
   * Generate uniq file name
   */
  function getNewFileName() {
    return +new Date + ".md";
  };

  function on(callback) {
    chrome.syncFileSystem.onFileStatusChanged.addListener(callback);
  };

  return {
    get: get,
    set: set,
    remove: remove,
    removeAll: removeAll,
    on: on
  }
}]);
