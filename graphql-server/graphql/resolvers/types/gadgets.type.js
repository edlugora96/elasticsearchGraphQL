const { queryById, queryMatch, outParser } = require("../../../../utils")
module.exports = async ({ ID }, __, { dataSources }) => {
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
