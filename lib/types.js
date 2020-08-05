const { queryById, queryMatch, outParser } = require("../utils")

const owner = async ({ ID }, __, { dataSources }) => {
  const payload = await dataSources.dbsAPI.search({
    index: "users_projects",
    body: queryMatch("projectID", ID),
  })
  const ownersIDs = payload.body.hits.hits.map(project => {
    return project._source.userID
  })
  const { body } = await dataSources.dbsAPI.search({
    index: "users",
    body: queryById(ownersIDs),
  })
  return outParser(body)
}
const project = async ({ ID, ...rest }, __, { dataSources }) => {
  const payload = await dataSources.dbsAPI.search({
    index: "projects_gadgets",
    body: queryMatch("gadgetID", ID),
  })
  const projectsIDs = payload.body.hits.hits.map(project => {
    return project._source.projectID
  })
  const { body } = await dataSources.dbsAPI.search({
    index: "projects",
    body: queryById(projectsIDs),
  })
  return outParser(body)
}

const gadgets = async ({ ID, ...rest }, __, { dataSources }) => {
  const payload = await dataSources.dbsAPI.search({
    index: "projects_gadgets",
    body: queryMatch("projectID", ID),
  })
  const gadgetsIDs = payload.body.hits.hits.map(project => {
    return project._source.gadgetID
  })
  const { body } = await dataSources.dbsAPI.search({
    index: "gadgets",
    body: queryById(gadgetsIDs),
  })
  return outParser(body, false)
}
const projects = async ({ ID }, __, { dataSources }) => {
  const payload = await dataSources.dbsAPI.search({
    index: "users_projects",
    body: queryMatch("userID", ID),
  })
  const projectsIDs = payload.body.hits.hits.map(project => {
    return project._id
  })
  const { body } = await dataSources.dbsAPI.search({
    index: "projects",
    body: queryById(projectsIDs),
  })
  return outParser(body, false)
}

module.exports = {
  User: {
    gadgets,
    projects,
  },
  Project: {
    gadgets,
    owner,
  },
  Gadget: {
    project,
    owner,
  },
  GlobalSearch: {
    __resolveType: entity => {
      if (entity.birthday) {
        return "User"
      }
      if (entity.active) {
        return "Gadget"
      }
      return "Project"
    },
  },
}
