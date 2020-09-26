const User = require('../resolvers/user/User.js');
const Company = require('../resolvers/Company.js');
const Holiday = require('../resolvers/Holiday.js');
const LeaveType = require('../resolvers/LeaveType.js');
const Designation = require('../resolvers/designation/Designation.js');
const Department = require('../resolvers/department/Department.js');

module.exports =  { User, Company, Holiday, LeaveType, Designation, Department };
