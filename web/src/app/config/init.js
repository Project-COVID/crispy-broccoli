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

// Array slice filter
angular.module('app').filter('slice', function () {
  return function (array, sliceIndex) {
    return array.slice(0, sliceIndex);
  };
});

// Moment format filter
angular.module('app').filter('moment', function () {
  return function (date, format) {
    if (format === 'timeAgo') {
      return moment(date).fromNow();
    }
    return moment(date).format(format);
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

    if (errors.message !== undefined) {
      errObj.general = errors.message;
      return errObj;
    }

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

  var encodeQueryParams = function (obj) {
    return '?' + _.map(obj, function (value, key) {
      return key + '=' + encodeURIComponent(value);
    }).join('&');
  };

  var getNearestLocation = function (components) {

    // Iterate in order from smallest to largest component, stop at first important one we see
    var location;
    _.forEach(components, function (component) {
      _.forEach(component.types, function (type) {
        if (_.includes(['neighborhood', 'sublocality', 'locality', 'colloquial_area', 'administrative_area_level_5', 'administrative_area_level_4', 'administrative_area_level_3', 'postal_town', 'administrative_area_level_2', 'administrative_area_level_1', 'country'], type)) {
          location = true;
          return false;
        }
      });
      if (location) {
        location = component.long_name;
        return false;
      }
    });

    return location;

  };

  var convertToKm = function (value, unit) {

    if (unit === 'km') {
      return value;
    }

    return value / 1.60934; // Miles to km

  };

  return {
    validateField: validateField,
    parseErrors: parseErrors,
    scrollToError: scrollToError,
    encodeQueryParams: encodeQueryParams,
    getNearestLocation: getNearestLocation,
    convertToKm: convertToKm
  };

});

angular.module('app').service('displayService', function () {
  
  var toast = function (type, err) {

    bulmaToast.toast({
      message: err || 'Oops, something went wrong!',
      type: (type === 'success') ? 'is-success' : 'is-danger',
      duration: 10000,
      position: 'top-center',
      dismissible: true,
      pauseOnHover: true
    });

  };

  return {
    toast: toast
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
