const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const holidaySchema = new Schema({
  id: String,
  title: String,
  date: Date,
  day: String,
  paid: String

}, {collection:'Holiday'});

module.exports = mongoose.model('Holiday', holidaySchema);