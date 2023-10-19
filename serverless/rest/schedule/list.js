'use strict'

const finnkino = require('../../utils/finnkino')
const responder = require('../../utils/responder')

module.exports.list = (event, context, callback) => {
  var area = event.queryStringParameters.area
  var date = event.queryStringParameters.date

  if (!area) {
    callback(null, responder.badRequest('Bad request: missing area'))
  } else if (!date) {
    callback(null, responder.badRequest('Bad request: missing date'))
  }

  finnkino.schedule({area, dt: date}, (results) => {
    if (!results) {
      results = []
    }

    if (!Array.isArray(results)) {
      results = [results]
    }

    const schedule = results.filter(show => {
      return show.EventType === 'Movie'
    }).map(show => {
      return {
        id: show.ID,
        title: show.Title,
        imageSmallPortrait: getPortrait(show),
        venue: show.TheatreAndAuditorium,
        time: show.dttmShowStart
      }
    })

    callback(null, responder.success(schedule))
  })
}

function getPortrait (show) {
  return show.Images
    ? show.Images.EventSmallImagePortrait
    : null
}
