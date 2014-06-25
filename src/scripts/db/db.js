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
    promise.then(function (body) {
      var db = jdb(body);
      window.db = db;
      console.log(db);
      deferred.resolve(db);
    });

    return deferred.promise;
  };

  function saveDb (db) {
    cfs.set('db.json', db);
  };

  /**
   * @return dbFile
   */
  function get (id) {
    var deferred = $q.defer();
    getDb().then(function (db) {
      var dbFile = db.get({name: id});
      if (dbFile)
        deferred.resolve(dbFile);
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
      db.insert(dbFile);
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
      console.log(file);
      var dbFile = {
        name: name || 'untilted',
        files: {
          cfs: file.name
        }
      };
      insert(dbFile);
      deferred.resolve(dbFile);
    });

    return deferred.promise;
  };

  /**
   * Update an entry in the db and in the cfs
   */
  function update (id, tab) {
    get(id).then(function (dbFile) {
      cfs.set(dbFile.files && dbFile.files.cfs, tab.body);
    }, function () {
      create(id).then(function(dbFile) {
        cfs.set(dbFile.files.cfs, tab.body);
      });
    });
  };

  return {
    create: create,
    update: update
  }

}]);
