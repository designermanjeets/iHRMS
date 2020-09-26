const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
