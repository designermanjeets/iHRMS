const { Designation, Audit, User } = require('../../models/index');

const mutation = {
  createDesignation:(_, {
    designation,
    department,
    department_ID,
    created_at,
    created_by
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const desig = await Designation.findOne({$or:[ {designation} ]})
    console.log(department_ID)
    if (desig) {
      reject('Designation already exist');
    } else {
      const newDesignation = await Designation.create({
        designation,
        department,
        department_ID,
        created_at,
        created_by
      })
      const nmodified = {
        newDesig_ID: newDesignation._id,
        action: 'Designation Created',
        created_by: created_by,
        created_at: created_at,
        createdDesignation: newDesignation
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { desigAudit: nmodified  }  }, { new: true })
            .then((result) => {
              resolve(result);
            });
        } else {
          Audit.create({ desigAudit: nmodified  })
            .then((result) => {
              resolve(result);
            });
        }
        resolve(result);
      });
      resolve(newDesignation);
    }
  }),

  updateDesignation:(_, {
    id,
    designation,
    department,
    modified,
    department_ID,
    leavetype
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const dtype = await Designation.findById(id);
    try{
      let param = { designation, department, department_ID }
      let changeFields = {};
      for ( item in param) {
        if(param[item] && param[item] !== dtype[item]) {
          changeFields[item] = param[item];
        }
      }
      const ltype = await Designation.findOne({$or:[ {_id: id}, {designation}]});
      if (!ltype) throw new Error('Designation not found!!')
      if(ltype) {
        await Designation.findByIdAndUpdate(id,
          {$set:{...param},
            $push: { 'modified': modified, } },
          {new: true}
          )
          .then((result) => {
            if(result.leavetype.length) {
              let foundOne = false;
              result.leavetype.forEach(l => {
                if(l.leave_ID === leavetype[0].leave_ID) {
                  console.log('Leave Type Exits so Update')
                  l.leavetype = leavetype[0].leavetype;
                  l.leavedays = leavetype[0].leavedays // Don't overwrite from Designation but still
                  foundOne = true;
                  return true;
                }
              })
              if (!foundOne) {
                  console.log('No Leave Type Exist! Just Push the Leave Object')
                  result.leavetype.push(leavetype[0])
              }
              result.save();
            } else {
              result.leavetype.push(leavetype[0]);
              result.save();
            }

            User.updateMany(
              {"designation": designation},
              { $set: { department: department, department_ID: department_ID}  }, { new: true }).then();

            if(result && Object.keys(changeFields).length !== 0) {
              const nmodified = {
                design_ID: dtype._id,
                modified_by: modified[0].modified_by,
                modified_at: modified[0].modified_at,
                action: 'Changed',
                changedObj: changeFields,
                oldDesignData: dtype
              }
              Audit.find({}).then(val =>{
                if(val.length) {
                  Audit.findOneAndUpdate(
                    { },
                    { $push: { desigAudit: nmodified  }  }, { new: true })
                    .then((result) => {
                      resolve(result);
                    });
                } else {
                  Audit.create({ desigAudit: nmodified  })
                    .then((result) => {
                      resolve(result);
                    });
                }
                resolve(result);
              });
            } else {
              resolve(result);
            }
          })
      }
    } catch(error){
      reject(error);
    }
  }),

  deleteDesignation:(_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const ltype = await Designation.findById(id);
      if (!ltype) throw new Error('Designation not found!!')
      if(ltype) {
        await Designation.findByIdAndDelete(id)
          .then((result) => {
            const nmodified = {
              design_ID: ltype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Designation Deleted!',
              deletedDesignation: ltype
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { desigAudit: nmodified  }  }, { new: true })
                  .then((result) => {
                    resolve(result);
                  });
              } else {
                Audit.create({ desigAudit: nmodified  })
                  .then((result) => {
                    resolve(result);
                  });
              }
            });
            resolve(result);
          })
      }
    } catch(error){
      reject(error);
    }
  })
}

module.exports = { mutation };
