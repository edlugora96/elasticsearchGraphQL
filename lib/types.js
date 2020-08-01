module.exports = {
  User: {
    gadgets: async ({ gadgets }, __, { dataSources }) => {
      const { body } = await dataSources.dbsAPI.search({
        index: "gadgets",
        query: {
          ids: {
            values: gadgets,
          },
        },
      })
      const response = Array.isArray(body.hits.hits)
        ? body.hits.hits.map(item => ({
            ID: item?._id,
            ...item?._source,
          }))
        : []
      return response
    },
    projects: async ({ projects }, __, { dataSources }) => {
      const { body } = await dataSources.dbsAPI.search({
        index: "projects",
        query: {
          ids: {
            values: projects,
          },
        },
      })
      const response = Array.isArray(body.hits.hits)
        ? body.hits.hits.map(item => ({
            ID: item?._id,
            ...item?._source,
          }))
        : []
      return response
    },
  },
  GlobalSearch: {
    __resolveType: (entity, context, info) => {
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
