'use strict';

/**
 * Chrome File System service
 */
angular
.module('Horn')
.factory('cfs', ['$q', function ($q) {

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
    createIfNotExists = createIfNotExists || true;

    chrome.syncFileSystem.requestFileSystem(function (fs) {
      fs.root.getFile(name, {create: createIfNotExists}, function (fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var file = {
              name: name,
              body: this
            };

            deferred.resolve(file);
          };

          reader.readAsText(file);
        });
      });
    });

    return deferred.promise;
  };

  /**
   * Generate uniq file name
   */
  function getNewFileName() {
    return +new Date + ".md";
  };

  return {
    get: get
  }
}]);
