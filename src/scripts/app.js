;(function (angular) {
  'use strict';

  angular
    .module('Horn', ['ngSanitize', 'ngDialog', 'dialogs'])
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl ($rootScope, $scope, $q, $timeout, /*Db,*/ Settings, Utils, Cfs, Fs, ngDialog, Editor, Tab, Prompt) {
    var vm = this,
        changingTabs = false;

    vm.tabs = [];
    vm.loading = true;
    vm.current = 0;
    vm.mode = 'md';

    function activate() {
      Utils.loadTabs().then(function (tabs) {
        _.forEach(tabs, function (tab) {
          if (tab.id)
            Fs.restore(tab.id).then(vm.newFile);
        })
      });

      vm.loading = false;
    };

    activate();

    function onChangeTab (tab, id) {
      if (tab) {
        Editor.setDoc(tab.doc);
        vm.mode = tab.mode;
        Utils.saveCurrentTab(tab);
      }
    }

    function getCurrentTab () {
      return getTab(vm.current);
    }

    function getTab (id) {
      return vm.tabs[id];
    }

    /*
     * When tab has been switched
     */
    $scope.$on('tabs:changed', function (ev, data) {
      onChangeTab(data.tab, data.id);
    });

    /**
     * Shows dialog when tab is going to close
     */
    //TODO: Don't ask if doc is in saved state
    $scope.$on('tabs:closing', function (ev, id, defer) {
      var tab = getTab(id);
      if (tab.isSaved) {
        defer.resolve();
        return;
      }

      Prompt({ message: "File isn't saved. Do you really want to close it ?"})
        .then(function success () {
          defer.resolve();
        }, function failed () {
          defer.reject();
        });
    });


    $scope.$on('tabs:closed', function (ev) {
      Utils.saveTabs(vm.tabs);
    })


    Editor.on('changed', function (sender, args) {
      if (vm.tabs[vm.current].isSaved) {
        vm.tabs[vm.current].isSaved = false;
        $scope.$digest();
      }
    });

    /**
     * New file button
     * @param {Object} data
     */
    vm.newFile = function (data) {
      var tab = new Tab(data);
      vm.tabs.push(tab);
      Utils.saveTabs(vm.tabs);

      return tab;
    }


    /**
     * Save file button
     */
    vm.saveFile = function () {
      var tab = getCurrentTab();
      tab.save();
    }


    /**
     * Import file from local file system
     */
    vm.importFile = function () {
      Fs.open().then(vm.newFile);
    }


    /**
     * Change current mode of Editor
     * @param {'md'|'html'|'preview'} name - name of new mode
     */
    vm.setMode = function (name) {
      vm.mode = getCurrentTab().mode = name;
    }

    vm.isMode = function (name) {
      return vm.mode == name;
    }

    /**
     * Key binding for editor
     */

    /**
     * Helper method for replacing or
     * inserting characters
     */
    function replaceSelection (value, cm) {
      var selection = cm.getSelection();
      if (!selection) {
        cm.replaceSelection(value);
      } else {
        cm.replaceSelection(value + selection + value);
      }
    }

    vm.keys = {
      'Ctrl-S': vm.saveFile,
      'Ctrl-O': vm.openFile,
      'Ctrl-N': vm.newFile,
      'Ctrl-E': vm.setMode.bind(null, 'md'),
      'Ctrl-P': vm.setMode.bind(null, 'preview'),
      'Ctrl-Tab': function (cm) {
        vm.setTab(vm.current + 1);
      },
      'Shift-Ctrl-Tab': function (cm) {
        vm.setTab(vm.current - 1);
      },
      // text editing
      'Ctrl-B': replaceSelection.bind(null, '**'),
      'Ctrl-I': replaceSelection.bind(null, '_')
    }


  };

})(angular);
