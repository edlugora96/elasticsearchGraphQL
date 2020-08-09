const { comparePasswords, signToken } = require("../../../../utils")

module.exports = async (_, { query }, { dataSources }) => {
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
}
