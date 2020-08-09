module.exports = async (_, { index, query }, { dataSources }) => {
  const { body } = await dataSources.dbsAPI.searchByQuery(index, query)
  const response = Array.isArray(body.hits.hits)
    ? body.hits.hits.map(item => ({
        ID: item?._id,
        ...item?._source,
      }))
    : []
  return response
}
