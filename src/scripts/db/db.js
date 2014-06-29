'use strict';

angular
.module('Horn')
.factory('db', ['$q', 'cfs', function ($q, cfs) {

  /**
   * @private
   * @return {Array<Object>} - database
   */
  function getDb () {
    var deferred = $q.defer(),
        promise = cfs.get('db.json', true);
    promise.then(function (dbFile) {
      var db;
      if (!dbFile.body)
        db = [];
      else
        db = JSON.parse(dbFile.body);
      deferred.resolve(db);
    });

    return deferred.promise;
  };

  /**
   * @private
   * Saves database to cfs
   */
  function saveDb (db) {
    if (typeof db == 'object')
      db = JSON.stringify(db);
    cfs.set('db.json', db);
  };

  /**
   * @param {Object} filter - monogo-like filter
   * @return dbFile
   */
  function get (filter) {
    var deferred = $q.defer();
    getDb().then(function (db) {
      var dbFile = sift(filter, db);
      if (dbFile && dbFile.length)
        deferred.resolve(dbFile[0]);
      else
        deferred.reject();
    });

    return deferred.promise;
  }

  /**
   * @private
   * Insert file in the database and save
   */
  function insert(dbFile) {
    getDb().then(function (db) {
      db.push(dbFile);
      saveDb(db);
    });
  };

  /**
   * @public
   * Create a new file in cfs and in the database
   * @return {Promise<DbFile>} - created DbFile
   */
  function create (tab) {
    if (!tab.name)
      throw 'File must have a name';

    var deferred = $q.defer();
    cfs.get().then(function (file) {
      var dbFile = {
        name: tab.name,
        cfs: file.name
      };
      insert(dbFile);
      deferred.resolve(dbFile);
    });

    return deferred.promise;
  };

  /**
   * Update an entry in the db and in the cfs
   */
  function update (tab) {
    //TODO: Refactoring
    if (!tab.cfs)
      throw 'This file doesn\'t exists in database';
    else
    get(filter).then(function (dbFile) {
      cfs.set(dbFile.cfs, tab.body);
    });
  };

  return {
    create: create,
    update: update
  }

}]);
