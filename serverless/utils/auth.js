const jwt = require('jwt-simple')

module.exports = {
  createJwt: (user) => {
    const secondsFromEpoch = Math.round((new Date()).getTime() / 1000)
    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      admin: user.admin,
      exp: secondsFromEpoch + 3600
    }

    return jwt.encode(payload, process.env.JWT_SECRET)
  },

  getAuthorizedUser: (event) => {
    var token = event.headers['Authorization']

    if (!token) {
      return null
    }

    token = token.replace('Bearer ', '')

    try {
      var decoded = jwt.decode(token, process.env.JWT_SECRET)
      return decoded
    } catch (e) {
      console.log('Decoding failed! ' + e)
      return null
    }
  },

  loggedInUserIsAdmin: (event) => {
    const user = module.exports.getAuthorizedUser(event)

    if (user && user.admin) {
      return true
    } else {
      return false
    }
  }
}
