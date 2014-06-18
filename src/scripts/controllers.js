'use strict';

(function () {
  var app = angular.module("Horn", ['ngSanitize']);

  app.controller('HornController', ['$scope', 'editor', function ($scope, editor) {
    var current = { title: 'example', value: ''};
  }]);

  /*
   * Service for business-logic
   */
  app.factory('editor', ['$rootScope', function ($rootScope) {
    var mode = 'markdown',
        tabs = [
          {
            name: "newfile"
          }
        ],
        current = tabs[0],
        cm;

    return {
      renderedText: "",

      tabs: tabs,

      init: function (textarea) {
        var self = this;

        cm = CodeMirror.fromTextArea(textarea, {
          mode: 'gfm',
          theme: 'kirin',
          tabSize: 2,
          lineWrapping: true
        });

        cm.on('change', function (instance, changes) {
          current.body = instance.getValue();
        });
      },

      setMode: function (name) {
        mode = name;
        if (name != 'markdown')
          this.render();
      },

      setTab: function (number) {
        current = tabs[number];
        cm.setValue(current.body || "");
      },

      isMode: function (name) {
        return mode === name;
      },

      render: function () {
        this.renderedText = marked(cm.getValue());
      },

      newFile: function () {
        var length = this.tabs.push({name: "untitled", body: ""});
        this.setTab(length - 1);
      },

      /*
       * Getting all files stored in app's Drive directory
       */
      getDriveFiles: function (callback) {
        if (typeof callback != 'function')
          return;

        chrome.syncFileSystem.requestFileSystem(function (fs) {
          var directoryReader = fs.root.createReader();
          directoryReader.readEntries(function (entries) {
            callback(entries);
          });
        });
      },


      /*
       * Saving file to Drive
       */
      saveFile: function () {
        var self = this;
        chrome.syncFileSystem.requestFileSystem(function (fs) {
          fs.root.getFile(current.name + '.md', {create: true}, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
              writer.write(new Blob([cm.getValue()]));
            });
          });
        });
      }
    }
  }]);


  /*
   * Toolbar Tab Directive
   */

  app.directive('toolbar', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/toolbar.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;
      },
      scope: {
      },
      transclude: true,
      controller: function ($scope) {
        $scope.saveFile = function () {

        }
      }
    };
  }]);

  /*
   * Current Tab Directive
   */

  app.directive('tab', [function () {
    return {
      restrict: 'E',
      templateUrl: 'partial/tab.html',
      transclude: true,
      link: function ($scope, element, attrs) {

      }
    };
  }]);


  app.directive('viewModes', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/viewModes.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;
      },
      controller: function () {

      }
    };
  }]);

  /*
   * Views modes
   */

  app.directive('codemirror', ['editor', function (editor) {
    return {
      restrict: 'E',
      templateUrl: 'partial/codemirror.html',
      link: function ($scope, element, attrs) {
        $scope.editor = editor;

        var textarea = element[0].getElementsByTagName('textarea')[0];
        editor.init(textarea);
      },
      controller: function () {

      }
    }
  }]);

  app.directive('hrnPreview', ['editor', function (editor) {
    return {
      restrict: 'A',
      templateUrl: 'partial/preview.html',
      link: function ($scope, element, attrs) {
        //$scope.html = editor.renderedText;
      }
    };
  }])

})();
