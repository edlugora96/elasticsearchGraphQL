const { MQTTPubSub } = require("graphql-mqtt-subscriptions")
const { connect } = require("mqtt")

const client = connect(process.env.MQTT_SERVER, {
  reconnectPeriod: 1000,
})

const pubsub = new MQTTPubSub({
  client,
})

module.exports = { pubsub }
