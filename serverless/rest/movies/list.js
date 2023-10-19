'use strict'

const responder = require('../../utils/responder.js')
const utils = require('../../utils')
const auth = require('../../utils/auth.js')
const AWS = require('aws-sdk')

const dislayableMoviesQuery = {
  TableName:
    process.env.MOVIES_TABLE,
  FilterExpression:
    'deactivated = :deact AND (attribute_not_exists(terminationDate) OR terminationDate = :terminationDate)',
  ExpressionAttributeValues: {
    ':deact': false,
    ':terminationDate': null
  }
}

const allMoviesQuery = {
  TableName:
    process.env.MOVIES_TABLE
}

module.exports.list = async (event) => {
  var all = utils.getQueryParam('all', event) === 'true'

  if (all) {
    return listAllMoviesIfAdmin(event)
  } else {
    return scanDatabase(dislayableMoviesQuery)
  }
}

function listAllMoviesIfAdmin (event) {
  if (!auth.loggedInUserIsAdmin(event)) {
    return responder.unauthorized()
  }

  return scanDatabase(allMoviesQuery)
}

async function scanDatabase (queryParams) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const promise = dynamoDb.scan(queryParams).promise()
  const result = await promise
  return responder.success(result)
}
