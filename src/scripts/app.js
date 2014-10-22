;(function (angular) {
  'use strict';

  function BaseCtrl ($rootScope, $scope, $q, $timeout, /*Db,*/ Settings, Utils, Cfs, Fs, ngDialog, Editor) {
    var vm = this,
        changingTabs = false;

    vm.tabs = [];
    vm.loading = true;
    vm.current = 0;
    vm.mode = 'md';

    function activate() {
//      Utils.loadTabs().then(function (tabs) {
//        vm.tabs = tabs;
//        Utils.loadCurrentTab().then(function (current) {
//          var index = _.findIndex(vm.tabs, {cfs: current.cfs});
//          vm.setTab(index);
//        });
//      }).finally(function () {
//        vm.loading = false;
//      });
      vm.loading = false;
    };

    activate();


    /**
     * Show dialog for renaming tab
     */
    vm.renameTab = function () {
      var tab = vm.tabs[vm.current];
      $scope.tabSettings = {current: tab};

      ngDialog.open({
        template: 'templates/fileSettings.html',
        controller: 'TabSettingsCtrl',
        scope: $scope
      }).closePromise.then(function () {
        Db.update(tab.cfs, tab).then(function (params) {
          tab.doc = params.doc;
        });
      });
    };


    /**
     * Change current tab
     * @param {Number} id - number of new tab
     * Also will save new current tab to chrome sync storage
     */
    vm.setTab = function (id) {
      id = id >= vm.tabs.length ? 0 : id;
      id = id < 0 ? vm.tabs.length - 1 : id;
      var tab = vm.tabs[id];

      if (!tab) {
        Editor.setValue(null);
        return;
      }

      var doc = tab.doc,
          mode = tab.mode || 'md';

      vm.current = id;
      vm.mode = mode;
      Editor.setDoc(doc);
      Utils.saveCurrentTab(tab);
    }

    /*
     * Events
     */

    /*
     * When tab has been switched
     */
    $scope.$on('tabs:changed', function (ev, id) {
      vm.setTab(id);
    });

    /**
     * Shows dialog when tab is going to close
     */
    //TODO: Don't ask if doc is in saved state
    $scope.$on('tabs:closing', function (ev, id, defer) {
      var tab = vm.tabs[id];
      if (tab.isSaved) {
        var length = vm.tabs.length - 2;
        defer.resolve();
        vm.setTab(length);
        return;
      }
      ngDialog.open({
        template: 'templates/prompt.html',
        controller: 'PromptCtrl'
      }).closePromise.then(function (result) {
        if (result.value) {
          var length = vm.tabs.length - 2;
          defer.resolve();
          vm.setTab(length);
        } else {
          defer.reject();
        };
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

    /*
     * Toolbar actions
     */

    /**
     * New file button
     * @param {Object} data -
     *  name: name of document
     *  test: text content of document
     *  isLocal: true, if document opened from
     *           local file system
     *
     */
    vm.newFile = function (data) {
      var tab = {
        doc: Editor.createDoc(data.text),
        isSaved: !!data.fileEntry,
        name: data.name || 'untitled',
        mode: 'md',
        fileEntry: data.fileEntry
      };

      if (data.fileEntry) {
        vm.tabs.push(tab);
        vm.setTab(vm.tabs.length - 1);
      } else {
        throw "Tab can't be not local !";
//        Db.create(tab).then(function (tab) {
//          vm.tabs.push(tab);
//          Utils.saveCurrentTab(tab);
//          Utils.saveTabs(vm.tabs);
//          vm.setTab(vm.tabs.length - 1);
//        });
      }
    }

    /**
     * Save file button
     */
    vm.saveFile = function () {
      var tab = vm.tabs[vm.current],
          text = Editor.getText()

      if (tab.fileEntry) {
        Fs.save(tab.fileEntry, text).then(function () {
          tab.isSaved = true;
        });
      } else {
        console.log('isnt local !');
//        Db.updateBody(tab).then(function () {
//          delete tab.isNew;
//          tab.isSaved = true;
//          Utils.saveTabs(vm.tabs);
//        });
      }
    }


    /**
     * Open file button
     */
    vm.openFile = function () {
      ngDialog.open({
        template: 'templates/openFile.html',
        controller: 'OpenFileCtrl'
      }).closePromise.then(function (data) {
        if (data.value.toString() == "[object FileEntry]") {
          Cfs.readFileEntry(data.value).then(function (text) {
             vm.newFile(text, data.value.name, true);
          });
        } else {
          var index = _.findIndex(vm.tabs, {cfs: data.value});
          if (index > -1) {
            vm.setTab(index);
          } else {
            Utils.openDocument(data.value).then(function (tab) {
              var length = vm.tabs.push(tab);
              vm.setTab(length - 1);
            })
          }
        }
      });
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
      vm.mode = vm.tabs[vm.current].mode = name;
      Editor.setDoc(vm.tabs[vm.current].doc);
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


  /**
   * Controller for Prompt dialog window
   */
  function PromptCtrl ($scope) {
    //TODO: Remove
  }

  /**
   * Controller for TabSettings popup window
   */
  function TabSettingsCtrl ($scope) {
    //TODO: Remove
  }


  /**
   * Controller for OpenFile dialog
   */
  function OpenFileCtrl ($scope, Db, Utils, ngDialog) {
    Db.getDb().then(function (db) {
      $scope.db = db;
    });

    $scope.importFromLocal = function () {
      var localImportSettings = {
        type: 'openWritableFile',
        accepts: [
          {
            extensions: ['md']
          },
          {
            extensions: ['txt']
          }
        ]
      };
      chrome.fileSystem.chooseEntry(localImportSettings, function (entry) {
        $scope.closeThisDialog(entry);
      })
    }

    $scope.delete = function (cfs) {
      var openFileCtrlScope = $scope;
      ngDialog.open({
          template: 'templates/prompt.html',
          controller: function ($scope) { $scope.message = "Do you really want do delete this document ?" }
        }).closePromise.then(function (data) {
          if (data.value) {
            Db.remove(cfs).then(function (db) {
              openFileCtrlScope.db = db;
            });
          }
        })
      }
  }

  function humanDate () {
    return function (input) {
      return moment(input).fromNow();
    }
  }

  angular
    .module('Horn', ['ngSanitize', 'ngDialog'])
    .controller('BaseCtrl', BaseCtrl)
    .controller('PromptCtrl', PromptCtrl)
    .controller('TabSettingsCtrl', TabSettingsCtrl)
    .controller('OpenFileCtrl', OpenFileCtrl)
    .filter('humanDate', humanDate)

  moment.locale('en');

})(angular);
