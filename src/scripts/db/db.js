'use strict';

angular
.module('Horn')
.factory('db', ['$q', 'cfs', function ($q, cfs) {


  var getDb = (function () {
    var database,
        deferred = $q.defer();
    window.db = database;
    function init () {
      cfs.on(function (fileInfo) {
        if (fileInfo.fileEntry.name == 'db.json') {
          console.log('db.json has been updated', fileInfo);
          fileInfo.fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              console.log(e.target.result);
              database = JSON.parse(e.target.result);
            };

            reader.readAsText(file);
          });
        };
      });

      cfs.get('db.json', true).then(function (dbFile) {
        if (!dbFile.body)
          database = [];
        else
          database = JSON.parse(dbFile.body);

        deferred.resolve(database);
      });
    };

    return function () {
      if (!database)
        init();
      else
        deferred.resolve(database);

      return deferred.promise;
    };

  })();

  /**
   * @private
   * Saves database to cfs
   */
  function saveDb (db) {
    if (typeof db == 'object')
      db = JSON.stringify(db);
    console.log('saveDb', db);
    cfs.set('db.json', db);
  };

  /**
   * @param {Object} filter - monogo-like filter
   * @return dbFile
   */
  function get (filter) {
    var deferred = $q.defer();
    getDb().then(function (db) {
      window.db = db;
      var dbFile = sift(filter, db);
      console.log('db:get:filter', filter);
      console.log('db:get:dbFile', dbFile);
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
  function insert(tab) {
    var dbFile = angular.copy(tab);

    delete dbFile.$$hashKey;
    delete dbFile.body;
    delete dbFile.isSaved;

    getDb().then(function (db) {
      db.push(dbFile);
      saveDb(db);
      update(tab);
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
      tab.cfs = file.name;
      insert(tab);
      deferred.resolve(tab);
    });

    return deferred.promise;
  };

  /**
   * Update an entry in the db and in the cfs
   */
  function update (tab) {
    if (!tab.cfs)
      throw 'This file doesn\'t exists in database';
    else
    return get({cfs: tab.cfs}).then(function (dbFile) {
      cfs.set(dbFile.cfs, tab.body);
    });
  };

  return {
    get: get,
    create: create,
    update: update
  }

}]);
