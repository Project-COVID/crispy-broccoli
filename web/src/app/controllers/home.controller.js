'use strict';

angular.module('app').controller('homeController', function ($stateParams, $http, $state, validationService, displayService) {

  var ctrl = this;

  ctrl.data = {
    radius: 5, // Default
    radius_unit: (_.includes(['en-GB', 'en-US'], navigator.language)) ? 'miles' : 'km'
  };

  ctrl.display = {};

  if ($stateParams.error !== undefined) {
    displayService.toast('error', $stateParams.error);
  }
  else if ($stateParams.success !== undefined) {
    displayService.toast('success', $stateParams.success);
  }

  // Verify post
  if ($stateParams.verify !== undefined && $stateParams.verifyHash !== undefined) {

    $http.post(`/api/v1/post/${$stateParams.verify}/verify`, { hash: $stateParams.verifyHash }).then(function (res) {
      $state.go('post', { postId: res.data.id, post: res.data, verified: true });
    }).catch(function (err) {
      console.log(err.data);
      displayService.toast('error', err.data.message);
    });

  }

  // Bind Google Maps to search bar
  var autocomplete = new google.maps.places.Autocomplete(document.querySelector('.hero form input'), {
    types: ['geocode'],
    fields: ['geometry.location', 'address_components']
  });
  autocomplete.addListener('place_changed', function () {

    var selectedPlace = autocomplete.getPlace();

    ctrl.data.lat = selectedPlace.geometry.location.lat();
    ctrl.data.lon = selectedPlace.geometry.location.lng();
    ctrl.data.location = validationService.getNearestLocation(selectedPlace.address_components);

    getPosts();

  });

  // Get posts
  var getPosts = function () {

    $http.get(`/api/v1/post${validationService.encodeQueryParams({
      type: (ctrl.data.type === 'offer') ? 'request' : 'offer',
      lat: ctrl.data.lat,
      lon: ctrl.data.lon,
      radius: validationService.convertToKm(ctrl.data.radius, ctrl.data.radius_unit),
      limit: 3
    })}`).then(function (res) {
console.log(res.data.posts)
      ctrl.display.posts = res.data.posts;
      ctrl.display.totalPosts = res.data.total;

    }).catch(function (err) {
      console.log(err.data);
      displayService.toast('error', err.data.message);
    });

  };

  ctrl.refreshPosts = function () {
    if (ctrl.data.location !== undefined) {console.log('Refresh posts')
      getPosts(); // Refresh posts
    }
  };

});