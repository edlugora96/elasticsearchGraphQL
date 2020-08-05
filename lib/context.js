const { verifyToken } = require("../utils")
module.exports = async ({ req }) => {
  let authToken = null
  let currentUser = null
  try {
    const head = req.headers.authorization.split(" ")
    const bearer = head[0] === "Bearer"
    authToken = head[1]
    if (authToken && bearer) {
      currentUser = await verifyToken(authToken)
    }
  } catch (e) {
    console.warn(`Unable to authenticate`)
  }

  return {
    authToken,
    currentUser,
  }
}
