const { nanoid } = require("nanoid")
const { setCreation, setPairKeys } = require("../../../../utils")

module.exports = async (_, { body }, { dataSources, currentUser }, ____) => {
  const index = "gadgets"
  let response = {}
  try {
    body.owner = currentUser.ID
    const {
      hits: { hits },
    } = await dataSources.dbsAPI.searchByID({
      index: "projects",
      query: body.project,
    })
    if (hits.length < 1) {
      throw new Error("There is an error with the project")
    }
    const id = nanoid()
    await setCreation(body)
    await setPairKeys(body)
    const projects_gadgets = {
      projectID: body.project,
      gadgetID: id,
    }
    delete body.owner
    delete body.project
    await dataSources.dbsAPI.create({
      index: "projects_gadgets",
      body: projects_gadgets,
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
