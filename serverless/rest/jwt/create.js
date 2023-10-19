'use strict'

const auth = require('../../utils/auth.js')
const responder = require('../../utils/responder.js')

module.exports.create = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const user = getUser(body.username, body.password)

  if (user) {
    const token = auth.createJwt(user)
    callback(null, responder.success({ token: token }))
  } else {
    callback(null, responder.unauthorized())
  }
}

function getUser (username, password) {
  // This would be fetched from the database
  const user = {
    id: 0,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    name: 'KV Admin',
    admin: true
  }

  if (user && user.username === username && user.password === password) {
    return user
  } else {
    return null
  }
}
