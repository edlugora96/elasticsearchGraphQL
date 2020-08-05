const jwt = require("jsonwebtoken")

const signToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET)
}

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
const decodeNoVerify = token => {
  return jwt.decode(token)
}
const hasRole = requireRole => userRole => {
  if (Array.isArray(requireRole)) {
    return requireRole.includes(userRole)
  } else {
    return requireRole === userRole
  }
}
module.exports = {
  signToken,
  verifyToken,
  decodeNoVerify,
  hasRole,
}
