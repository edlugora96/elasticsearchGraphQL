const { readFileSync } = require("fs")
const { join } = require("path")

module.exports = {
  resolvers: require("./resolver"),
  dataSources: require("./dataSources"),
  typeDefs: readFileSync(join(__dirname, "schema.graphql"), "utf-8"),
  schemaDirectives: require("./directives"),
  context: require("./context"),
  subscriptions: require("./subscriptions"),
}
