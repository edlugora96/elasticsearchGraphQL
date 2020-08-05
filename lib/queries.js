const { comparePasswords, signToken } = require("../utils")

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
  login: async (_, { query }, { dataSources }) => {
    let response
    try {
      const {
        hits: { hits },
      } = await dataSources.dbsAPI.searchByEmail("users", query.username)

      const user = hits[0]
      const { password: passwordStore } = user ? user._source : {}
      const compare = passwordStore && (await comparePasswords(passwordStore))
      const arePasswordEquals = passwordStore && (await compare(query.password))

      if (hits.length < 1 || !arePasswordEquals) {
        throw new Error("Login fail")
      }
      response = {
        token: `Bearer ${signToken({ ID: user._id, role: user._source.role })}`,
      }
    } catch (err) {
      throw err
    }
    return response
  },
}
