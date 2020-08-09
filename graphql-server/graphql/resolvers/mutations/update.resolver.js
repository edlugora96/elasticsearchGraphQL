module.exports = async (_, { id, body }, { dataSources }, ____, index) => {
  const payload = await dataSources.dbsAPI.update({
    index,
    id,
    body: {
      doc: {
        ...body,
      },
    },
  })
  return {
    ID: id,
    result: payload.body.result,
  }
}
