const { LeaveType } = require('../models/index');

const mutation = {
  createLeaveType:(_, {
    leavetype,
    leavedays,
    carryforward,
    status,
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const leave = await LeaveType.findOne({$or:[ {leavetype} ]})
    if (leave) {
      reject('LeaveType already exist');
    } else {
      const newLeaveType = await LeaveType.create({
        leavetype,
        leavedays,
        carryforward,
        status
      })
      resolve(newLeaveType);
    }
  }),

  updateLeaveType:(_, {
    id,
    leavetype,
    leavedays,
    carryforward,
    status,
  },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param ={
        leavetype,
        leavedays,
        carryforward,
        status,
      }
      const ltype = await LeaveType.findById(id);
      if (!ltype) throw new Error('LeaveType not found!!')
      if(ltype) {
        await LeaveType.findByIdAndUpdate(id,{$set:{...param}},{new: true})
          .then((result) => { resolve(result) })
      }
    } catch(error){
      reject(error);
    }
  }),

  deleteLeaveType:(_, { id },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const ltype = await LeaveType.findById(id);
      if (!ltype) throw new Error('LeaveType not found!!')
      if(ltype) {
        await LeaveType.findByIdAndDelete(id)
          .then((result) => {
            resolve(result);
          })
      }
    } catch(error){
      reject(error);
    }
  })
}

module.exports = { mutation };
