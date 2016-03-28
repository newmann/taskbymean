'use strict';

/**
 * Module dependencies.
 */
var attendancesPolicy = require('../policies/attendances.server.policy'),
  attendances = require('../controllers/attendances.server.controller');

module.exports = function (app) {
  // attendances collection routes
  app.route('/api/attendances').all(attendancesPolicy.isAllowed)
    .get(attendances.list)
    .post(attendances.create);

  // Single attendance routes
  app.route('/api/attendances/:attendanceId').all(attendancesPolicy.isAllowed)
    .get(attendances.read)
    .put(attendances.update)
    .delete(attendances.delete);

  // Finish by binding the attendance middleware
  app.param('attendanceId', attendances.attendanceByID);
};
