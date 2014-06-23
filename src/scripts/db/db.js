'use strict';

angular
.module('Horn')
.factory('db', function () {

  var obj = {},

      getDb = function () {
        var deferred = $q.defer();

        chrome.syncFileSystem.requestFileSystem(function (fs) {
          fs.root.getFile('db.json', {create: true}, function (fileEntry) {
            deferred.resolve(fileEntry);
          });
        });

        return deferred.promise;
      };

  obj.getAll = function() {

  }

});
