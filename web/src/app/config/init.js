'use strict';

// Start by defining the main module and adding the module dependencies
angular.module('app', ['ui.router']);

// Setting HTML5 Location Mode
angular.module('app').config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

angular.module('app').run(function ($rootScope, $window, $transitions) {

  // Configure API host
  $rootScope.apiHost = location.protocol + '//' + location.host;

  $rootScope.goBack = function () {
    $window.history.back();
  }

  // $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
  //   $document[0].title = $state.current.data.pageTitle + ' | The Kindness Project';
  // });

  // $transitions.onSuccess({}, function () {
  //   document.body.scrollTop = document.documentElement.scrollTop = 0;
  // });
    
});
