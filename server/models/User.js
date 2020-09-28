const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Schema = mongoose.Schema;

const leaveTypesSchema = mongoose.Schema({
  leavetype: String,
  leave_ID: String,
  leavedays: String,
  carryforward: String,
  status: String
}, { strict: false});

const designationSchema = new Schema({
  designation: String,
  department: String,
  department_ID: String,
  created_at: Date,
  created_by: String,
  leavetype: [leaveTypesSchema]
}, { strict: false});

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const userSchema = new Schema({
  username: String,
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  role: String,
  emmpid:String,
  corporateid: String,
  mobile: String,
  joiningdate: Date,
  department: String,
  department_ID: String,
  designation: designationSchema,
  designation_ID: String,
  permissions:{
    employee: {
      read: Boolean,
      write: Boolean,
      create: Boolean,
      delete: Boolean,
      import: Boolean,
      export: Boolean
    },
    holiday:{
      read: Boolean,
      write: Boolean,
      create: Boolean,
      delete: Boolean,
      import: Boolean,
      export: Boolean
    },
    leaves:{
      read: Boolean,
      write: Boolean,
      create: Boolean,
      delete: Boolean,
      import: Boolean,
      export: Boolean
    },
    events:{
      read: Boolean,
      write: Boolean,
      create: Boolean,
      delete: Boolean,
      import: Boolean,
      export: Boolean
    }
  },
  created_at: Date,
  modified : [subSchema],
}, {collection:'User'});


module.exports = mongoose.model('User', userSchema);
