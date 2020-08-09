const { withFilter } = require("apollo-server")
const { pubsub } = require("../../../../utils")

module.exports = {
  subscribe: withFilter(
    ({ query }) => {
      return pubsub.asyncIterator(query.topic)
    },
    ({ agentId }, { query }) => {
      return agentId === query.agent
    }
  ),
  resolve: data => {
    return data.value
  },
}
