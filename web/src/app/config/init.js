'use strict';

// Start by defining the main module and adding the module dependencies
angular.module('app', ['ui.router']);

// Setting HTML5 Location Mode
angular.module('app').config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

// Array contains filter
angular.module('app').filter('contains', function () {
  return function (array, needle) {
    return array.indexOf(needle) !== -1;
  };
});

// Validation service
angular.module('app').service('validationService', function ($timeout) {
  
  var validateField = function (value, schema) {

    if (schema.required && (value === undefined || value === '')) {
      return 'Field is required';
    }
    else if (!schema.required && value === undefined) {
      value = '';
    }

    if (schema.min !== undefined && value.length < schema.min) {
      return 'Minimum length is ' + schema.min;
    }

    if (schema.max !== undefined && value.length > schema.max) {
      return 'Maximum length is ' + schema.max;
    }

    if (schema.validate === 'email' && !validator.isEmail(value)) {
      return 'Please enter a valid email';
    }

  };

  var _parseError = function (err) {
    if (err.type === 'any.required') {
      return 'Field is required';
    }
    else if (err.type === 'string.max') {
      return 'Maximum length is ' + err.context.limit;
    }
    else if (err.type === 'string.min') {
      return 'Minimum length is ' + err.context.limit;
    }
    else if (err.type === 'string.email') {
      return 'Please enter a valid email';
    }
  };

  var parseErrors = function (errors, schema) {

    var errObj = {};
    _.forEach(errors, function (err) {
      // Check for errors in visible schema fields
      var field = err.path[0];
      if (schema[field] !== undefined) {
        errObj[field] = _parseError(err);
      }
      else { // Something else went wrong
        console.log(err);
        errObj.general = err.message;
      }
    });

    if (errObj.general === undefined) {
      errObj.general = 'Please fix the errors below to continue';
    }

    return errObj;

  };

  var scrollToError = function () {
    $timeout(function () {
      document.querySelector('form .notification-wrapper').scrollIntoView();
    });
  };

  return {
    validateField: validateField,
    parseErrors: parseErrors,
    scrollToError: scrollToError
  };

});

angular.module('app').run(function ($rootScope, $window, $transitions, $timeout, $http) {

  // Configure API host
  $rootScope.apiHost = location.protocol + '//' + location.host;

  // Get constants
  $rootScope.constants = {
    "types": {
      "offer": "offer",
      "request": "request"
    },
    "tags": {
      "has_car": "Has car",
      "has_bike": "Has bike",
      "errand": "Errand",
      "collection": "Collection",
      "donation": "Donation",
      "food": "Food",
      "prescription": "Prescription",
      "dog_walk": "Dog walk",
      "pet_care": "Pet care",
      "child_minding": "Child minding",
      "clothes_wash": "Clothes wash",
      "phone_call": "Phone call",
      "post": "Post",
      "other": "Other"
    },
    "statuses": {
      "active": "active",
      "closed": "closed"
    }
  };

  // Go back to previous scroll pos when returning to home page from post/create post
  var prevScroll;
  $transitions.onSuccess({}, function (transition) {
    if (transition.from().name === 'home' && _.includes(['post', 'create-post'], transition.to().name)) {
      prevScroll = document.documentElement.scrollTop;
      document.documentElement.scrollTop = 0;
    }
    else if (prevScroll !== undefined && _.includes(['post', 'create-post'], transition.from().name) && transition.to().name === 'home') {
      $timeout(function () { // Needed if using native back button
        document.documentElement.scrollTop = prevScroll;
        prevScroll = undefined;
      });
    }
    else {
      prevScroll = undefined;
      document.documentElement.scrollTop = 0;
    }
  });
    
});
