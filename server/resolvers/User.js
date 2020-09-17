const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { Order, User } = require('../models/index');
const { promisify } = require('../helpers');
const ObjectId = mongoose.Types.ObjectId;


const resolvers = {
  company: (company, args) => promisify(Order.find({_id: {$in: company.orders}}))
};

const mutation ={
  signup:(_, {
      username,
      email,
      password,
      firstname,
      lastname,
      role,
      emmpid,
      corporateid,
      mobile,
      joiningdate,
      permissions
    },{me,secret}) => new Promise(async (resolve, reject) => {
      const user = await User.findOne({$or:[ { email},{username}, {emmpid} ]})
      if (user) {
        reject('user already exist');
      } else {
        const newUser = await User.create({
              username,
              email,
              password: await bcrypt.hash(password, 10),
              firstname,
              lastname,
              role,
              emmpid,
              corporateid,
              mobile,
              joiningdate,
              permissions
            }
          )
        createToken({ id: newUser.id,role:newUser.role,username:newUser.username, emmpid},secret,'1')
        resolve(newUser);
      }
  }),
  login:(_, { email, password },{ me, secret }) => new Promise(async (resolve, reject) => {
      const user = await User.findOne({email})
      if (!user) {
        reject({data: 'No user with that email'})
      } else {
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          reject({data: 'Incorrect password'})
        } else {
          const token = await createToken({ id: user.id,email:user.email,role:user.role,username:user.username, emmpid:user.emmpid},secret,'1y')
          resolve({ token, user });
        }
      }
  }),
  updateUser:(_, { id,username, email, password,role, firstname, lastname, emmpid, corporateid, mobile, joiningdate, permissions},{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const getuser = await User.findOne({email });
      let param ={username, email, password,role, firstname, lastname, emmpid, corporateid, mobile, joiningdate, permissions}
      if(getuser) {
        if(password !== getuser.password) {
          param.password= await bcrypt.hash(password, 10)
        }
      }
        const user = await User.findByIdAndUpdate(id,{$set:{...param}},{new: true})
          .then((result) => { resolve(result) })
    } catch(error){
        reject(error);
    }
  }),
  deleteUser:(_, { email },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      let param = { email }
      const comp = await User.findOne({ "email": email });
      if (!comp)throw new Error('User not found!!')
      if(comp) {
        await User.deleteOne({ "email": email }, {new: true})
          resolve({User});
      }
    } catch(error){
      reject(error);
    }
  })
}

// _________  //

const createToken= async (user, secret, expiresIn) => {
  const { id, email, username, role, emmpid } = user;
  return await jsonwebtoken.sign({ id, email, username, role, emmpid }, secret, {
    expiresIn,
  });
};

module.exports = { mutation, resolvers };
