const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  id: String,
  companyname: String,
  printname: String,
  corporateid: String,
  address1: String,
  address2: String,
  countryid: String,
  stateid: String,
  cityid: String,
  zipcode: String,
  phone: String,
  mobile: String,
  fax: String,
}, {collection:'Company'});

module.exports = mongoose.model('Company', companySchema);
