const { nanoid } = require("nanoid")
const moment = require("moment")
const {
  generateKeys,
  hashPassword,
  queryMatch,
  queryDeleteById,
} = require("../utils")

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

const deleteProjectQuery = async ({ id, dataSources }) => {
  const index = "projects"
  let gadgetsRelation = await dataSources.dbsAPI.search({
    index: "projects_gadgets",
    body: queryMatch("projectID", id),
  })
  const gadgets = gadgetsRelation.body.hits.hits.map(gadget => {
    return gadget._source.gadgetID
  })
  gadgetsRelation = gadgetsRelation.body.hits.hits.map(gadget => {
    return gadget._id
  })

  dataSources.dbsAPI.deleteByQuery({
    index: "gadgets",
    body: queryDeleteById(gadgets),
  })
  dataSources.dbsAPI.deleteByQuery({
    index: "projects_gadgets",
    body: queryDeleteById(gadgetsRelation),
  })
  const { body } = await dataSources.dbsAPI.delete({
    index,
    id,
  })
  return {
    ID: id,
    result: body.result,
  }
}

const setCreation = body => {
  body.name = body?.name.trim()
  body.creation = {
    user: body.owner,
    date: moment().format(),
  }
}

const setPairKeys = async body => {
  const { publicKey, privateKey } = await generateKeys()
  body.publicKey = publicKey
  body.privateKey = privateKey
}

module.exports = {
  createUser: async (_, { body }, { dataSources }, ____) => {
    const index = "users"
    let response = {}
    try {
      const id = nanoid()
      setCreation(body)
      setPairKeys(body)
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
  },
  createProject: async (_, { body }, { dataSources }, ____) => {
    const index = "projects"
    let response = {}
    try {
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
      setCreation(body)
      setPairKeys(body)
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
  },
  createGadget: async (_, { body }, { dataSources }, ____) => {
    const index = "gadgets"
    let response = {}
    try {
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
      setCreation(body)
      setPairKeys(body)
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
  },
  updateUser: (...arg) => update(...arg, "users"),
  updateProject: (...arg) => update(...arg, "projects"),
  updateGadget: (...arg) => update(...arg, "gadgets"),
  deleteUser: async (_, { id }, { dataSources }, ____) => {
    const index = "users"
    let response = {}
    try {
      const exists = await dataSources.dbsAPI.searchByID({
        index: "users",
        query: id,
      })
      if (exists.hits.hits.length < 1) {
        throw new Error("There is an error with the user")
      }

      let usersRelation = await dataSources.dbsAPI.search({
        index: "users_projects",
        body: queryMatch("userID", id),
      })
      const project = usersRelation.body.hits.hits.map(user => {
        return user._source.projectID
      })
      usersRelation = usersRelation.body.hits.hits.map(user => {
        return user._id
      })
      project.map(projectId => {
        deleteProjectQuery({ id: projectId, dataSources })
      })
      dataSources.dbsAPI.deleteByQuery({
        index: "users_projects",
        body: queryDeleteById(usersRelation),
      })
      const { body } = await dataSources.dbsAPI.delete({
        index,
        id,
      })

      response = {
        ID: id,
        // result: "ahi fue",
        result: body.result,
      }
    } catch (err) {
      throw err
    }
    return response
  },
  deleteProject: async (_, { id }, { dataSources }, ____) => {
    let response = {}
    try {
      const exists = await dataSources.dbsAPI.searchByID({
        index: "projects",
        query: id,
      })
      if (exists.hits.hits.length < 1) {
        throw new Error("There is an error with the project")
      }
      response = await deleteProjectQuery({ id, dataSources })
    } catch (err) {
      throw err
    }
    return response
  },
  deleteGadget: async (_, { id }, { dataSources }, ____) => {
    const index = "gadgets"
    let response
    try {
      const {
        body: { hits },
      } = await dataSources.dbsAPI.search({
        index: "projects_gadgets",
        body: queryMatch("gadgetID", id),
      })
      const relation_tables = hits.hits.map(table => {
        return table._id
      })
      dataSources.dbsAPI.deleteByQuery({
        index: "projects_gadgets",
        body: queryDeleteById(relation_tables),
      })
      const { body } = await dataSources.dbsAPI.delete({
        index,
        id,
      })
      response = {
        ID: id,
        result: body.result,
      }
    } catch (err) {
      throw err
    }
    return response
  },
}
