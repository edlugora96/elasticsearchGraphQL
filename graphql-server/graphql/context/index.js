const { verifyToken } = require("../../../utils")
module.exports = async ({ req, connection }) => {
  let authToken = null
  let currentUser = null
  try {
    const head =
      connection?.context.authorization || req.headers.authorization.split(" ")
    const bearer = head[0] === "Bearer"
    authToken = head[1]
    if (authToken && bearer) {
      currentUser = await verifyToken(authToken)
    }
  } catch {
    console.warn(`Unable to authenticate`)
  }

  return {
    authToken,
    currentUser,
  }
}
