const { mergeResolvers } = require("merge-graphql-schemas");

const User  = require('./user/User');
const Company  = require('./Company');
const Holiday  = require('./Holiday');
const LeaveType  = require('./LeaveType');

const resolvers = [ User.mutation, Company.mutation, Holiday.mutation, LeaveType.mutation ];
module.exports = mergeResolvers(resolvers);
