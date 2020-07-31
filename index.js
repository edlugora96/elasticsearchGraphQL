require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const { resolvers, typeDefs, dataSources } = require("./lib")

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
