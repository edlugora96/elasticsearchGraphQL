const { nanoid } = require("nanoid")
const { setCreation, setPairKeys } = require("../../../../utils")

module.exports = async (_, { body }, { dataSources, currentUser }, ____) => {
  const index = "projects"
  let response = {}
  try {
    body.owner = currentUser.ID
    const {
      hits: { hits },
    } = await dataSources.dbsAPI.searchByID({
      index: "users",
      query: body.owner,
    })
    if (hits.length < 1) {
      throw new Error("There is an error with the project owner")
    }
    const id = nanoid()
    await setCreation(body)
    await setPairKeys(body)
    const users_projects = {
      userID: body.owner,
      projectID: id,
    }
    delete body.owner
    await dataSources.dbsAPI.create({
      index: "users_projects",
      body: users_projects,
      id,
    })
    const {
      body: { result },
    } = await dataSources.dbsAPI.create({
      index,
      body,
      id,
    })
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
