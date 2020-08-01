const { nanoid } = require("nanoid")

const create = async (_, { index, id, body }, { dataSources }) => {
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
}
module.exports = {
  createUser: (...arg) => create(arg),
  createProject: (...arg) => create(arg),
  createGadget: (...arg) => create(arg),
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
