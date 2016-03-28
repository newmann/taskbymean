'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    Bluebird = require('bluebird'),
  mongoose = Bluebird.promisifyAll(require('mongoose')),
  Attendance = mongoose.model('Attendance'),
  ActiveAttend = mongoose.model('ActiveAttend'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

//mongoose.Promise = global.Promise;
/**
 * Create a Attendance
 */
exports.create = function (req, res) {
  var attendance = new Attendance(req.body);
  attendance.user = req.user;

  attendance.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //save to Active Attend, if exists,update it.
        saveActiveAttend(attendance,function (err){
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(attendance);
          }

        });
    }
  });
};
/**
  save a serial active attendances to ActiveAttend
 */
function saveActiveAttend(attend,cb){
  //save to Active Attend, if exists,update it.
  var activeAttend = new ActiveAttend();
  activeAttend.user = attend.user;
  activeAttend.fromdate = attend.fromdate;
  activeAttend.todate = attend.todate;
  activeAttend.dest = attend.dest;
  activeAttend.remark = attend.remark;
  activeAttend.attendance = attend._id;

  ActiveAttend.findAsync({'user':attend.user,'fromdate':{$gte:attend.fromdate},'todate':{$lte:attend.todate}})
      .then(function(findRows){
          var localRow;
          var findIDs=[];
          for (localRow in findRows){
            findIDs.push(localRow._id);
          }
          return ActiveAttend.removeAsync({'_id':{$in:findIDs}});
        }).then(function(){
          return ActiveAttend.findOneAndUpdateAsync({'user':attend.user,'formdate':{$lt:attend.fromdate},'todate':{$gt:attend.fromdate,$lt:attend.todate}},{'todate':attend.fromdate});
        }).then(function(){
          return ActiveAttend.findOneAndUpdateAsync({'user': attend.user,
          'formdate': {$gt: attend.todate, $lt: attend.fromdate},'todate': {$gt: attend.todate}
        }, {'fromdate': attend.todate});
        })
      .catch(function(err){
        cb(err);
      });


  //ActiveAttend.find({'user':attend.user,'fromdate':{$gte:attend.fromdate},'todate':{$lte:attend.todate}}).exec(function(err,coveredRows){
  //  var coveredRow;
  //  if (err){
  //    cb(err);
  //  } else {
  //    for (coveredRow in coveredRows){
  //      ActiveAttend.findByIdAndRemove(coveredRow._id);
  //    }
  //  }
  //});
  //ActiveAttend.findOneAndUpdate({'user':attend.user,'formdate':{$lt:attend.fromdate},'todate':{$gt:attend.fromdate,$lt:attend.todate}},{'todate':attend.fromdate},function(err,coveredRow) {
  //      if (err) {
  //        cb(err);
  //      } else {
  //        ActiveAttend.findOneAndUpdate({
  //          'user': attend.user,
  //          'formdate': {$gt: attend.todate, $lt: attend.fromdate},
  //          'todate': {$gt: attend.todate}
  //        }, {'fromdate': attend.todate}, function (err, coveredRow) {
  //          if (err) {
  //            cb(err);
  //          } else {
  //            activeAttend.save(function (err) {
  //              if (err) {
  //                cb(err);
  //              } else {
  //                cb(null);
  //              }
  //            });
  //          }
  //        });
  //      }
  //    }
  //  );
}
/**
 * Show the current Attendance
 */
exports.read = function (req, res) {
  res.json(req.attendance);
};

/**
 * Update a Attendance
 */
exports.update = function (req, res) {
  var attendance = req.attendance;

  attendance.fromdate = req.body.fromdate;
  attendance.todate = req.body.todate;
  attendance.dest = req.body.dest;
  attendance.remark = req.body.remark;

  Attendance.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(attendance);
    }
  });
};

/**
 * Delete an Attendance
 */
exports.delete = function (req, res) {
  var attendance = req.attendance;

  attendance.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(attendance);
    }
  });
};

/**
 * List of Attendances
 */
exports.list = function (req, res) {
  Attendance.find().sort('-created').populate('user', 'displayName').exec(function (err, attendances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(attendances);
    }
  });
};

/**
 * Attendance middleware
 */
exports.attendanceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Attendance is invalid'
    });
  }

  Attendance.findById(id).populate('user', 'displayName').exec(function (err, attendance) {
    if (err) {
      return next(err);
    } else if (!attendance) {
      return res.status(404).send({
        message: 'No Attendance with that identifier has been found'
      });
    }
    req.attendance = attendance;
    next();
  });
};
