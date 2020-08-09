const { queryMatch, queryDeleteById } = require("../../../../utils")
module.exports = async (_, { id }, { dataSources }, ____) => {
  const index = "gadgets"
  let response
  try {
    const {
      body: { hits },
    } = await dataSources.dbsAPI.search({
      index: "projects_gadgets",
      body: queryMatch("gadgetID", id),
    })
    const relation_tables = hits.hits.map(table => {
      return table._id
    })
    dataSources.dbsAPI.deleteByQuery({
      index: "projects_gadgets",
      body: queryDeleteById(relation_tables),
    })
    const { body } = await dataSources.dbsAPI.delete({
      index,
      id,
    })
    response = {
      ID: id,
      result: body.result,
    }
  } catch (err) {
    throw err
  }
  return response
}
