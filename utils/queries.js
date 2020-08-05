const queryById = values => ({
  query: {
    ids: {
      values,
    },
  },
})

const queryDeleteById = values => ({
  query: {
    bool: {
      must: {
        ids: {
          values,
        },
      },
    },
  },
})

const queryMatch = (field, value) => ({
  query: {
    bool: {
      must: {
        match: {
          [field]: value,
        },
      },
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

module.exports = {
  queryById,
  queryMatch,
  outParser,
  queryDeleteById,
}
