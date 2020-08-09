const { withFilter } = require("apollo-server")
const { pubsub } = require("../../../../utils")

const DATA_SENSOR = "DATA_SENSOR"
module.exports = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(DATA_SENSOR),
    ({ sensorId }, { query }) => {
      return sensorId === query
    }
  ),
  resolve: data => {
    return data.value
  },
}
