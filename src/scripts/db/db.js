;(function (angular) {
  'use strict';

  function Db ($q, Cfs) {

    /**
     * Loads database file form CFS or creates it
     * if it don't exists
     *
     * @private
     * @return {Array<DbFile>} - database
     */
    var getDb = (function () {
      var database,
          deferred = $q.defer();

      return function () {
        Cfs.get('db.json', true).then(function (dbFile) {
          if (!dbFile.body)
            database = [];
          else
            database = JSON.parse(dbFile.body);
          deferred.resolve(database);
        });

        return deferred.promise;
      };
    })();


    /**
     * Insert file in the database and save
     *
     * @private
     */
    function insert (tab) {
      var dbFile,
          doc = tab.doc;

      delete tab.doc;

      dbFile = clearTab(tab);

      return getDb()
        .then(function (db) {
          db.push(dbFile);
          saveDb(db);
          tab.doc = doc;
          updateBody(tab);
        });
    };


    /**
     * Saves database to Cfs
     *
     * @private
     * @param {Array<DbFile>}
     * @return {Promise}
     */
    function saveDb (db) {
      if (typeof db == 'object') {
        db = JSON.stringify(db);
        return Cfs.set('db.json', db);
      } else {
        throw "db is not valid database file !"
      }
    };


    /**
     * Removes unnecessary information from
     * Tab
     * @param {Tab}
     * @return {DbFile}
     */
    function clearTab(tab) {
      var result = angular.copy(tab);
      delete result.body;
      delete result.$$hashKey;
      delete result.isSaved;
      delete result.doc;

      return result;
    };


    /**
     * Fetching file from database
     *
     * @param {Object} filter - monogo-like filter
     * @param {Boolean} withContent - if true returns contents
     *                                of the file from Cfs
     * @return dbFile
     */
    function get(filter, withContent) {
      var deferred = $q.defer();
      getDb().then(function (db) {
        var dbFile = angular.copy(sift(filter, db)[0]);

        if (!dbFile) {
          deferred.reject('File not found in the database');
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
     * @public
     * Create a new file in Cfs and in the database
     * @return {Promise<DbFile>} - created DbFile
     */
    function create (tab) {
      var defer = $q.defer();

      Cfs.get().then(function (file) {
        tab.cfs = file.name;
        insert(tab).then(function () {
          defer.resolve(tab);
        });
      });

      return defer.promise;
    };


    /**
     * Delete an entry from the db and file from the Cfs
     *
     * @public
     * @return {Promise<Array<DbFile>>} - new database
     */
    function remove(id) {
      var defer = $q.defer();

      getDb().then(function (db) {
        db = db.filter(function (item) {
          return item.cfs !== id;
        });
        Cfs.remove(id).then(function () {
          saveDb(db).then(function () {;
            defer.resolve(db);
          });
        });
      });

      return defer.promise;
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
        update(dbFile.cfs, null);
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

      params = params || {};

      return getDb().then(function (db) {
        var item = sift({cfs: id}, db)[0],
            doc = params.doc;
        delete params.doc;
        params = clearTab(params);
        params.updatedAt = Date.now();
        angular.extend(item, params);
        params.doc = doc;
        saveDb(db);
        return params;
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
