'use strict';

angular.module('app').controller('postController', function ($http, validationService, $stateParams, $state) {

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
      max: 2000
    }
  };

  ctrl.data = {
    post: {
      title: '',
      body: '',
      type: '',
      tags: [],
      name: '',
      email: '',
    },
    name: '',
    email: '',
    body: ''
  };
  ctrl.errors = {};
  ctrl.display = {};

  ctrl.display.isLoading = true;
  $http.get(`/api/v1/post/${$stateParams.id}`, ctrl.data).then(function (res) {
    ctrl.data.post = res.data;
  }).catch(function (err) {
    console.error(err);
    $state.go('home');
  }).finally(function () {
    ctrl.display.isLoading = false;
  });

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
    
    ctrl.display.isLoading = true;

    $http.post(`/api/v1/post/${$stateParams.id}/reply`, {
      name: ctrl.data.name,
      email: ctrl.data.email,
      body: ctrl.data.body
    }).then(function () {
      ctrl.display.successModalVisible = true;
    }).catch(function (err) {
      ctrl.errors = validationService.parseErrors(err.data, schema);
      validationService.scrollToError();
    }).finally(function () {
      ctrl.display.isLoading = false;
    });

  };

});