const Query = require("./queries")
const Mutation = require("./mutations")
const Subscription = require("./subscription")
const Types = require("./types")

module.exports = {
  Query,
  Mutation,
  Subscription,
  ...Types,
}
