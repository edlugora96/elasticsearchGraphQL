require("dotenv").config()
require("./graphql-server")
require("./mqtt-server")

const FakeAgent = require("./services/mqtt-agent")
const fakeSensor = new FakeAgent()

fakeSensor.activate(200)
