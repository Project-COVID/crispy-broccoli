'use strict';

angular.module('app').controller('homeController', function ($stateParams, $http, $state, validationService, displayService, $timeout, $rootScope) {

  var ctrl = this;

  if ($rootScope.data === undefined) {
    $rootScope.data = {};
  }

  if ($rootScope.display === undefined) {
    $rootScope.display = {
      radius: 5, // Default
      radius_unit: (_.includes(['en-GB', 'en-US'], navigator.language)) ? 'miles' : 'km',
      postLimit: 1,
      currPage: 0,
      pages: []
    };
  }

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

    $rootScope.data.lat = selectedPlace.geometry.location.lat();
    $rootScope.data.lon = selectedPlace.geometry.location.lng();
    $rootScope.data.location = validationService.getNearestLocation(selectedPlace.address_components);

    getPosts();

  });

  // Get posts
  var getPosts = function (opt_cursor) {

    if (opt_cursor === 'prev') {
      $rootScope.display.currPage--;
    }
    else if (opt_cursor === 'next' && $rootScope.display.currPage < $rootScope.display.pages.length - 1) {
      $rootScope.display.currPage++;
    }
    // Else need new posts
    else {

      var postPayload = {
        type: ($rootScope.data.type === 'offer') ? 'request' : 'offer',
        lat: $rootScope.data.lat,
        lon: $rootScope.data.lon,
        radius: validationService.convertToKm($rootScope.display.radius, $rootScope.display.radius_unit),
        limit: $rootScope.display.postLimit
      };

      if (opt_cursor === 'next') {
        postPayload.cursor = _.last($rootScope.display.pages[$rootScope.display.currPage]).id;
      }
      // Else new query, reset currPage and post cache
      else {
        $rootScope.display.currPage = 0;
        $rootScope.display.pages = [];
        $rootScope.display.totalPosts = undefined;
      }

      $http.get(`/api/v1/post${validationService.encodeQueryParams(postPayload)}`).then(function (res) {
console.log(res.data)
        $rootScope.display.pages.push(res.data.posts);
        $rootScope.display.totalPosts = res.data.total;

        if (opt_cursor === 'next') {
          $rootScope.display.currPage++;
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
    if ($rootScope.data.location !== undefined) {console.log('Refresh posts')
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