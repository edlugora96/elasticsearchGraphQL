module.exports = {
  searchHighlight: async (_, { index, query }, { dataSources }) => {
    const body = await dataSources.dbsAPI.searchHighlight({ index, query })
    const highlight = body.hits.hits.map(({ _index, _id, highlight }) => {
      return [_index, _id, ...Object.values(highlight).map(light => light[0])]
    })
    const response = Array.isArray(body.hits.hits)
      ? body.hits.hits.map(item => ({
          ID: item?._id,
          ...item?._source,
        }))
      : []
    return {
      body: response,
      highlight,
    }
  },
  search: async (_, { index, query }, { dataSources }) => {
    const { body } = await dataSources.dbsAPI.searchByQuery(index, query)
    const response = Array.isArray(body.hits.hits)
      ? body.hits.hits.map(item => ({
          ID: item?._id,
          ...item?._source,
        }))
      : []
    return response
  },
}
