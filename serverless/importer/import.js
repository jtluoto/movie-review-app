'use strict'

const _ = require('lodash')
const utils = require('../utils')
const finnkino = require('finnkino-wrapper')
const AWS = require('aws-sdk')

// Automatically remove these substrings from display titles
const discardableTitleSubstrings = [
  '(dub)',
  '(3D)',
  '(2D)',
  '(orig)',
  '(svensk)',
  '(väliajalla ja tarjoiluilla)',
  '(suom.)',
  '(pohjoissaam.)',
  '(kansainvälinen versio)',
  ' -erikoisnäytös'
]

module.exports.import = (event, context, callback) => {
  var params = {
    TableName: process.env.MOVIES_TABLE
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  dynamoDb.scan(params, function (err, result) {
    if (err) {
      console.error('ERROR: failed to perform DB scan!', err)
      callback(err, "Import failed!")
    } else {
      compareDbMoviesToFinnkinoEvents(result.Items)
      callback(null, "Import successful!")
    }
  })
}

function compareDbMoviesToFinnkinoEvents (moviesInDB) {
  finnkino.events({}, function (finnkinoEvents) {
    updateExistingMovies(moviesInDB, finnkinoEvents)
    importNewMovies(moviesInDB, finnkinoEvents)
    terminateOldMovies(moviesInDB, finnkinoEvents)
  })
}

function updateExistingMovies (moviesInDB, finnkinoEvents) {
  for (var movie of moviesInDB) {
    var event = findEventById(movie.id, finnkinoEvents)

    if (event && eventHasChanges(movie, event)) {
      updateMovie(event)
    }
  }
}

function eventHasChanges (movie, event) {
  return (
    !_.isEqual(movie.directors, getDirectors(event)) ||
    !_.isEqual(movie.actors, getActors(event)) ||
    movie.releaseDate !== event.dtLocalRelease ||
    movie.lengthInMinutes !== event.LengthInMinutes ||
    movie.title !== event.Title ||
    movie.synopsis !== event.Synopsis ||
    movie.shortSynopsis !== event.ShortSynopsis ||
    movie.genres !== event.Genres ||
    movie.imageMicroPortrait !== getImage(event, 'EventMicroImagePortrait') ||
    movie.imageSmallPortrait !== getImage(event, 'EventSmallImagePortrait') ||
    movie.imageMediumPortrait !== getImage(event, 'EventMediumImagePortrait') ||
    movie.imageLargePortrait !== getImage(event, 'EventLargeImagePortrait') ||
    movie.imageSmallLandscape !== getImage(event, 'EventSmallImageLandscape') ||
    movie.imageLargeLandscape !== getImage(event, 'EventLargeImageLandscape') ||
    movie.youtubeTrailer !== getYoutubeTrailer(event) ||
    movie.terminationDate !== null
  )
}

function updateMovie (event) {
  var params = {
    TableName: process.env.MOVIES_TABLE,
    Key: {'id': event.ID},
    UpdateExpression:
      `set
        directors = :dirs,
        actors = :actors,
        title = :title,
        synopsis = :synopsis,
        shortSynopsis = :shortSynopsis,
        genres = :genres,
        releaseDate = :releaseDate,
        lengthInMinutes = :length,
        imageMicroPortrait = :imMicroPo,
        imageSmallPortrait = :imSmallPo,
        imageMediumPortrait = :imMediumPo,
        imageLargePortrait = :imLargePo,
        imageSmallLandscape = :imSmallLa,
        imageLargeLandscape = :imLargeLa,
        youtubeTrailer = :trailer,
        updated = :updated,
        terminationDate = :terminationDate
      `,
    ExpressionAttributeValues: {
      ':dirs': getDirectors(event),
      ':actors': getActors(event),
      ':title': event.Title || null,
      ':synopsis': event.Synopsis || null,
      ':shortSynopsis': event.ShortSynopsis || null,
      ':genres': event.Genres || null,
      ':releaseDate': event.dtLocalRelease,
      ':length': event.LengthInMinutes,
      ':imMicroPo': getImage(event, 'EventMicroImagePortrait'),
      ':imSmallPo': getImage(event, 'EventSmallImagePortrait'),
      ':imMediumPo': getImage(event, 'EventMediumImagePortrait'),
      ':imLargePo': getImage(event, 'EventLargeImagePortrait'),
      ':imSmallLa': getImage(event, 'EventSmallImageLandscape'),
      ':imLargeLa': getImage(event, 'EventLargeImageLandscape'),
      ':trailer': getYoutubeTrailer(event),
      ':updated': utils.getNowInISOFormat(),
      ':terminationDate': null
    }
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error(`ERROR: updating movie failed! ${event.ID} ${event.Title}`, err)
    } else {
      console.log(`Successfully updated movie ${event.ID} ${event.Title}`)
    }
  })
}

