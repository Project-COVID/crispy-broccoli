'use strict';

angular.module('app').controller('postController', function ($http, validationService, $stateParams, $state, displayService) {

  if ($stateParams.postId === undefined || $stateParams.postId === '') {
    displayService.toast('error', 'Couldn\'t load post');
    $state.go('home');
    return;
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
    body: {
      required: true,
      max: 1000
    }
  };

  ctrl.data = {};
  ctrl.errors = {};
  ctrl.display = {
    verifiedModalVisible: $stateParams.verified !== undefined,
    removeModalVisible: $stateParams.teardownHash !== undefined
  };

  if ($stateParams.post !== undefined) {
    ctrl.display.post = $stateParams.post;
  }
  else {
    $http.get(`/api/v1/post/${$stateParams.postId}`, ).then(function (res) {
      ctrl.display.post = res.data;
    }).catch(function (err) {
      console.error(err);
      displayService.toast('error', 'Couldn\'t load post');
      $state.go('home');
    });
  }

  ctrl.validateField = function (field) {
    ctrl.errors[field] = validationService.validateField(ctrl.data[field], schema[field]);
  };

  ctrl.submit = function () {

    // Basic validation

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
    
    ctrl.display.replyIsLoading = true;

    $http.post(`/api/v1/post/${$stateParams.postId}/reply`, {
      name: ctrl.data.name,
      email: ctrl.data.email,
      body: ctrl.data.body
    }).then(function () {
      ctrl.display.successModalVisible = true;
    }).catch(function (err) {
      console.log(err.data);
      ctrl.errors = validationService.parseErrors(err.data, schema);
      validationService.scrollToError();
    }).finally(function () {
      ctrl.display.replyIsLoading = false;
    });

  };

  ctrl.removePost = function () {

    ctrl.display.removeIsLoading = true;

    $http.post(`/api/v1/post/${$stateParams.postId}/close`, { hash: $stateParams.teardownHash }).then(function () {
      displayService.toast('success', 'Post removed successfully');
      $state.go('home');
    }).catch(function (err) {
      console.log(err.data);
      displayService.toast('error', 'Couldn\'t remove post');
    }).finally(function () {
      ctrl.display.removeIsLoading = false;
    });

  };

});