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
}

module.exports = ElasticAPI
