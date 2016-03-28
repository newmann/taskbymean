'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * ActiveAttend Schema
 *
 */
var ActiveAttendSchema = new Schema({
  fromdate: {
    type: Date,
    default: Date.now,
    required:'The FromeDate cannot be blank'
  },
  todate: {
    type: Date,
    default:Date.now,
    required:'The ToDate cannot be blank'
  },
  dest: {
    type: String,
    default: '',
    trim: true,
    required: 'Address cannot be blank'
  },
  remark: {
    type: String,
    default: '',
    trim: true
  },
  attendance: {
    type: Schema.ObjectId,
    ref: 'Attendance'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});




mongoose.model('ActiveAttend', ActiveAttendSchema);
