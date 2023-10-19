'use strict'

const responder = require('../../utils/responder.js')
const utils = require('../../utils')
const auth = require('../../utils/auth.js')
const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.update = (event, context, callback) => {
  if (!auth.loggedInUserIsAdmin(event)) {
    callback(null, responder.unauthorized())
    return
  }

  try {
    var body = JSON.parse(event.body)
    var movies = body.movies || []
  } catch (err) {
    console.log(err)
    callback(null, responder.badRequest('Invalid body'))
  }

  var updatedCount = 0

  for (var movie of movies) {
    try {
      updateMovie(movie)
      updatedCount++
    } catch (err) {
      console.log('Update movies failed!', err)
      callback(null, responder.error('Error: update movies failed!'))
    }
  }

  callback(null, responder.success({'updatedCount': updatedCount}))
}

function updateMovie (movie) {
  var params = {
    TableName: process.env.MOVIES_TABLE,
    Key: {'id': movie.id.toString()},
    UpdateExpression:
      `set reviews=:rews,
       updated=:now,
       deactivated=:deact,
       displayTitle=:dispT,
       originalDisplayTitle=:orgDispT`,
    ExpressionAttributeValues: {
      ':rews': movie.reviews,
      ':now': utils.getNowInISOFormat(),
      ':deact': movie.deactivated,
      ':dispT': movie.displayTitle,
      ':orgDispT': movie.originalDisplayTitle
    }
  }

  dynamoDb.update(params, function (err, data) {
    if (err) {
      throw err
    } else {
      console.log(`Successfully updated movie ${movie.id} ${movie.title}`)
    }
  })
}
