const { Company } = require('../models/index');

const mutation = {
  createCompany:(_, {
    companyname,
    corporateid,
  },{me,secret}) => new Promise(async (resolve, reject) => {
    console.log(companyname)
    console.log(corporateid)
    const company = await Company.findOne({$or:[ { corporateid},{companyname} ]})
    if (company) {
      reject('company already exist');
    } else {
      const newCompany = await Company.create({
        companyname,
        corporateid,
      })
      resolve(newCompany);
    }
  })
}

module.exports = { mutation };
