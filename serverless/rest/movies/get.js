'use strict'

const responder = require('../../utils/responder.js')
const auth = require('../../utils/auth.js')

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.get = (event, context, callback) => {
  if (!auth.loggedInUserIsAdmin(event)) {
    callback(null, responder.unauthorized())
    return
  }

  var id = event.pathParameters.id

  if (!id) {
    callback(null, responder.badRequest('Bad request: missing ID'))
  }

  const params = {
    TableName:
      process.env.MOVIES_TABLE,
    Key: {
      id: id
    }
  }

  dynamoDb.get(params, function (err, data) {
    if (err) {
      console.error('Get movie failed!', err)
      callback(null, responder.error('Error: get movie failed!'))
    } else {
      callback(null, responder.success(data))
    }
  })
}
