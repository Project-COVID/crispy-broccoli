'use strict';

angular.module('app').controller('homeController', function ($stateParams, $http, $state, validationService, displayService, $timeout) {

  var ctrl = this;

  ctrl.data = {
    radius: 5, // Default
    radius_unit: (_.includes(['en-GB', 'en-US'], navigator.language)) ? 'miles' : 'km'
  };

  ctrl.display = {
    postLimit: 1,
    currPage: 0,
    pages: []
  };

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
  var getPosts = function (opt_cursor) {

    if (opt_cursor === 'prev') {
      ctrl.display.currPage--;
    }
    else if (opt_cursor === 'next' && ctrl.display.currPage < ctrl.display.pages.length - 1) {
      ctrl.display.currPage++;
    }
    // Else need new posts
    else {

      var postPayload = {
        type: (ctrl.data.type === 'offer') ? 'request' : 'offer',
        lat: ctrl.data.lat,
        lon: ctrl.data.lon,
        radius: validationService.convertToKm(ctrl.data.radius, ctrl.data.radius_unit),
        limit: ctrl.display.postLimit
      };

      if (opt_cursor === 'next') {
        postPayload.cursor = _.last(ctrl.display.pages[ctrl.display.currPage]).id;
      }
      // Else new query, reset currPage and post cache
      else {
        ctrl.display.currPage = 0;
        ctrl.display.pages = [];
        ctrl.display.totalPosts = undefined;
      }
console.log(postPayload)
      $http.get(`/api/v1/post${validationService.encodeQueryParams(postPayload)}`).then(function (res) {
console.log(res.data)
        ctrl.display.pages.push(res.data.posts);
        ctrl.display.totalPosts = res.data.total;

        if (opt_cursor === 'next') {
          ctrl.display.currPage++;
        }

        $timeout(function () {
          document.querySelector('.posts-block').scrollIntoView({ behavior: 'smooth' });
        });

      }).catch(function (err) {
        console.log(err.data);
        displayService.toast('error', err.data.message);
      });

    }

  };

  ctrl.refreshPosts = function () {
    if (ctrl.data.location !== undefined) {console.log('Refresh posts')
      getPosts(); // Refresh posts
    }
  };

  // Pagination methods
  ctrl.prevPage = function () {
    getPosts('prev');
  };

  ctrl.nextPage = function () {
    getPosts('next');
  };

});