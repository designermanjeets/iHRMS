const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
const cors = require('cors');
const { ApolloServer, AuthenticationError, graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const jwt = require('jsonwebtoken')
const {typeDefs,resolvers} = require('./schema');
const { Order, User, Upload, Audit } = require('../server/models/index');

let allDatabases;
const conn = mongoose.connect('mongodb://localhost:27017/ihrms').then((res) =>{
    console.log('listDatabases succeeded');
    // console.log(res.connections[0].db)
    const DB = res.connections[0].db;
    module.exports = DB;
}, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', err => {

});

require('dotenv').config()

const SECRET = "mscreativepixelms";


const app = express();
app.use(cors());
app.use(bodyParser.json())


const Authorization = async req => {
    let token = req.headers['authorization'].split(" ")[1];
    // console.log("___token1",token)
    if (token) {
        try {
          const vtoken = await jwt.verify(token, SECRET);
          // console.log("___token2 ",vtoken)
          const user = await User.findOne({$or:[
              { email: vtoken.email },
              { username:vtoken.username },
              { emmpid: vtoken.emmpid }
          ]})
          if(user.role === vtoken.role) {
            return vtoken;
          } else {
            return new AuthenticationError(
              'Invalid Role. Sign in again.',
            );
          }
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
            );
        }
    }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: `http://localhost:3000/graphql`
    },
    context: async ({req}) => {
        const me = await Authorization(req);
        return {
            me,
            secret:SECRET,
        };
    },
});

server.applyMiddleware({app});

app.listen(3000, () => console.log('Application started on port 3000'));
