const { pubsub } = require("../../../../utils")
module.exports = async (_, { body }, ___, ____) => {
  pubsub.publish(body.topic, body.payload)
}
