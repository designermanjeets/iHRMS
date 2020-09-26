const { Department, Audit, Designation, User } = require('../../models/index');

const mutation = {
  createDepartment:(_, {
    department,
    created_at,
    created_by
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const desig = await Department.findOne({$or:[ {department} ]})
    if (desig) {
      reject('Department already exist');
    } else {
      const newDepartment = await Department.create({
        department,
        created_at,
        created_by
      })
      const nmodified = {
        newDepart_ID: newDepartment._id,
        action: 'Department Created',
        created_by: created_by,
        created_at: created_at,
        createdDepartment: newDepartment
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { departAudit: nmodified  }  }, { new: true })
            .then((result) => {
              resolve(result);
            });
        } else {
          Audit.create({ departAudit: nmodified  })
            .then((result) => {
              resolve(result);
            });
        }
        resolve(result);
      });
      resolve(newDepartment);
    }
  }),

  updateDepartment:(_, {
    id,
    department,
    modified,
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const dtype = await Department.findById(id);
    try{
      let param = { department }
      let changeFields = {};
      for ( item in param) {
        if(param[item] && param[item] !== dtype[item]) {
          changeFields[item] = param[item];
        }
      }
      const ltype = await Department.findById(id);
      if (!ltype) throw new Error('Department not found!!')
      if(ltype) {
        await Department.findByIdAndUpdate(id,{$set:{...param}, $push: { 'modified': modified  }  },{new: true})
          .then((result) => {
            if(result && Object.keys(changeFields).length !== 0) {

              Designation.updateMany(
                {"department_ID": id},
                { $set: { department: department}  }, { new: true }).then();

              User.updateMany(
                {"department_ID": id},
                { $set: { department: department}  }, { new: true }).then();

              const nmodified = {
                depart_ID: dtype._id,
                modified_by: modified[0].modified_by,
                modified_at: modified[0].modified_at,
                action: 'Changed',
                changedObj: changeFields,
                oldDepartData: dtype
              }
              Audit.find({}).then(val =>{
                if(val.length) {
                  Audit.findOneAndUpdate(
                    { },
                    { $push: { departAudit: nmodified  }  }, { new: true })
                    .then((result) => {
                      resolve(result);
                    });
                } else {
                  Audit.create({ departAudit: nmodified  })
                    .then((result) => {
                      resolve(result);
                    });
                }
                resolve(result);
              });
              resolve(result);
            } else {
              resolve(result);
            }
          })
      }
    } catch(error){
      reject(error);
    }
  }),

  deleteDepartment:(_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const ltype = await Department.findById(id);
      if (!ltype) throw new Error('Department not found!!')
      if(ltype) {
        await Department.findByIdAndDelete(id)
          .then((result) => {
            const nmodified = {
              depart_ID: ltype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Department Deleted!',
              deletedDepartment: ltype
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { departAudit: nmodified  }  }, { new: true })
                  .then((result) => {
                    resolve(result);
                  });
              } else {
                Audit.create({ departAudit: nmodified  })
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
