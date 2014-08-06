;(function (angular) {
  'use strict';

  function Db ($q, Cfs) {
     /**
     * @private
     * @return {Array<Object>} - database
     */
    var getDb = (function () {
      var database,
          deferred = $q.defer();

      function init () {
        Cfs.on(function (fileInfo) {
          if (fileInfo.fileEntry.name == 'db.json') {
            fileInfo.fileEntry.file(function (file) {
              var reader = new FileReader();
              reader.onloadend = function (e) {
                if (e.target.result)
                  database = JSON.parse(e.target.result);
                else
                  database = [];
              };

              reader.readAsText(file);
            });
          };
        });

        Cfs.get('db.json', true).then(function (dbFile) {
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
     * Saves database to Cfs
     */
    function saveDb (db) {
      if (typeof db == 'object')
        db = JSON.stringify(db);
      Cfs.set('db.json', db);
    };

    function clearTab(tab) {
      var result = angular.copy(tab);
      delete result.body;
      delete result.$$hashKey;
      delete result.isSaved;
      delete result.doc;

      return result;
    };

    /**
     * @param {Object} filter - monogo-like filter
     * @param {Boolean} withContent - if true returns contents
     *                                of the file from Cfs
     * @return dbFile
     */
    function get (filter, withContent) {
      var deferred = $q.defer();
      getDb()
        .then(function (db) {
          var dbFile = angular.copy(sift(filter, db)[0]);

          if (!dbFile) {
            deferred.reject();
          } else {
            if (withContent) {
              Cfs.get(dbFile.cfs, false).then(function (file) {
                dbFile.body = file.body;
                deferred.resolve(dbFile);
              });
            } else {
              deferred.resolve(dbFile);
            }
          }
        });

      return deferred.promise;
    }



    /**
     * @private
     * Insert file in the database and save
     */
    function insert(tab) {
      var dbFile,
          doc = tab.doc;

      delete tab.doc;

      dbFile = clearTab(tab);

      getDb()
        .then(function (db) {
          db.push(dbFile);
          saveDb(db);
          updateBody(tab);
          tab.doc = doc;
        });
    };



    /**
     * @public
     * Create a new file in Cfs and in the database
     * @return {Promise<DbFile>} - created DbFile
     */
    function create (tab) {
      var deferred = $q.defer();

      Cfs.get().then(function (file) {
        tab.cfs = file.name;
        insert(tab);
        deferred.resolve(tab);
      });

      return deferred.promise;
    };


    /**
     * Delete an entry from the db and file from the Cfs
     */
    function remove(id) {
      getDb().then(function (db) {
        db = db.filter(function (item) {
          return item.cfs !== id;
        });
        saveDb(db);
        Cfs.remove(id);
      });
    };

    function removeAll() {
      Cfs.removeAll();
    };

    /**
     * Update an entry in the db and in the cfs
     */
    function updateBody (tab) {
      if (!tab.cfs)
        throw 'This file doesn\'t exists in database';
      else
      return get({cfs: tab.cfs}).then(function (dbFile) {
        delete tab.isNew;
        Cfs.set(dbFile.cfs, tab.doc.getValue() || '');
      });
    };

    /**
     * Rename an entry in the database
     * @param {String} id - cfs name of document
     * @param {Object} params - new properties of item
     */
    function update (id, params) {
      if (!id)
        return;
      getDb().then(function (db) {
        var item = sift({cfs: id}, db)[0];
        params = clearTab(params);
        angular.extend(item, params);
        saveDb(db);
      });
    };

    return {
      get: get,
      getDb: getDb,
      create: create,
      updateBody: updateBody,
      update: update,
      remove: remove,
      removeAll: removeAll
    }
  }

  angular
    .module('Horn')
    .factory('Db', Db);

})(angular);
