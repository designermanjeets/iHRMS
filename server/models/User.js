const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  role: String,
  emmpid:String,
  company: String,
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
  }
}, {collection:'User'});

module.exports = mongoose.model('User', userSchema);