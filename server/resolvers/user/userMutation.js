const ISODate = require('../../scalars/ISODate');

const typeDefs = `
  type Mutation {
    signup (
      username: String!,
      email: String!,
      password: String!,
      role: String,
      firstname: String,
      lastname: String,
      role: String,
      emmpid:String!,
      corporateid: String!,
      mobile: String,
      joiningdate: ISODate,
      permissions: PermissionsInput,
      created_at: ISODate
    ): User,
  }
  type User {
    _id: ID,
    username: String,
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    role: String,
    emmpid:String,
    corporateid: String,
    mobile: String,
    joiningdate: ISODate,
    permissions: permissions,
    created_at: ISODate,
    modified: [modifiedTypes]
  }
  type permissions {
    holiday:PermissInput,
  }
  type modifiedTypes {
    modified_at: ISODate,
    modified_by: String
  }
  input PermissionsInput {
    holiday:permiss
  }
  type PermissInput {
    read: Boolean,
    write: Boolean,
    create: Boolean,
    delete: Boolean,
    import: Boolean,
    export: Boolean
  }
  input permiss {
    read: Boolean,
    write: Boolean,
    create: Boolean,
    delete: Boolean,
    import: Boolean,
    export: Boolean
  }
  type Holiday{
    _id: ID,
    title: String,
    date: ISODate,
    day:  String,
    paid: String,
  },
  type LeaveType {
    _id: ID,
    leavetype: String!,
    leavedays: String!,
    carryforward: String,
    status: String,
  }
`

const resolvers = { ISODate };
module.exports =  { typeDefs, resolvers }
