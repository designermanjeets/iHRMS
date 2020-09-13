const {promisify} = require('../helpers');
const {User,Product,Order,Customer, Company} = require('../models/index.js');
const ISODate = require('../scalars/ISODate');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const paramHandler= (qry)  => {
  let param ={}
  if(qry.argument && qry.query)param= {[qry.argument]: {'$regex':qry.query}}
  if(qry.dates){
    const gte =qry.dates.gte?new Date(qry.dates.gte):null
    let lt =qry.dates.lt?new Date(qry.dates.lt):null
    param.updatedAt={}
    if(gte)param.meta.updatedAt.$gte=gte
    if(lt){
      param.meta.updatedAt.$lte=lt.setDate(lt.getDate()+1)
    }
  }
  return param
};

const resolvers = {

  /************ */
  //
  //    products
  //
  /************ */
  product: (_, args) => promisify(Product.findById(args.id)),
  products : (_, args,context)  => new Promise((resolve, reject) => {
    let sort= { [args.query.sortBy]:args.query.descending}
    if(!args.query.sortBy)sort={'meta.updatedAt':-1}
    const param=paramHandler(args.query)

    Product.find(param,(err, result) => {
        if (err) reject(err);
        else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit).sort(sort)

  }),
  productCount : (_, args,context)  => new Promise((resolve, reject) => {
    const param=paramHandler(args.query)
    Product.find(param,(err, result) => {
        if (err) reject(err);
        else resolve(result);
    }).count()

  }),

  /************ */
  //
  //    Orders
  //
  /************ */

  order: (_, args) => promisify(Order.findById(args.id)),
  orders : (_, args)  => new Promise((resolve, reject) => {
    let sort= { [args.query.sortBy]:args.query.descending}
    if(!args.query.sortBy)sort={'meta.updatedAt':-1}
    const param=paramHandler(args.query)
    if(args.query.search){
      param.$or= [
        { 'products.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.phone': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.city': {'$regex':args.query.search, '$options' : 'i'} },
      ]
      //
    }

    Order.find(param,(err, result) => {
        if (err) reject(err);
        else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit).sort(sort)

  }),
  orderCount:async  (_, args,{me}) => new Promise((resolve, reject) => {
    const param=paramHandler(args.query)
    if(args.query.search){
      param.$or= [
        { 'products.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.phone': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.city': {'$regex':args.query.search, '$options' : 'i'} },
      ]
    }
    Order.find(param,(err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).count()

  }),
  /************ */
  //
  //    customers
  //
  /************ */
  customers: async (_, args) => new Promise((resolve, reject) => {
    const param=paramHandler(args.query)
    if(args.query.search){
      param.$or= [
        { 'products.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.name': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.phone': {'$regex':args.query.search, '$options' : 'i'} },
        { 'customer.city': {'$regex':args.query.search, '$options' : 'i'} },
      ]
    }

  Customer.find(param,(err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit)

  }),
  /************ */
  //
  //    Users
  //
  /************ */
  // user: (_, args) => promisify(User.findById(args.id)),
  user: async (_, args, { me })  => new Promise(async (resolve, reject) => {
    const user = await User.findOne({ "email": args.email });
    if(user) {
      return resolve(user);
    } else {
      return reject({data: 'User Not Found!'})
    }
  }),
  users: async (_, args, { me })  => new Promise(async (resolve, reject) => {
    const param=paramHandler(args.query)
    User.find(param,(err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit)
  }),

  userCount: () => promisify(User.count()),
  me: async (_, args, { me })=> {
    if (!me)throw new Error('You are not authenticated!')// make sure user is logged in
    return await User.findById(me.id) // user is authenticated
  },

  // Company
  getCompany: async (_, args, { me })  => new Promise(async (resolve, reject) => {
    const comp = await Company.findOne({ "corporateid": args.corporateid });
    if(comp) {
      return resolve(comp);
    } else {
      return reject({data: 'Company Not Found!'})
    }
  }),

  getCompanies: async (_, args, { me })  => new Promise(async (resolve, reject) => {
    const param=paramHandler(args.query)
    Company.find(param,(err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit)
  }),

};

module.exports = resolvers;
