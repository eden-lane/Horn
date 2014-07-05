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
    console.log('cfs:set', body);
    getFileEntry(name).then(function (fileEntry) {
      fileEntry.createWriter(function (fileWriter) {
        var blob = new Blob([body]);
        fileWriter.write(blob);
      })
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
    on: on
  }
}]);

'use strict';

angular
.module('Horn')
.factory('db', ['$q', 'cfs', function ($q, cfs) {


  var getDb = (function () {
    var database,
        deferred = $q.defer();
    function init () {
      cfs.on(function (fileInfo) {
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
    cfs.set('db.json', db);
  };



  /**
   * @param {Object} filter - monogo-like filter
   * @return dbFile
   */
  function get (filter, withContent) {
    var deferred = $q.defer();
    getDb().then(function (db) {
      var dbFile = sift(filter, db)[0];
      if (withContent) {
        cfs.get(dbFile.cfs, false).then(function (file) {
          dbFile.body = file.body;
          deferred.resolve(dbFile);
        });
      }
      else
        deferred.resolve(dbFile);
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
      cfs.set(dbFile.cfs, tab.body || '');
    });
  };

  /**
   * Rename an entry in the database
   * @param {String} id - cfs name of document
   * @param {Object} params - new properties of item
   */
  function update (id, params) {
    getDb().then(function (db) {
      var item = sift({cfs: id}, db)[0];
      angular.extend(item, params);
      saveDb(db);
    });
  };

  return {
    get: get,
    getDb: getDb,
    create: create,
    update: update
  }

}]);

/**
 * Service for CodeMirror
 */
angular
.module('Horn')
.factory('cm', function () {

  var cm,
      mode = 'md',
      renderedText;

  var obj = {};
  obj.init = function (textarea) {
    var self = this;
    cm = CodeMirror.fromTextArea(textarea, {
      mode: 'gfm',
      theme: 'kirin',
      tabSize: 2,
      lineWrapping: true
    });

    cm.setSize('100%', '80%');

    if (angular.isFunction(obj.setup))
      obj.setup(cm);
  };

  obj.render = function () {
    renderedText = marked(cm.getValue());
  };

  obj.isMode = function (name) {
    return mode === name;
  };

  obj.setMode = function (name) {
    mode = name;
    obj.render();
  };

  obj.getText = function () {
    return cm.getValue();
  };

  obj.setText = function (text) {
    cm.setValue(text);
  };

  /**
   * Setup cm after init
   */
  obj.setup = null;

  return obj;
})

angular
.module('Horn')
.directive('editorArea', ['cm', function (cm) {
  var mode = 'markdown';

  return {
    restrict: 'E',
    templateUrl: 'scripts/editor/editorArea.html',
    transclude: true,
    link: function (scope, element) {
      var textarea = element.find('textarea')[0];
      cm.init(textarea);

      scope.isMode = cm.isMode;
      scope.setMode = cm.setMode;
    },
    controller: function ($scope) {


    }
  }
}])

'use strict';

angular
.module('Horn')
.service('settings', [function () {

  function set(name, value, callback) {
    var item = {};
    item[name] = value;

    if (typeof callback != 'function')
      callback = null;

    chrome.storage.sync.set(item, callback);
  };

  function get(name, callback) {
    chrome.storage.sync.get(name, callback);
  };

  return {
    set: set,
    get: get
  }

}]);

angular
.module('Horn')
.directive('tabs', function () {
  return {
    restrict: 'E',
    templateUrl: 'scripts/tabs/tabs.html',
    scope: {
      tabs: '=items',
      current: '=',
      changeTab: '=',
      closeTab: '=',
      editTab: '='
    },
    link: function (scope) {

      scope.setTab = function (id) {
        scope.changeTab(id);
      };

      scope.isCurrent = function (obj) {

        return scope.current.cfs === obj.cfs;
      }
    }
  }
});

/**
 * @name Toolbar
 * @description
 * This directive needs an `actions` object with callbacks
 * for main toolbars function:
 *
 * - newFile
 * - openFile
 *
 * - setView('markdown'|'preview'|'html')
 * - isMode(name)
 */
angular
  .module('Horn')
  .directive('toolbar', [function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/toolbar/toolbar.html',
      scope: {
        actions: '='
      },

      controller: function ($scope) {


      },
      link: function (scope) {
        if (!scope.actions)
          throw 'Toolbar needs an `actions` object with callbacks for functions';

        scope.newFile = scope.actions.newFile;
        scope.openFile = scope.actions.openFile ;
        scope.saveFile = scope.actions.saveFile ;

        scope.setMode = scope.actions.setMode;
        scope.isMode = scope.actions.isMode;
      }
    }
  }]);
