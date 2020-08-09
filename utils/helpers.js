const moment = require("moment")
const { generateKeys } = require("./cryptography")

const setCreation = body => {
  body.name = body?.name.trim()
  body.creation = {
    user: body.owner,
    date: moment().format(),
  }
}

const setPairKeys = async body => {
  const { publicKey, privateKey } = await generateKeys()
  body.publicKey = publicKey
  body.privateKey = privateKey
}

module.exports = {
  setCreation,
  setPairKeys,
}
