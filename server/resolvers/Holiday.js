const { Holiday } = require('../models/index');

const mutation = {
  createHoliday:(_, {
    id,
    title,
    date,
    day,
    paid,
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
      })
      resolve(newHoliday);
    }
  }),

  updateHoliday:(_, {
    id,
    title,
    date,
    day,
    paid,
  },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param ={
        title,
        date,
        day,
        paid,
      }
      const holi = await Holiday.findById(id);
      if (!holi) throw new Error('Holiday not found!!')
      if(holi) {
        await Holiday.findByIdAndUpdate(id,{$set:{...param}},{new: true})
          .then((result) => { resolve(result) })
      }
    } catch(error){
      reject(error);
    }
  }),

  deleteHoliday:(_, { id },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const comp = await Holiday.findById(id);
      if (!comp) throw new Error('Holiday not found!!')
      if(comp) {
        await Holiday.findByIdAndDelete(id)
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
