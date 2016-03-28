'use strict';

// Setting up route
angular.module('attendances').config(['$stateProvider',
  function ($stateProvider) {
    // Attendances state routing
    $stateProvider
      .state('attendances', {
        abstract: true,
        url: '/attendances',
        template: '<ui-view/>'
      })
      .state('attendances.list', {
        url: '',
        templateUrl: 'modules/attendances/client/views/list-attendances.client.view.html'
      })
      .state('attendances.create', {
        url: '/create',
        templateUrl: 'modules/attendances/client/views/create-attendance.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('attendances.view', {
        url: '/:attendanceId',
        templateUrl: 'modules/attendances/client/views/view-attendance.client.view.html'
      })
      .state('attendances.edit', {
        url: '/:attendanceId/edit',
        templateUrl: 'modules/attendances/client/views/edit-attendance.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
