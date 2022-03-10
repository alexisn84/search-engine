const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

//import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

//no longer needed as we use schemas const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

//place apollo server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  // await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  // console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};


//call startServer
//startServer()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// not needed for apollo server app.use(routes);

//get all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    //console.log(`API server running on port ${PORT}!`);
    
  });
});
