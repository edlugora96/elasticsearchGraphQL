/* const mosca = require("mosca")

const server = new mosca.Server({
  port: 1883,
})

server.on("ready", function () {
  console.log("Broker is ready")
})

server.on("clientConnected", async some => {
}) */

const aedes = require("aedes")()
const server = require("net").createServer(aedes.handle)
const port = 1883
const DB = require("../DB")
const dbApi = new DB()

server.listen(port, function () {
  console.log("server started and listening on port ", port)
})

aedes.on("client", async client => {
  const {
    hits: { hits },
  } = await dbApi.searchByID({ query: client.id })
  if (hits.length === 0) {
    client.close()
  }
})
