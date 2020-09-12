const { mergeResolvers } = require("merge-graphql-schemas");

const User  = require('./User');
const Company  = require('./Company');


const resolvers = [ User.mutation, Company.mutation ];
module.exports = mergeResolvers(resolvers);
