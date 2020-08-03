const { Client } = require("@elastic/elasticsearch")
class ElasticAPI extends Client {
  constructor() {
    super({ node: process.env.DB_HOST })
  }
  async searchByQuery(index, query) {
    const { body } = await this.search({
      index,
      body: {
        query: {
          query_string: { query: `*${query}*` },
        },
      },
    })
    return body
  }
  async searchByEmail(index, email) {
    const { body } = await this.search({
      index,
      body: {
        query: {
          bool: {
            must: {
              term: {
                email,
              },
            },
          },
        },
      },
    })
    return body
  }
  async searchByID({ index, query }) {
    const { body } = await this.search({
      index: index || "*",
      body: {
        query: {
          bool: {
            should: [{ ids: { values: [query] } }, { query_string: { query } }],
          },
        },
      },
    })
    return body
  }
  async getByID({ index, query }) {
    const { body } = await this.search({
      index: index || "*",
      body: {
        query: { ids: { values: [query] } },
      },
    })
    return body
  }

  async searchHighlight({ index, query }) {
    const { body } = await this.search({
      index: index || "*",
      body: {
        query: {
          query_string: { query: `*${query}*` },
        },
        highlight: {
          require_field_match: false,
          fields: {
            "*": {
              pre_tags: ["<em>"],
              post_tags: ["</em>"],
            },
          },
        },
      },
    })
    return body
  }
  async addValueToField({ id, index, field, value }) {
    const { body } = await this.update({
      index,
      id,
      body: {
        script: {
          source: `if(ctx._source.${field}==null){ctx._source.${field}=[params.value]}else{ctx._source.${field}.removeIf(entity -> entity == params.value); ctx._source.${field}.add(params.value)}`,
          params: {
            value,
          },
        },
      },
    })
    return body
  }
  async removeValueToField({ id, index, field, value }) {
    const { body } = await this.update({
      index,
      id,
      body: {
        script: {
          source: `if(ctx._source.${field}!=null){ctx._source.${field}.removeIf(entity -> entity == params.value)}`,
          params: {
            value,
          },
        },
      },
    })
    return body
  }
}

module.exports = ElasticAPI
