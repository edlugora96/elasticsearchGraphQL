const update = require("./mutations/update.resolver")

const resolvers = {
  Query: {
    searchHighlight: require("./queries/searchHighlight.resolver"),
    login: require("./queries/login.resolver"),
    search: require("./queries/search.resolver"),
    sendToAgent: require("./queries/sendToAgent.resolver"),
  },
  Mutation: {
    createGadget: require("./mutations/createGadget.resolver"),
    createProject: require("./mutations/createProject.resolver"),
    createUser: require("./mutations/createUser.resolver"),
    updateUser: (...arg) => update(...arg, "users"),
    updateProject: (...arg) => update(...arg, "projects"),
    updateGadget: (...arg) => update(...arg, "gadgets"),
    deleteGadget: require("./mutations/deleteGadget.resolver"),
    deleteProject: require("./mutations/deleteProject.resolver"),
    deleteUser: require("./mutations/deleteUser.resolver"),
  },
  Subscription: {
    listenAgent: require("./subscription/listenAgent.resolver"),
  },
  User: {
    gadgets: require("./types/gadgets.type"),
    projects: require("./types/projects.type"),
  },
  Project: {
    gadgets: require("./types/gadgets.type"),
    owner: require("./types/owner.type"),
  },
  Gadget: {
    project: require("./types/project.type"),
    owner: require("./types/owner.type"),
  },
  GlobalSearch: require("./types/globalSearch.type"),
}

module.exports = resolvers
