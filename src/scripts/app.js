;(function (angular) {
  'use strict';

  function BaseCtrl ($rootScope, $scope, $q, $timeout, Db, Settings, Utils, ngDialog, Editor) {
    var vm = this,
        changingTabs = false;

    vm.tabs = [];

    vm.current = 0;
    vm.mode = 'md';

    function activate() {
      Utils.loadTabs().then(function (tabs) {
        vm.tabs = tabs;
        console.log('main:', tabs);
        Utils.loadCurrentTab().then(function (current) {
          for (var i = 0, l = tabs.length; i < l; i++) {
            if (current.cfs == tabs[i].cfs) {
              setTab(i);
              break;
            }
          }
        });
      });
    };

    activate();

    vm.renameTab = function () {
      var tab = vm.tabs[vm.current];
      $scope.tabSettings = {current: tab};

      ngDialog.open({
        template: 'templates/fileSettings.html',
        controller: 'TabSettingsCtrl',
        scope: $scope
      }).closePromise.then(function (result) {
        Db.update(tab.cfs, tab);
      });
    };


    function setTab (id) {
      var tab = vm.tabs[id],
          doc = tab.doc,
          mode = tab.mode || 'md';

      vm.current = id;
      vm.mode = mode;
      Editor.setDoc(doc);
      Editor.render();
      Utils.saveCurrentTab(tab);
    }

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
      setTab(id);
    });

    /**
     * Shows prompt window when tab is going to close
     */
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

    /**
     * New file button
     */
    vm.newFile = function () {
      var tab = {
        doc: Editor.createDoc(),
        isSaved: false,
        name: 'untitled',
        mode: 'md'
      };
      Db.create(tab).then(function (tab) {
        vm.tabs.push(tab);
        Utils.saveCurrentTab(tab);
        Utils.saveTabs(vm.tabs);
      });
    }

    /**
     * Save file button
     */
    vm.saveFile = function () {
      var tab = vm.tabs[vm.current];

      tab.body = Editor.getText();
      Db.updateBody(tab).then(function () {
        delete tab.isNew;
        tab.isSaved = true;
        Utils.saveTabs(vm.tabs);
      });
    }

    vm.setMode = function (name) {
      vm.mode = vm.tabs[vm.current].mode = name;
      Editor.render();
      Editor.setDoc(vm.tabs[vm.current].doc);
    }

    vm.isMode = function (name) {
      return vm.mode == name;
    }

    window.dbg = {};
    window.dbg.tabs = vm.tabs;
    window.dbg.root = $rootScope;
    window.dbg.editor = Editor;
    window.dbg.clear = Db.removeAll;
    window.dbg.activate = activate;
    window.dbg.info = function () {
      Db.getDb().then(function (db) {
        console.info('database file', db);
      });
      Settings.get('tabs', function (storage) {
        console.info('storage:opened tabs', storage.tabs);
      });
      Settings.get('current', function (storage) {
        console.info('storage:current', storage.current);
      });
    };
  };


  /**
   * Controller for Prompt dialog window
   */
  function PromptCtrl ($scope) {
    $scope.data = {
      result: false
    };

    $scope.confirm = function () {
      $scope.data.result = true;
    };
  }

  /**
   * Controller for TabSettings popup window
   */
  function TabSettingsCtrl ($scope) {
    $scope.data = {
      result: false
    };

    $scope.confirm = function () {
      $scope.data.result = true;
    }

  }

  angular
    .module('Horn', ['ngSanitize', 'ngRoute', 'ngDialog'])
    .controller('BaseCtrl', BaseCtrl)
    .controller('PromptCtrl', PromptCtrl)
    .controller('TabSettingsCtrl', TabSettingsCtrl)
})(angular);
