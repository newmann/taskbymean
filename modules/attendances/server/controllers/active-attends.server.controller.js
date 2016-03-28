'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ActiveAttend = mongoose.model('ActiveAttend'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * List of user's active Attendances
 */
exports.listByUseridAndDate = function (req, res) {
  var userId = req.body("userId");
  var fromDate = req.body('fromDate');
  var toDate = req.body('toDate');

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  ActiveAttend.find({ "user": userId, "fromdate": { "lte": toDate },'todate':{ "gte": fromDate } })
      .populate('user', 'displayName').exec(function (err, activeAttends) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!activeAttends) {
      return res.status(404).send({
        message: 'No Active attendance with that user from:' + fromDate + ' to:" + toDate +" has been found'
      });
    } else {
      res.json(activeAttends);
    }
  });
};


///**
// * Attendance middleware
// */
//exports.activeAttendByUseridAndDate = function (req, res, next, userId,fromDate,toDate) {
//
//  if (!mongoose.Types.ObjectId.isValid(userId)) {
//    return res.status(400).send({
//      message: 'User is invalid'
//    });
//  }
//
//  ActiveAttend.find({"user":userId,"activedate":{"gte":fromDate,"ltg":toDate}})
//      .populate('user', 'displayName').exec(function (err, activeAttends) {
//    if (err) {
//      return next(err);
//    } else if (!activeAttends) {
//      return res.status(404).send({
//        message: 'No Active attendance with that user from:'+fromDate +' to:" + toDate +" has been found'
//      });
//    }
//    req.activeAttends = activeAttends;
//    next();
//  });
//};
