const { queryById, queryMatch, outParser } = require("../../../../utils")
module.exports = async ({ ID }, __, { dataSources }) => {
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
