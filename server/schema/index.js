// const {makeExecutableSchema} = require('graphql-tools');
const Query = require('../resolvers/Query');
// const { User, Company, Holiday } = require ('../resolvers/index');
const Mutation = require('../resolvers/Mutation');
const ISODate = require('../scalars/ISODate');

const typeDefs = `
  type Query {
    user(email: String!): User
    users(query: Pagination!): [User]
    userCount(query: Pagination!): Int
    me: User,
    getCompany(corporateid: String!): Company
    getCompanies(query: Pagination!): [Company]
    getHolidays(query: Pagination!): [Holiday]
    getLeaveTypes(query: Pagination!): [LeaveType]
    getDesignations(query: Pagination!): [Designation]
  }

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
      created_by: String,
      created_at: ISODate
    ): User,
    login (email: String!, password: String!): customUser,
    deleteUser (email: String!, modified: [modifiedInputs]): User,
    changePassword (
      id: ID!,
      oldPassword: String!,
      newPassword: String!,
      email: String!
    ): ChangePasswordUser,
    createCompany (
      companyname: String,
      printname: String,
      corporateid: String,
      address1: String,
      address2: String,
      countryid: String,
      stateid: String,
      cityid: String,
      zipcode: String,
      phone: String,
      mobile: String,
      fax: String,
      email: String,
      website: String,
      financialbegindate: String,
      booksbegindate: String,
      cinno: String,
      panno: String,
      gstin: String,
      currencyid: String,
      Createdby: String,
      createdon: String,
      createdip: String,
      modifiedby: String,
      modifiedon: String,
      modifiedip: String,
      alias: String
    ): Company,
    updateUser(
      id:ID,
      username: String!,
      email: String,
      password: String,
      role: String,
      firstname: String,
      lastname: String,
      role: String,
      emmpid:String,
      corporateid: String,
      mobile: String,
      joiningdate: ISODate,
      permissions: PermissionsInput,
      modified: [modifiedInputs]
      ): User,
    updateCompany(
      companyname: String,
      printname: String,
      corporateid: String,
      address1: String,
      address2: String,
      countryid: String,
      stateid: String,
      cityid: String,
      zipcode: String,
      phone: String,
      mobile: String,
      fax: String,
      email: String,
      website: String,
      financialbegindate: String,
      booksbegindate: String,
      cinno: String,
      panno: String,
      gstin: String,
      currencyid: String,
      Createdby: String,
      modifiedby: String,
      modifiedon: String,
      modifiedip: String,
      alias: String
    ): Company,
    deleteCompany( corporateid: String ): Company,
    createHoliday (
      title: String,
      date: ISODate,
      day: String,
      paid: String,
    ): Holiday,
    updateHoliday(
      id: ID!,
      title: String,
      date: ISODate,
      day: String,
      paid: String,
    ): Holiday,
    deleteHoliday( id: ID! ): Holiday,
    createLeaveType (
      leavetype: String,
      leavedays: String,
      carryforward: String,
      status: String,
    ): LeaveType,
    updateLeaveType(
      id: ID!,
      leavetype: String,
      leavedays: String,
      carryforward: String,
      status: String,
    ): LeaveType,
    deleteLeaveType( id: ID! ): LeaveType,
    createDesignation (
      designation: String!,
      department: String,
      created_at: ISODate,
      created_by: String
    ): Designation,
    updateDesignation(
      id: ID!,
      designation: String!,
      department: String,
      modified: [modifiedInputs]
    ): Designation,
    deleteDesignation( id: ID!, modified: [modifiedInputs] ): Designation,
    uploadFile(file: Upload!): File,
    insertManyUsers(input: [UserInput]!): CreateUsersPayload,
    userAuditMutation(
      id: ID!,
      email: String,
      username: String,
      emmpid: String,
      created_by: String,
      modified_by: String,
      action: String,
      comments: String,
      created_at: ISODate,
      modified_at: ISODate
     ): userAudit,
   desigAuditMutation(
      id: ID!,
      designation: String,
      department: String,
      created_by: String,
      modified_by: String,
      action: String,
      comments: String,
      created_at: ISODate,
      modified_at: ISODate
     ): desigAudit
  }
  type CreateUsersPayload {
    users: [User]
  },
  type meta {
    createdAt:String
    updatedAt:String
  }
  type File {
    id: ID!
    path: String
    filename: String
    mimetype: String
  }
  type customUser{
    token:String,
    user:User
  },
  type ChangePasswordUser{
    _id: ID!
    oldPassword:String,
    newPassword:String,
    email: String,
    user:User
  },
  type Company {
    _id: ID!,
    companyname: String,
    printname: String,
    corporateid: String,
    address1: String,
    address2: String,
    countryid: String,
    stateid: String,
    cityid: String,
    zipcode: String,
    phone: String,
    mobile: String,
    fax: String,
    email: String,
    website: String,
    financialbegindate: String,
    booksbegindate: String,
    cinno: String,
    panno: String,
    gstin: String,
    currencyid: String,
    Createdby: String,
    createdon: String,
    createdip: String,
    modifiedby: String,
    modifiedon: String,
    modifiedip: String,
    alias: String
  }
  input CompanyInput {
    companyname: String,
    printname: String,
    corporateid: String,
    address1: String,
    address2: String,
    countryid: String,
    stateid: String,
    cityid: String,
    zipcode: String,
    phone: String,
    mobile: String,
    fax: String,
    email: String,
    website: String,
    financialbegindate: String,
    booksbegindate: String,
    cinno: String,
    panno: String,
    gstin: String,
    currencyid: String,
    Createdby: String,
    createdon: String,
    createdip: String,
    modifiedby: String,
    modifiedon: String,
    modifiedip: String,
    alias: String
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
  type Designation {
    _id: ID,
    designation: String!,
    department: String,
    created_at: ISODate,
    modified: [modifiedTypes]
  },
  type LeaveType {
    _id: ID,
    leavetype: String!,
    leavedays: String!,
    carryforward: String,
    status: String,
  },
  type userAudit {
    id: ID!,
    email: String,
    username: String,
    emmpid: String,
    modified_by: String,
    action: String,
    changedObj: User,
    modified_at: ISODate
  },
  type desigAudit {
    id: ID!,
    email: String,
    username: String,
    designation: String,
    department: String,
    modified_by: String,
    action: String,
    comments: String,
    modified_at: ISODate
  },
  input modifiedInputs {
    modified_by: String
    modified_at: ISODate
  },
  input Pagination {
    query:String,
    argument:String
    offset: Int,
    limit: Int,
    sortBy:String,
    descending:Int,
    search:String
    dates:Dates
  }
  input Dates{
    gte:String,
    lt:String,
    bool:Boolean
  }
  input UserInput {
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
    permissions: PermissionsInput
  }
  scalar ISODate
`;

const resolvers = { Query, Mutation,ISODate };

module.exports =  { typeDefs, resolvers }
