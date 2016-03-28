'use strict';

/**
 * Module dependencies.
 */
var attendancesPolicy = require('../policies/attendances.server.policy'),
  activeAttend = require('../controllers/active-attends.server.controller');

module.exports = function (app) {
  // active attendances collection routes
  app.route('/api/acitveAttends').all(attendancesPolicy.isAllowed)
    .get(activeAttend.listByUseridAndDate);
};
