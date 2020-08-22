module.exports = async (_, { index, query }, { dataSources }) => {
  const body = await dataSources.dbsAPI.searchHighlight({ index, query })
  const hght = body.hits.hits.map(({ _index, _id, highlight }) => {
    return highlight
      ? [_index, _id, ...Object.values(highlight).map(light => light[0])]
      : []
  })
  const response = Array.isArray(body.hits.hits)
    ? body.hits.hits.map(item => ({
        ID: item?._id,
        ...item?._source,
      }))
    : []
  const highlight = hght.filter(el => el.length > 0)
  return {
    body: response,
    highlight,
  }
}
