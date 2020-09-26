const { mergeResolvers } = require("merge-graphql-schemas");

const User  = require('./user/User');
const Company  = require('./Company');
const Holiday  = require('./Holiday');
const LeaveType  = require('./LeaveType');
const Designation  = require('./designation/Designation');
const Department  = require('./department/Department.js');

const resolvers = [
  User.mutation,
  Company.mutation,
  Holiday.mutation,
  LeaveType.mutation,
  Designation.mutation,
  Department.mutation
];
module.exports = mergeResolvers(resolvers);
