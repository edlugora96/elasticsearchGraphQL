const { nanoid } = require("nanoid")
const moment = require("moment")
const { generateKeys, hashPassword } = require("../utils")

const update = async (_, { id, body }, { dataSources }, ____, index) => {
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

const create = async (_, { body }, { dataSources }, ____, index) => {
  let response = {}
  try {
    if (index === "users" && body.password) {
      const exists = await dataSources.dbsAPI.searchByEmail(index, body.email)
      if (exists.hits.total.value > 0) {
        throw new Error("User already exist")
      }
      body.password = await hashPassword(body.password)
    }
    if (index === "gadgets" || index === "projects") {
      const {
        hits: { hits },
      } = await dataSources.dbsAPI.searchByID({
        index: "users",
        query: body.owner,
      })
      if (
        hits.length < 1 ||
        (index === "gadgets" &&
          !hits[0]._source.projects.includes(body.project))
      ) {
        throw new Error("There is an error with the project owner")
      }
    }

    const innerId = nanoid()
    const { publicKey, privateKey } = await generateKeys()
    body.publicKey = publicKey
    body.privateKey = privateKey
    body.creation = { date: moment().format() }
    payload = await dataSources.dbsAPI.create({
      index,
      body,
      id: innerId,
    })
    if (index === "projects") {
      await dataSources.dbsAPI.addValueToField({
        id: body.owner,
        field: "projects",
        index: "users",
        value: innerId,
      })
    }
    if (index === "gadgets") {
      await dataSources.dbsAPI.addValueToField({
        id: body.owner,
        field: "gadgets",
        index: "users",
        value: innerId,
      })
      await dataSources.dbsAPI.addValueToField({
        id: body.project,
        field: "gadgets",
        index: "projects",
        value: innerId,
      })
    }
    body.ID = innerId
    response = {
      result: payload.body.result,
      ...body,
    }
  } catch (err) {
    throw err
  }
  return response
}

const deleteEntity = async (_, { id }, { dataSources }, ____, index) => {
  let response = {}
  try {
    const search = await dataSources.dbsAPI.searchByID({ query: id })
    console.log(index, id)
    search.hits.hits.map(entity => {
      console.log("Entity ----------------------------------------")
      console.log(entity._index, entity._id)
      if (
        index !== entity._index &&
        index !== "gadgets" &&
        !(index === "projects" && entity._index === "users")
      ) {
        dataSources.dbsAPI.delete({
          index: entity._index,
          id: entity._id,
        })
      }
      dataSources.dbsAPI.removeValueToField({
        id: entity._id,
        index: "users",
        field: "projects",
        value: id,
      })
      dataSources.dbsAPI.removeValueToField({
        id: entity._id,
        index: "users",
        field: "gadgets",
        value: id,
      })
      dataSources.dbsAPI.removeValueToField({
        id: entity._id,
        index: "projects",
        field: "gadgets",
        value: id,
      })
    })

    const payload = await dataSources.dbsAPI.delete({
      index,
      id,
    })
    response = {
      ID: id,
      // result: "ahi fue",
      result: payload.body.result,
    }
  } catch (err) {
    throw err
  }
  return response
}

module.exports = {
  createUser: (...arg) => create(...arg, "users"),
  createProject: (...arg) => create(...arg, "projects"),
  createGadget: (...arg) => create(...arg, "gadgets"),
  updateUser: (...arg) => update(...arg, "users"),
  updateProject: (...arg) => update(...arg, "projects"),
  updateGadget: (...arg) => update(...arg, "gadgets"),
  deleteUser: (...arg) => deleteEntity(...arg, "users"),
  deleteProject: (...arg) => deleteEntity(...arg, "projects"),
  deleteGadget: (...arg) => deleteEntity(...arg, "gadgets"),
}
