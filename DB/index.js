const { RESTDataSource } = require("apollo-datasource-rest")

class ElasticAPI extends RESTDataSource {
  constructor({ index }) {
    super()
    this.DB_index = index
    this.baseURL = process.env.DB_HOST
  }
  async getAllDocuments() {
    try {
      const response = await this.get(`${this.DB_index}/_search`)
      console.log(response)
      return Array.isArray(response)
        ? response.map(launch => this.launchReducer(launch))
        : []
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ElasticAPI
