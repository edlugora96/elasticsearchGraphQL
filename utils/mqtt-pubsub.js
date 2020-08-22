const { MQTTPubSub } = require("graphql-mqtt-subscriptions")
const { connect } = require("mqtt")

const client = connect(process.env.MQTT_SERVER, {
  reconnectPeriod: 1000,
  clientId: process.env.ID_APOLLO_MQTT,
})

const pubsub = new MQTTPubSub({
  client,
})

module.exports = { pubsub }
