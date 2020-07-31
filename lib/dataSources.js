const DBApi = require("../DB")

module.exports = () => ({
  usersAPI: new DBApi({ index: "usuarios" }),
})
