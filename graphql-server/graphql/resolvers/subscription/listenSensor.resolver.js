const { withFilter } = require("apollo-server")
const { pubsub } = require("../../../../utils")

const DRONE_MOVED = "DRONE_MOVED"
module.exports = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(DRONE_MOVED),
    ({ locationChanged }, { query }) => {
      return locationChanged.droneId === query
    }
  ),
  resolve: data => {
    return data.locationChanged.droneId
  },
}
