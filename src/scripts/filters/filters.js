;(function (angular, moment){

  function humanDate () {
    return function (input) {
      return moment(input).fromNow();
    }
  }

  angular
    .module('Horn')
    .filter('humanDate', humanDate);

  moment.locale('en');

})(angular, moment);
