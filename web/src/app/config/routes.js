'use strict';

// Setting up routes
angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/'); // Default route

  $stateProvider
    .state('home', {
      url: '/?q&verify&verifyHash',
      templateUrl: 'app/views/home.view.html',
      controller: 'homeController',
      controllerAs: 'ctrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'app/views/about.view.html'
    })
    .state('post', {
      url: '/post/:postId?teardownHash',
      templateUrl: 'app/views/post.view.html',
      controller: 'postController',
      controllerAs: 'ctrl',
      params: {
        post: undefined,
        verified: undefined
      }
    }).state('create-post', {
      url: '/post/create',
      templateUrl: 'app/views/create.post.view.html',
      controller: 'createPostController',
      controllerAs: 'ctrl',
      params: {
        type: undefined,
        lat: undefined,
        lon: undefined,
        location: undefined
      }
    });;

});
