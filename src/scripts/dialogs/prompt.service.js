;(function (angular){
  angular
    .module('dialogs')
    .factory('Prompt', Prompt);

  function Prompt ($q, ngDialog) {

    return function (data) {

      var defer = $q.defer();

      ngDialog.open({
        template: 'templates/prompt.html',
        controller: 'PromptCtrl',
        data: data
      }).closePromise.then(function (result) {
        if (result.value)
          defer.resolve();
        else
          defer.reject();
      })

      return defer.promise;
    }


  }
})(angular)
