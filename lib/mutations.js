const { nanoid } = require("nanoid")

module.exports = {
  create: async (_, { index, id, body }, { dataSources }) => {
    const innerId = id || nanoid()
    const payload = await dataSources.dbsAPI.create({
      index,
      body,
      id: innerId,
    })
    body.ID = innerId
    return {
      result: payload.body.result,
      ...body,
    }
  },
  update: async (_, { index, id, body }, { dataSources }) => {
    const payload = await dataSources.dbsAPI.update({
      doc: {
        index,
        body,
        id,
      },
    })
    body.ID = id
    return {
      result: payload.body.result,
      ...body,
    }
  },
}
