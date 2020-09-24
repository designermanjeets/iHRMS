const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { User, Audit } = require('../models/index');
const ObjectId = mongoose.Types.ObjectId;

const mutation = {
  userAuditMutation: (_, {
    id,
    email,
    username,
    emmpid,
    modified_by,
    action,
    comments,
    modified_at
  }, {me, secret}) => new Promise(async (resolve, reject) => {
    console.log(secret);
    const audit = await Audit.findById({_id: id})

    const newAudit = await Audit.create({
        username,
        email,
        emmpid,
        modified_by,
        action,
        comments,
        modified_at
      }
    )
    resolve(newAudit);
  })
}

module.exports = { mutation };
