const { ForbiddenError } = require ('apollo-server');
const { skip } = require ('graphql-resolvers');

 const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');



   const isAdmin = (parent, args, { me }) =>{
      if(me && me.role==="Admin"){
        return skip 
      }else{
        return new ForbiddenError('Not admin user.');
      }
  }

  module.exports = { isAuthenticated, isAdmin }