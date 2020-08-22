const { queryById, queryMatch, outParser } = require("../../../../utils")
module.exports = async ({ ID }, __, { dataSources }) => {
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
