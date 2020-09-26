const { LeaveType, Audit } = require('../models/index');

const mutation = {
  createLeaveType:(_, {
    leavetype,
    leavedays,
    carryforward,
    status,
    created_by,
    created_at
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const leave = await LeaveType.findOne({$or:[ {leavetype} ]})
    if (leave) {
      reject('LeaveType already exist');
    } else {
      const newLeaveType = await LeaveType.create({
        leavetype,
        leavedays,
        carryforward,
        status,
        created_by,
        created_at
      })

      const nmodified = {
        newDepart_ID: newLeaveType._id,
        action: 'Leave Type Created',
        created_by: created_by,
        created_at: created_at,
        createdDepartment: newLeaveType
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { leaveTypeAudit: nmodified  }  }, { new: true })
            .then((result) => {
              resolve(result);
            });
        } else {
          Audit.create({ leaveTypeAudit: nmodified  })
            .then((result) => {
              resolve(result);
            });
        }
        resolve(result);
      });

      resolve(newLeaveType);
    }
  }),

  updateLeaveType:(_, {
    id,
    leavetype,
    leavedays,
    carryforward,
    status,
    modified
  },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param ={
        leavetype,
        leavedays,
        carryforward,
        status,
      }
      const ltype = await LeaveType.findById(id);
      let changeFields = {};
      for ( item in param) {
        if(param[item] && param[item] !== ltype[item]) {
          changeFields[item] = param[item];
        }
      }
      if (!ltype) throw new Error('LeaveType not found!!')
      if(ltype) {
        await LeaveType.findByIdAndUpdate(id,{$set:{...param}},{new: true})
          .then((result) => {
            if(result && Object.keys(changeFields).length !== 0) {
              // To Update All Departments LeaveTypes: TO:DO
              const nmodified = {
                leave_ID: ltype._id,
                modified_by: modified[0].modified_by,
                modified_at: modified[0].modified_at,
                action: 'Changed',
                changedObj: changeFields,
                oldLeaveTypeData: ltype
              }
              Audit.find({}).then(val =>{
                if(val.length) {
                  Audit.findOneAndUpdate(
                    { },
                    { $push: { leaveTypeAudit: nmodified  }  }, { new: true }).then(
                      res => resolve(res)
                  );
                } else {
                  Audit.create({ leaveTypeAudit: nmodified  }, { new: true }).then(
                    res => resolve(res)
                  );
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

  deleteLeaveType:(_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const ltype = await LeaveType.findById(id);
      if (!ltype) throw new Error('LeaveType not found!!')
      if(ltype) {
        await LeaveType.findByIdAndDelete(id)
          .then((result) => {
            const nmodified = {
              leave_ID: ltype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Leave Type Deleted!',
              deletedLeave: ltype
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { leaveTypeAudit: nmodified  }  }, { new: true })
                  .then((result) => {
                    resolve(result);
                  });
              } else {
                Audit.create({ leaveTypeAudit: nmodified  })
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
