const Query = require("./queries")
const Mutation = require("./mutations")
const Types = require("./types")

module.exports = {
  Query,
  Mutation,
  ...Types,
}
