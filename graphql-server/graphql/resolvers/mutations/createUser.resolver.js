module.exports = async (_, { body }, { dataSources, currentUser }, ____) => {
  const index = "users"
  let response = {}
  try {
    const id = nanoid()
    await setCreation(body)
    await setPairKeys(body)

    body.owner = currentUser.ID
    const exists = await dataSources.dbsAPI.searchByEmail(index, body.email)
    if (exists.hits.total.value > 0) {
      throw new Error("User already exist")
    }
    body.password = await hashPassword(body.password)
    body.birthday = moment(body.birthday).format()
    const {
      body: { result },
    } = await dataSources.dbsAPI.create({ index, body, id })
    response = {
      ID: id,
      result,
      ...body,
    }
  } catch (err) {
    throw err
  }
  return response
}
