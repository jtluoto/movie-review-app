const auth = require('../utils/auth')
const jwt = require('jwt-simple')

module.exports = {
  initializeAdminRequestEvent: () => {
    // This is needs to be set when creating or decoding JWTs
    process.env.JWT_SECRET = 'adHocSecret'

    const payload = {
      id: 1,
      username: 'admin',
      name: 'admin',
      admin: true,
      exp: Math.round((new Date()).getTime() / 1000) + 3600
    }

    const jwtToken = jwt.encode(payload, process.env.JWT_SECRET)

    const event = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    }

    return event
  }
}
