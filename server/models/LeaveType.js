const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LeaveTypeSchema = new Schema({
  id: String,
  leavetype: String,
  leavedays: Number,
  carryforward: String,
  status: String,

}, {collection:'LeaveType'});

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
