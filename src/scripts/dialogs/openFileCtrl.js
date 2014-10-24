/**
 * Controller for OpenFile dialog
 *
 * NOT IN USE
 */
;(function (angular){
  'use strict';

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

  angular
    .module('Horn')
    .controller('OpenFileCtrl', OpenFileCtrl);

})(angular);
