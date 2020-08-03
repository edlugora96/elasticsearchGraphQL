const bodyQuery = values => ({
  query: {
    ids: {
      values,
    },
  },
})

const outParser = (body, single = true) => {
  if (single) {
    return {
      ID: body.hits.hits[0]?._id,
      ...body.hits.hits[0]?._source,
    }
  }
  return Array.isArray(body.hits.hits)
    ? body.hits.hits.map(item => ({
        ID: item?._id,
        ...item?._source,
      }))
    : []
}
const owner = async ({ owner }, __, { dataSources }) => {
  const { body } = await dataSources.dbsAPI.search({
    index: "users",
    body: bodyQuery(owner),
  })
  return outParser(body)
}
const project = async ({ project }, __, { dataSources }) => {
  const { body } = await dataSources.dbsAPI.search({
    index: "projects",
    body: bodyQuery(project),
  })
  return outParser(body)
}

const gadgets = async ({ gadgets, ID }, __, { dataSources }) => {
  const { body } = await dataSources.dbsAPI.search({
    index: "gadgets",
    body: bodyQuery(gadgets),
  })
  return outParser(body, false)
}
const projects = async ({ projects }, __, { dataSources }) => {
  const { body } = await dataSources.dbsAPI.search({
    index: "projects",
    body: bodyQuery(projects),
  })
  return outParser(body, false)
}

module.exports = {
  User: {
    gadgets,
    projects,
  },
  Project: {
    gadgets,
    owner,
  },
  Gadget: {
    project,
    owner,
  },
  GlobalSearch: {
    __resolveType: entity => {
      if (entity.birthday) {
        return "User"
      }
      if (entity.value) {
        return "Gadget"
      }
      return "Project"
    },
  },
}
