'use strict';

angular.module('app').controller('createPostController', function ($rootScope, $http, validationService, $stateParams, $state) {

  console.log($stateParams)

  if ($stateParams.lat === undefined || $stateParams.lon === undefined || $stateParams.location === undefined) {
    // // TODO: prompt user to enter address first
    // $state.go('home');
  }

  var ctrl = this;

  var schema = { // Fields visible in the UI that can display specific errors
    name: {
      required: true,
      min: 1,
      max: 20
    },
    email: {
      required: true,
      validate: 'email'
    },
    title: {
      required: true,
      min: 1,
      max: 200
    },
    body: {
      max: 500
    }
  };

  ctrl.data = {
    type: $stateParams.type,
    lat: $stateParams.lat,
    lon: $stateParams.lon,
    tags: []
  };
  ctrl.errors = {};
  ctrl.display = {};
  
  ctrl.toggleTag = function (tagId) {

    if ($rootScope.constants.tags[tagId] === undefined) {
      console.log('Invalid tag, cannot select: ' + tagId);
      return;
    }

    var tagIndex = ctrl.data.tags.indexOf(tagId);
    if (tagIndex !== -1) {
      ctrl.data.tags.splice(tagIndex, 1);
    }
    else {
      ctrl.data.tags.push(tagId);
    }

  };

  ctrl.validateField = function (field) {
    ctrl.errors[field] = validationService.validateField(ctrl.data[field], schema[field]);
  };

  ctrl.submit = function () {

    // Basic validation

    if (ctrl.data.type === undefined) {
      ctrl.errors.general = 'Please select a post type to continue';
      validationService.scrollToError();
      return;
    }
    if (ctrl.data.tags.length === 0) {
      ctrl.errors.general = 'Please select at least 1 tag to continue';
      validationService.scrollToError();
      return;
    }

    var err;
    _.forEach(_.keys(schema), function (field) {
      ctrl.validateField(field);
      if (ctrl.errors[field] !== undefined) {
        err = true;
      }
    });

    if (err) {
      ctrl.errors.general = 'Please fix the errors below to continue';
      validationService.scrollToError();
      return;
    }
    
    ctrl.display.isLoading = true;

    $http.post('/api/v1/post/create', ctrl.data).then(function (res) {
      ctrl.display.successModalVisible = true;
    }).catch(function (err) {
      ctrl.errors = validationService.parseErrors(err.data, schema);
      validationService.scrollToError();
    }).finally(function () {
      ctrl.display.isLoading = false;
    });

  };

});