'use strict';

// Configuring the attendances module
angular.module('attendances').run(['Menus',
  function (Menus) {
    // Add the attendances dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Attendances',
      state: 'attendances',
      type: 'dropdown',
      roles: ['admin','user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'List Attendances',
      state: 'attendances.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'Create Attendances',
      state: 'attendances.create',
      roles: ['user']
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'Attendances Calendar',
      state: 'attendances.Calendar',
      roles: ['user']
    });

  }
]);
