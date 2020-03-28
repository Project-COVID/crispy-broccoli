'use strict';

angular.module('app').controller('homeController', function ($stateParams, $http, $state) {

  var ctrl = this;

  // Verify post
  if ($stateParams.verify !== undefined && $stateParams.verifyHash !== undefined) {

    $http.post(`/api/v1/post/${$stateParams.verify}/verify`, { hash: $stateParams.verifyHash }).then(function (res) {
      $state.go('post', {}); // TODO: add post data to params
    }).catch(function (err) {
      console.log(err.data);
    });

  }

});