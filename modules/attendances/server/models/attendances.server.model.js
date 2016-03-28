'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attendance Schema
 * Attendance history data
 */
var AttendanceSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  fromdate: {
    type: Date,
    required:'The FromeDate cannot be blank'
  },
  todate: {
    type: Date,
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Attendance', AttendanceSchema);

