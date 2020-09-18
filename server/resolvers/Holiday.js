const { Holiday } = require('../models/index');

const mutation = {
  createHoliday:(_, {
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
        title,
        date,
        day,
        paid,
      })
      resolve(newHoliday);
    }
  }),

  updateHoliday:(_, {
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
      const comp = await Holiday.findOne({ "date": date });
      if (!comp)throw new Error('Holiday not found!!')
      if(comp) {
        await Holiday.findOneAndUpdate({
          "date": date
        },{$set:{...param}},{new: true})
          .then((result) => { resolve(result) })
      }
    }catch(error){
      reject(error);
    }
  }),

  deleteHoliday:(_, { date },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param = { date }
      console.log(date)
      const comp = await Holiday.findOne({ "date": date });
      if (!comp) throw new Error('Holiday not found!!')
      if(comp) {
        await Holiday.deleteOne({ "date": date }, {new: true})
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
