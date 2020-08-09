const { queryMatch, queryDeleteById } = require("../../../../utils")
module.exports = async (_, { id }, { dataSources }, ____) => {
  const index = "users"
  let response = {}
  try {
    const exists = await dataSources.dbsAPI.searchByID({
      index: "users",
      query: id,
    })
    if (exists.hits.hits.length < 1) {
      throw new Error("There is an error with the user")
    }

    let usersRelation = await dataSources.dbsAPI.search({
      index: "users_projects",
      body: queryMatch("userID", id),
    })
    const project = usersRelation.body.hits.hits.map(user => {
      return user._source.projectID
    })
    usersRelation = usersRelation.body.hits.hits.map(user => {
      return user._id
    })
    project.map(projectId => {
      deleteProjectQuery({ id: projectId, dataSources })
    })
    dataSources.dbsAPI.deleteByQuery({
      index: "users_projects",
      body: queryDeleteById(usersRelation),
    })
    const { body } = await dataSources.dbsAPI.delete({
      index,
      id,
    })

    response = {
      ID: id,
      // result: "ahi fue",
      result: body.result,
    }
  } catch (err) {
    throw err
  }
  return response
}
