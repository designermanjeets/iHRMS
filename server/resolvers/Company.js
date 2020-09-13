const { Company } = require('../models/index');

const mutation = {
  createCompany:(_, {
    companyname,
    printname,
    corporateid,
    address1,
    address2,
    countryid,
    stateid,
    cityid,
    zipcode,
    phone,
    mobile,
    fax,
    email,
    website,
    financialbegindate,
    booksbegindate,
    cinno,
    panno,
    gstin,
    currencyid,
    Createdby,
    createdon,
    createdip,
    modifiedby,
    modifiedon,
    modifiedip,
    alias
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const company = await Company.findOne({$or:[ { corporateid},{companyname} ]})
    if (company) {
      reject('company already exist');
    } else {
      const newCompany = await Company.create({
        companyname,
        printname,
        corporateid,
        address1,
        address2,
        countryid,
        stateid,
        cityid,
        zipcode,
        phone,
        mobile,
        fax,
        email,
        website,
        financialbegindate,
        booksbegindate,
        cinno,
        panno,
        gstin,
        currencyid,
        Createdby,
        createdon,
        createdip,
        modifiedby,
        modifiedon,
        modifiedip,
        alias
      })
      resolve(newCompany);
    }
  }),

  updateCompany:(_, {
    companyname,
    printname,
    address1,
    address2,
    countryid,
    corporateid,
    stateid,
    cityid,
    zipcode,
    phone,
    mobile,
    fax,
    email,
    website,
    financialbegindate,
    booksbegindate,
    cinno,
    panno,
    gstin,
    currencyid,
    modifiedby,
    modifiedon,
    modifiedip,
    alias
  },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param ={
        companyname,
        printname,
        address1,
        address2,
        countryid,
        stateid,
        cityid,
        zipcode,
        phone,
        mobile,
        fax,
        email,
        website,
        financialbegindate,
        booksbegindate,
        cinno,
        panno,
        gstin,
        currencyid,
        modifiedby,
        modifiedon,
        modifiedip,
        alias
      }
      console.log(corporateid)
      const comp = await Company.findOne({ "corporateid": corporateid });
      if (!comp)throw new Error('Company not found!!')
      if(comp) {
        await Company.findOneAndUpdate({
          "corporateid": corporateid
        },{$set:{...param}},{new: true})
          .then((result) => {
            resolve(result);
          })
      }
    }catch(error){
      reject(error);
    }
  }),

  deleteCompany:(_, { corporateid },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param = { corporateid }
      console.log(corporateid)
      const comp = await Company.findOne({ "corporateid": corporateid });
      if (!comp)throw new Error('Company not found!!')
      if(comp) {
        await Company.deleteOne({ "corporateid": corporateid }, {new: true})
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
