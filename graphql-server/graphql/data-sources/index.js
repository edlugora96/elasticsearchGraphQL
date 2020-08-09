const DBApi = require("../../../DB")

module.exports = () => ({
  dbsAPI: new DBApi(),
})
