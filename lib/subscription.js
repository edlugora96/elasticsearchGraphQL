const { withFilter } = require("apollo-server")
const { pubsub } = require("../utils")

const DRONE_MOVED = "DRONE_MOVED"
module.exports = {
  getUser: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(DRONE_MOVED),
      payload => {
        return payload === "Hello World"
      }
    ),
    resolve: data => {
      console.log(data)
      return data
    },
  },
}
