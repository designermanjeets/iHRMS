const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer, AuthenticationError, graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const jwt = require('jsonwebtoken')
const {typeDefs,resolvers} = require('./schema');

mongoose.connect('mongodb://localhost:27017/ihrms');
require('dotenv').config()

const SECRET = "mscreativepixelms";


const app = express();
app.use(cors());
app.use(bodyParser.json())


const Authorization = async req => {
    let token = req.headers['accesstoken']
    if(token)token = token.split(" ")[1];// console.log("___token",token)
    console.log("___token1",req.headers['accesstoken'])
    if (token || token=='null') {
        try {
            if(req.body.operationName=="login")return
            console.log("___token2",await jwt.verify(token, SECRET))
            return await jwt.verify(token, SECRET);//
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
