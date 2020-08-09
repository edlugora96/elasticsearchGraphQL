require("dotenv").config()
const { ApolloServer } = require("apollo-server")

const {
  resolvers,
  typeDefs,
  dataSources,
  schemaDirectives,
  context,
  subscriptions,
} = require("./lib")

require("./mqttServer")

const { MqttAgent } = require("./services")
const agent = new MqttAgent()
agent.permanentSensor()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  schemaDirectives,
  subscriptions,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