function findEventById (id, events) {
  for (var event of events) {
    if (event.ID === id) {
      return event
    }
  }

  return null
}

function importNewMovies (moviesInDB, finnkinoEvents) {
  var dbMovieIDs = moviesInDB.map(m => m.id)

  for (var event of finnkinoEvents) {
    var movieNotYetInDB = !dbMovieIDs.includes(event.ID)

    if (movieNotYetInDB && event.EventType === 'Movie') {
      createNewMovie(event)
    }
  }
}

function terminateOldMovies (moviesInDB, finnkinoEvents) {
  var eventIds = finnkinoEvents.map(e => e.ID)

  for (var movie of moviesInDB) {
    var movieRemovedFromFinnkino = !eventIds.includes(movie.id)
    var movieNotYetTerminated = !movie.terminationDate

    if (movieRemovedFromFinnkino && movieNotYetTerminated) {
      terminateMovie(movie.id)
    }
  }
}

function getDisplayTitle (title) {
  var displayTitle = title
  for (var s of discardableTitleSubstrings) {
    displayTitle = displayTitle.replace(s, '')
  }
  return displayTitle.trim()
}

function createNewMovie (event) {
  var sources = {hs: {}, il: {}, isa: {}, al: {}}
  var now = utils.getNowInISOFormat()

  var params = {
    TableName: process.env.MOVIES_TABLE,
    Item: {
      id: event.ID,
      created: now,
      updated: now,
      title: event.Title,
      synopsis: event.Synopsis || null,
      shortSynopsis: event.ShortSynopsis || null,
      genres: event.Genres || null,
      imageMicroPortrait: getImage(event, 'EventMicroImagePortrait'),
      imageSmallPortrait: getImage(event, 'EventSmallImagePortrait'),
      imageMediumPortrait: getImage(event, 'EventMediumImagePortrait'),
      imageLargePortrait: getImage(event, 'EventLargeImagePortrait'),
      imageSmallLandscape: getImage(event, 'EventSmallImageLandscape'),
      imageLargeLandscape: getImage(event, 'EventLargeImageLandscape'),
      youtubeTrailer: getYoutubeTrailer(event),
      directors: getDirectors(event),
      actors: getActors(event),
      releaseDate: event.dtLocalRelease,
      lengthInMinutes: event.LengthInMinutes,
      originalDisplayTitle: getDisplayTitle(event.OriginalTitle),
      displayTitle: getDisplayTitle(event.Title),
      reviews: sources,
      scrapedReviews: sources,
      deactivated: false
    }
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  dynamoDb.put(params, function (err, data) {
    if (err) {
      console.error(
        `ERROR: failed to create new movie ${event.ID} ${event.Title}`,
        err, JSON.stringify(params, undefined, 2)
      )
    } else {
      console.log(
        `Successfully created new movie ${event.ID} ${event.Title}`
      )
    }
  })
}

function terminateMovie (movieId) {
  var params = {
    TableName: process.env.MOVIES_TABLE,
    Key: {'id': movieId},
    UpdateExpression: 'set terminationDate=:date',
    ExpressionAttributeValues: {
      ':date': new Date().toISOString()
    }
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  dynamoDb.update(params, function (err, data) {
    if (err) {
      throw err
    }
  })
}

function getImage (movie, image) {
  if (movie.Images && movie.Images[image]) {
    return movie.Images[image]
  } else {
    return null
  }
}

function getDirectors (movie) {
  // A bit of hacking because of Finnkino's broken JSON:
  // 'Directors' contains a property called 'Director'
  // that can be either one director object or an array
  // of director objects.

  var directors = []

  if (movie.Directors && movie.Directors.Director) {
    var elementDirectors

    if (isArray(movie.Directors.Director)) {
      elementDirectors = movie.Directors.Director
    } else {
      elementDirectors = [movie.Directors.Director]
    }

    for (var d of elementDirectors) {
      directors.push({
        firstName: d.FirstName || null,
        lastName: d.LastName || null
      })
    }
  }

  return directors
}

function getActors (event) {
  var actors = []

  if (event.Cast && event.Cast.Actor && Array.isArray(event.Cast.Actor)) {
    for (var a of event.Cast.Actor) {
      actors.push({
        firstName: a.FirstName || null,
        lastName: a.LastName || null
      })
    }
  }

  return actors
}

function getYoutubeTrailer (event) {
  if (event.Videos &&
      event.Videos.EventVideo &&
      event.Videos.EventVideo.MediaResourceFormat === 'YouTubeVideo' &&
      event.Videos.EventVideo.Location) {
    return event.Videos.EventVideo.Location
  } else {
    return null
  }
}

function isArray (what) {
  return Object.prototype.toString.call(what) === '[object Array]'
}
