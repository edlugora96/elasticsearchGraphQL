const mosca = require("mosca")

const server = new mosca.Server({
  port: 1883,
})

server.on("ready", function () {
  console.log("Broker is ready")
})

/* 
server.on("published", ({ topic }) => {
  console.log("topic: " + topic)
})

server.on("subscribed", (some, client) => {
  console.log(some, client.id)
})

server.on("clientConnected", some => {
  console.log("Client connected: " + some.id)
})
 */
