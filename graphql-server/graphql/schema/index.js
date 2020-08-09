// const { gql } = require("apollo-server-express")
const { gql } = require("apollo-server-express")
const { readFileSync } = require("fs")
const { join } = require("path")
let user = readFileSync(join(__dirname, "user.graphql"), "utf-8")
let project = readFileSync(join(__dirname, "project.graphql"), "utf-8")
let gadget = readFileSync(join(__dirname, "gadget.graphql"), "utf-8")
let login = readFileSync(join(__dirname, "login.graphql"), "utf-8")
let types = readFileSync(join(__dirname, "types.graphql"), "utf-8")
let queries = readFileSync(join(__dirname, "queries.graphql"), "utf-8")
let mutations = readFileSync(join(__dirname, "mutations.graphql"), "utf-8")
let globals = readFileSync(join(__dirname, "globals.graphql"), "utf-8")
let subscriptions = readFileSync(
  join(__dirname, "subscriptions.graphql"),
  "utf-8"
)
const typeDefs = `
${globals}
${user}
${project}
${gadget}
${login}
${types}
${queries}
${mutations}
${subscriptions}
`

module.exports = typeDefs
