const { Holiday, Audit } = require('../models/index');

const mutation = {
  createHoliday:(_, {
    id,
    title,
    date,
    day,
    paid,
    created_by,
    created_at
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const holiday = await Holiday.findOne({ "date": date })
    if (holiday) {
      reject('Holiday already exist!');
    } else {
      const newHoliday = await Holiday.create({
        id,
        title,
        date,
        day,
        paid,
        created_by,
        created_at
      });

      const nmodified = {
        newHoliday_ID: newHoliday._id,
        action: 'Holiday Created',
        created_by: created_by,
        created_at: created_at,
        createdHoliday: newHoliday
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { holidayAudit: nmodified  }  }, { new: true })
            .then((res) => resolve(res));
        } else {
          Audit.create({ holidayAudit: nmodified }, { new: true }).then((res) => resolve(res));
        }
        resolve(result);
      });
      resolve(newHoliday);
    }
  }),

  updateHoliday:(_, {
    id,
    title,
    date,
    day,
    paid,
    modified
  },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param ={
        title,
        date,
        day,
        paid,
      }
      const holi = await Holiday.findById(id);
      let changeFields = {};
      for ( item in param) {
        if(param[item] && param[item] !== holi[item]) {
          changeFields[item] = param[item];
          if(item === 'date') {
            if(JSON.stringify(param[item]) !== JSON.stringify(holi[item])) {
              changeFields[item] = param[item];
            } else {
              delete changeFields['date']
            }
          }
        }
      }
      if (!holi) throw new Error('Holiday not found!!')
      if(holi) {
        await Holiday.findByIdAndUpdate(id,{$set:{...param}},{new: true})
          .then((result) => {
            if(result && Object.keys(changeFields).length !== 0) {
              // To Update All Departments LeaveTypes: TO:DO
              const nmodified = {
                holiday_ID: holi._id,
                modified_by: modified[0].modified_by,
                modified_at: modified[0].modified_at,
                action: 'Changed',
                changedObj: changeFields,
                oldHolidayData: holi
              }
              Audit.find({}).then(val =>{
                if(val.length) {
                  Audit.findOneAndUpdate(
                    { },
                    { $push: { holidayAudit: nmodified  }  }, { new: true }).then(
                    res => resolve(res)
                  );
                } else {
                  Audit.create({ holidayAudit: nmodified  }, { new: true }).then(
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

  deleteHoliday:(_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const comp = await Holiday.findById(id);
      if (!comp) throw new Error('Holiday not found!!')
      if(comp) {
        await Holiday.findByIdAndDelete(id)
          .then((result) => {
            const nmodified = {
              holiday_ID: comp._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Holiday Deleted!',
              deletedHoliday: comp
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { holidayAudit: nmodified  }  }, { new: true })
                  .then((res) => resolve(res));
              } else {
                Audit.create({ leaveAudit: nmodified  }, { new: true })
                  .then((res) => resolve(res));
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
