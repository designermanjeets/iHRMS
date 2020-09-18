const { mergeResolvers } = require("merge-graphql-schemas");

const User  = require('./User');
const Company  = require('./Company');
const Holiday  = require('./Holiday');


const resolvers = [ User.mutation, Company.mutation, Holiday.mutation ];
module.exports = mergeResolvers(resolvers);
