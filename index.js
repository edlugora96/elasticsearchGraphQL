require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const {
  resolvers,
  typeDefs,
  dataSources,
  schemaDirectives,
  context,
} = require("./lib")

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  schemaDirectives,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
