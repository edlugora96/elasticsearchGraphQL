module.exports = async (_, { id }, { dataSources }, ____) => {
  let response = {}
  try {
    const exists = await dataSources.dbsAPI.searchByID({
      index: "projects",
      query: id,
    })
    if (exists.hits.hits.length < 1) {
      throw new Error("There is an error with the project")
    }
    response = await deleteProjectQuery({ id, dataSources })
  } catch (err) {
    throw err
  }
  return response
}
