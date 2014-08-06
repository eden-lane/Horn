'use strict';

angular
  .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
  .controller('PromptCtrl', function ($scope) {

    $scope.data = {
      result: false
    };

    $scope.confirm = function () {
      $scope.data.result = true;
    };
  })
  .controller('BaseCtrl', function ($rootScope, $scope, $q, $timeout, Db, Settings, Utils, ngDialog, Editor) {

    var vm = this,
        changingTabs = false;

    vm.tabs = [];

    vm.current = 0;
    vm.mode = 'md';

    /*
     * Events
     */

    $scope.$on('tabs:beforeChanged', function (ev, id) {
      var tab = vm.tabs[vm.current];
      tab.doc = Editor.getDoc();
    });

    /*
     * When tab has been switched
     */
    $scope.$on('tabs:changed', function (ev, id) {
      var tab = vm.tabs[id],
          doc = tab.doc || new CodeMirror.Doc('', 'gfm'),
          mode = tab.mode || 'md';

      vm.current = id;
      vm.mode = mode;
      Editor.setDoc(doc);
      Editor.render();
      Utils.saveCurrentTab(tab);
    });

    $scope.$on('tabs:closing', function (ev, defer) {
      ngDialog.open({
        template: 'templates/prompt.html',
        controller: 'PromptCtrl'
      }).closePromise.then(function (result) {
        result.data.result ? defer.resolve() : defer.reject();
      });
    });

    /*
     * Toolbar actions
     */

    vm.newFile = function () {
      console.log('new file was fired');
    }

    vm.setMode = function (name) {
      vm.mode = vm.tabs[vm.current].mode = name;
      Editor.render();
      Editor.setDoc(vm.tabs[vm.current].doc);
    }

    vm.isMode = function (name) {
      return vm.mode == name;
    }

    window.debug = {};
    window.debug.tabs = this.tabs;
    window.debug.root = $rootScope;
    window.debug.editor = Editor;



//
//
//    $scope.closingTab;
//
//    $scope.$on('tabs:currentChanged', function (ev, data) {
//      if (data.tab && data.tab.doc)
//        Editor.set(data.tab.doc);
//    });
//
//    window.ts = Tabs;
//    loadTabs();
//
//    window.main = $scope;
//
//
//    /**
//     * Saves current tabs to settings
//     */
//    function saveTabs () {
//      var tabs = Tabs.tabs,
//          result = [];
//      if (tabs == 0)
//        return;
//
//      for (var i = 0, max = tabs.length; i < max; i++) {
//        result.push({cfs: tabs[i].cfs});
//      };
//      settings.set('tabs', result);
//    };
//
//
//    /**
//     * Load last opened tabs
//     */
//    function loadTabs () {
//      $scope.loader = true;
//      settings.get('tabs', function(it) {
//        var tabs = it.tabs,
//            promises = [];
//        if (!tabs.length)
//          $scope.loader = false;
//
//        for (var i = 0, max = tabs.length; i < max; i++) {
//          var cfs = tabs[i].cfs;
//          promises.push(openDocument(cfs));
//        };
//
//        $q.all(promises).finally(function () {
//          $scope.loader = false;
//        })
//      });
//    };
//
//
//    /**
//     * Saves active tab to settings
//     */
//    function saveCurrentTab () {
//      if (Tabs.current)
//        return;
//      settings.set('current', {cfs: Tabs.current.tab.cfs});
//    };
//
//
//    /**
//     * Load last active tab from settings
//     */
//    function loadCurrentTab () {
//      settings.get('current', function (it) {
//        var current = it.current;
//        for (var i = 0, l = $scope.tabs.length; i < l; i++) {
//          var tab = $scope.tabs[i];
//          if (tab.cfs == current.cfs) {
//            $scope.$apply(function () {
//              $scope.loader = false;
//            });
//            return;
//          }
//        };
//      });
//    };
//
//    /**
//     * Open document by it's cfs
//     */
//    function openDocument (cfs) {
//      return db.get({cfs: cfs}, true)
//        .then(function (dbFile) {
//          console.log('dbFile', dbFile);
//          var dbFile = angular.copy(dbFile);
//          dbFile.isSaved = true;
//          //$scope.actions.newFile(
//        });
//    };
//
//    /**
//     *
//     */
//    window.debug = {
//      clearAll: function () {
//        chrome.storage.sync.set({tabs: []});
//        db.removeAll();
//      }
//    }
//
//    /**
//     * Action commands for toolbars buttons
//     */
//
//    $scope.actions = {
//
//      /**
//       * Creates a new tab
//       */
//      newFile: function () {
//
//        var tab = {
//          name: 'untitled',
//          isSaved: false,
//          doc: CodeMirror.Doc('', 'gfm'),
//          isNew: true
//        };
//
//        Editor.set(tab.doc);
//        Tabs.add(tab);
//        db.create(tab).then(function () {
//          saveTabs();
//        });
//
//      },
//
//
//      /**
//       * Save file to database and cfs
//       */
//      saveFile: function (isNamed) {
//        var current = $scope.current;
//
//        current.body = cm.getText();
//
//        /*db.updateBody(current).then(function () {
//          delete current.isNew;
//          current.isSaved = true;
//          saveTabs();
//        });*/
//      },
//
//
//      /**
//       * Open existing file from cfs
//       */
//      openFile: function (name) {
//        console.log('app:openFile', name);
//        /*var self = this;
//        db.getDb().then(function (db) {
//          self.scope = $scope.$new(true);
//          self.scope.files = db;
//          self.scope.openDocument = openDocument;
//          ngDialog.open({
//            template: 'templates/openFile.html',
//            scope: self.scope
//          });
//        });*/
//      },
//
//
//      /**
//       * Set current preview mode
//       */
//      setMode: function (name) {
//        changingTabs = true;
//        if (!$scope.current)
//          return;
//        $scope.current.mode = name;
//        db.update($scope.current.cfs, {mode: name});
//        cm.setMode(name);
//        cm.setText($scope.current.body || '');
//        changingTabs = false;
//      },
//
//      /**
//       * Check currently active mode
//       */
//      //isMode: cm.isMode
//    };

  });
