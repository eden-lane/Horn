'use strict';

angular
.module('Horn')
.factory('db', ['$q', 'cfs', function ($q, cfs) {
  /**
   * @private
   * @return {Promise<TAFFY>} - database
   */
  function getDb () {
    var deferred = $q.defer(),
        promise = cfs.getFile('db.json', true);
    promise.then(function (body) {
      var db = TAFFY(body)();
      deferred.resolve(db);
    });

    return deferred.promise;
  },

  function getAll () {

  },

  /**
   * @private
   * Insert file in the database and save
   */
  function insert(dbFile) {
    getDb().then(function (db) {
      db.insert(dbFile);
    });
  },

  /**
   * @public
   * Create a new file in cfs and in the database
   * @return {Promise<DbFile>} - created DbFile
   */
  function create () {
    var promise = cfs.get(),
        deferred = $q.defer();
    promise.then(function (file) {
      var dbFile = {
        name: 'untilted',
        files: {
          cfs: file.name
        }
      };
      insert(dbFile);
      deferred.resolve(dbFile);
    });

    return deferred.promise;
  };



  return {
    getAll: getAll,
    create: create
  }

}]);
