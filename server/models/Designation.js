const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const designationSchema = new Schema({
  designation: String,
  department: String,
  created_at: Date,
  modified : [subSchema]
}, {collection:'Designation'});


module.exports = mongoose.model('Designation', designationSchema);
