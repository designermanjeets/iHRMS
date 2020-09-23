const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { Order, User, Upload } = require('../models/index');
const { promisify } = require('../helpers');
const ObjectId = mongoose.Types.ObjectId;
const mongodb =  require('mongodb');
const { createWriteStream, mkdir } = require('fs');
const shortid = require('shortid');

let DB;

setTimeout(() => {
  DB = require('../server');
}, 1000)

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
        reject(new Error('user already exist'));
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
  insertManyUsers:(_, { input },{me,secret}) => new Promise(async (resolve, reject) => {

    let users = [];
    let count = 0;

    input.forEach((u) => {
      if(u.username !== 'superadmin') {
        const email = u.email; const username = u.username; const emmpid = u.emmpid;
        User.findOne({$or:[ { email},{username}, {emmpid} ]}).then(function(data){
          if (!data) {
            ++count;
            bcrypt.hash(u.password, 10).then(onfulfilles => {
              u.password = onfulfilles;
              User.create({...u}).then(res => {
                users.push(res);
                if(input.length === count) {
                  resolve({users});
                }
                // createToken({ id: newUser.id,role:newUser.role,username:newUser.username, emmpid},secret,'1')
              })
            }, onrejected => {
              reject(new Error('Password generation failed!'));
            });
          } else {
            ++count;
            resolve(new Error(data.username + ' Username already exists!'));
          }
        })
      } else {
        resolve(new Error('User already Exists!'));
      }
    });
  }),
  login:(_, { email, password },{ me, secret }) => new Promise(async (resolve, reject) => {
      const user = await User.findOne({$or:[ { email: email},{username: email} ]})
      if (!user) {
        reject(new Error('No user with that email or username'));
      } else {
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          reject(new Error('Incorrect password'));
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
      if(getuser && getuser.username !== 'superadmin') {
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
      const user = await User.findOne({ "email": email });
      if (!user) reject( new Error('User not found!!'))
      if(user && user !== 'superadmin') {
        await User.deleteOne({ "email": email }, {new: true})
          resolve({User});
      }
    } catch(error){
      reject(error);
    }
  }),
  changePassword:(_, { id, username, email, oldPassword, newPassword},{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const getuser = await User.findOne({email });
      let param = { username, email, oldPassword, newPassword }
      if(getuser && getuser.username !== 'superadmin') {
        const validOld = await bcrypt.compare(oldPassword, getuser.password);
        const validNew = newPassword !== oldPassword;
        if(validOld) {
          if(validNew) {
            param.password= await bcrypt.hash(newPassword, 10);
            const user = await User.findByIdAndUpdate(id,{ password: param.password },{new: true});
            resolve({user});
          } else {
            reject(new Error('New Password should not be same as Old Password!'))
          }
        } else {
          reject(new Error('Incorrect Old Password!'))
        }
      } else {
        reject(new Error('No User Found!'))
      }
    } catch(error){
      reject(error);
    }
  }),

  uploadFile: async (_, { file },{me,secret}) => new Promise(async (resolve, reject) => {
    mkdir("projects/ihrms/src/assets/uploads/", { recursive: true }, (err) => {
      if (err) throw err;
    });
    const upload = await processUpload(file);
    // save our file to the mongodb
    await Upload.create(upload)
    resolve(upload);
  }),
}
const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `projects/ihrms/src/assets/uploads/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype }))
      .on("error", reject)
  );
};
const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  return await storeUpload({ stream, filename, mimetype });
};

// _________  //

const createToken= async (user, secret, expiresIn) => {
  const { id, email, username, role, emmpid } = user;
  return await jsonwebtoken.sign({ id, email, username, role, emmpid }, secret, {
    expiresIn,
  });
};

module.exports = { mutation, resolvers };
