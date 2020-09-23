const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');

function serialize(value) {
  return value || null;
}

function parseLiteral(ast) {
  return ast.kind === Kind.STRING || null;
}

module.exports = new GraphQLScalarType({
  name: 'FileUpload',
  description: 'JavaScript Uploader',
  serialize
});
