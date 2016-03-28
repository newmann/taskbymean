'use strict';

//Attendances service used for communicating with the attendances REST endpoints
angular.module('attendances').factory('Attendances', ['$resource',
  function ($resource) {
    return $resource('api/attendances/:attendanceId', {
      attendanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
