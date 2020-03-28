'use strict';

angular.module('app').controller('homeController', function ($stateParams, $http, $state, validationService) {

  var ctrl = this;

  ctrl.data = {
    radius: 20 // Default
  };
ctrl.data.type = 'offer'
ctrl.data.lat = 0
ctrl.data.lon = 0
  ctrl.display = {
    radius_unit: 'km'
    // posts: [],
    // postQty: 1
  };

  // Verify post
  // if ($stateParams.verify !== undefined && $stateParams.verifyHash !== undefined) {

  //   $http.post(`/api/v1/post/${$stateParams.verify}/verify`, { hash: $stateParams.verifyHash }).then(function (res) {
  //     $state.go('post', {}); // TODO: add post data to params
  //   }).catch(function (err) {
  //     console.log(err.data);
  //   });

  // }

  // Get posts
  var getPosts = function () {

    $http.get(`/api/v1/post${validationService.encodeQueryParams(_.merge(ctrl.data, { limit: 5 })}`).then(function (res) {

      console.log(res.data)

    }).catch(function (err) {
      console.log(err.data);
    });


  };
  getPosts();

  // Submit location form
  ctrl.submit = function () {
    console.log('form submitted')
  };

});