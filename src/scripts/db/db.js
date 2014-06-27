'use strict';

angular
.module('Horn')
.factory('db', ['$q', 'cfs', function ($q, cfs) {
  /**
   * @private
   * @return {Promise<TAFFY>} - database
   */
  function getDb () {
    console.log(cfs);
    var deferred = $q.defer(),
        promise = cfs.get('db.json', true);
    promise.then(function (dbFile) {
      var db = JSON.parse(dbFile.body);
      deferred.resolve(db);
    });

    return deferred.promise;
  };

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
      cfs.set('db.json', db.toJSON());
    });
  };

  /**
   * @public
   * Create a new file in cfs and in the database
   * @return {Promise<DbFile>} - created DbFile
   */
  function create (name) {
    var deferred = $q.defer();
    cfs.get().then(function (file) {
      var dbFile = {
        name: name || 'untilted',
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
  //TODO: Refactoring
  function update (tab) {
    var filter;
    if (tab.cfs)
      filter = {cfs: tab.cfs};
    else
      filter = {name: tab.name};

    get(filter).then(function (dbFile) {
      cfs.set(dbFile.cfs, tab.body);
    }, function () {
      create(tab.name).then(function(dbFile) {
        var name = null;
        if (dbFile.cfs)
          name = dbFile.cfs;
        cfs.set(name, tab.body);
      });
    });
  };

  return {
    create: create,
    update: update
  }

}]);
