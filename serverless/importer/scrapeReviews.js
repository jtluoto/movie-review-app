'use strict'

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const GoogleSearch = require('google-search')
const request = require('request')
const asyncPatterns = require('../utils/async-patterns.js')

const maxNumberOfSearchResults = 10

/**
 * A function that returns the default regexes that
 * are used to check if a found page is a review for
 * a given movie.
 */
const defaultReviewRecognitionRegexs = (movie) => {
  var patterns = []

  for (var d of movie.directors) {
    var firstName = d.firstName || ''
    var lastName = d.lastName || ''
    var directorFullNameString = `${firstName} ${lastName}`.trim()
    patterns.push(`(hjaus|hjaaja):?\\s*(\\<.{1,10}\\>)?\\s*${directorFullNameString}`)
  }

  return patterns
}

/**
 * A list of objects containing for each review source:
 *  - search terms used when searching for a movie review from the source site
 *  - a function that returns regexes that are used to determine if a found
 *    site is the movie review site of a given movie
 */
const sources = [
  {
    id: 'hs',
    googleSearchTerms: '"Elokuva-arvostelu" site:hs.fi',
    getReviewRecognitionRegexs: defaultReviewRecognitionRegexs
  },

  {
    id: 'al',
    googleSearchTerms: 'arvio site:aamulehti.fi',
    getReviewRecognitionRegexs: defaultReviewRecognitionRegexs
  },

  {
    id: 'isa',
    googleSearchTerms: 'arvio site:iltasanomat.fi',
    getReviewRecognitionRegexs: defaultReviewRecognitionRegexs
  },

  {
    id: 'il',
    googleSearchTerms: '"IL-Arvio" site:iltalehti.fi',
    getReviewRecognitionRegexs: defaultReviewRecognitionRegexs
  }
]

module.exports.scrapeReviews = (event, context, callback) => {
  const params = {
    TableName:
      process.env.MOVIES_TABLE,
    FilterExpression:
      'deactivated = :deact AND (attribute_not_exists(terminationDate) OR terminationDate = :terminationDate)',
    ExpressionAttributeValues: {
      ':deact': false,
      ':terminationDate': null
    }
  }

  dynamoDb.scan(params, function (err, data) {
    if (err) {
      console.error('Error: table scan failed!', err)
    } else {
      console.info(`Found ${data.Items.length} movies`)
      searchReviewFromEverySourceForEveryMovie(data.Items)
    }
  })
}

function searchReviewFromEverySourceForEveryMovie (movies) {
  for (var movie of movies) {
    for (var source of sources) {
      if (!movie.scrapedReviews[source.id].stars) {
        (function (movie, source) {
          searchForReview(movie, source)
        })(movie, source)
      }
    }
  }
}

function searchForReview (movie, source) {
  var googleSearch = new GoogleSearch({
    key: googleKey,
    cx: cx
  })

  var googleQuery = `"${movie.displayTitle}" ${source.googleSearchTerms}`

  googleSearch.build({
    q: googleQuery,
    num: maxNumberOfSearchResults
  }, function (error, response) {
    var movieAndSource =
      `Movie: ${movie.id} ${movie.title}, source: ${source.id}`

    if (error) {
      console.error(`GCS failed! ${movieAndSource}`, error)
    } else if (response.error) {
      var messages = response.error.errors.map(e => e.message)
      console.error(`GCS responded with an error! ${movieAndSource}`, messages)
    } else if (!response.items) {
      console.info(`No search results for query ${googleQuery}`)
    } else {
      var links = response.items.map(r => r.link)
      console.info(`Search results: ${movieAndSource}: ${links}`)
      tryToFindReviewFromSearchResults(links, movie, source)
    }
  })
}

function tryToFindReviewFromSearchResults (searchResults, movie, source) {
  var reviewResult

  asyncPatterns.WaterfallOver(searchResults, function (searchResultUrl, report) {
    request(searchResultUrl, {timeout: 5000}, function (error, response, body) {
      if (error) {
        console.error(
          `Error while opening search result for movie
           ${movie.id} ${movie.title}: ${searchResultUrl}`, error)
      } else {
        reviewResult = tryToScrapeReview(body, movie, source, searchResultUrl)
      }

      // Stop looping Google search result links if review was already found
      report(reviewResult != null)
    })
  }, function () {
    if (reviewResult) {
      updateScrapedReviewToDB(movie, source, reviewResult)
    } else {
      console.log(
        `No valid review found for movie ${movie.id} ${movie.title} on site ${source.id}`
      )
    }
  })
}

function tryToScrapeReview (body, movie, source, searchResultUrl) {
  var stars = getStarsFromPageBody(body)

  if (isAValidMovieReviewPage(body, movie, source, stars)) {
    return {
      stars: stars,
      link: searchResultUrl
    }
  }

  return null
}

function isAValidMovieReviewPage (body, movie, source, rating) {
  return rating > 0 &&
    includesAtLeastOne(body, source.getReviewRecognitionRegexs(movie), true)
}

function getStarsFromPageBody (body) {
  const oneStars = ['★', 'ilarvio1.gif']
  const twoStars = ['★★', 'ilarvio2.gif']
  const threeStars = ['★★★', 'ilarvio3.gif']
  const fourStars = ['★★★★', 'ilarvio4.gif']
  const fiveStars = ['★★★★★', 'ilarvio5.gif']

  if (includesAtLeastOne(body, fiveStars)) {
    return 5
  } else if (includesAtLeastOne(body, fourStars)) {
    return 4
  } else if (includesAtLeastOne(body, threeStars)) {
    return 3
  } else if (includesAtLeastOne(body, twoStars)) {
    return 2
  } else if (includesAtLeastOne(body, oneStars)) {
    return 1
  } else {
    return 0
  }
}

function includesAtLeastOne (body, patterns, trimBody = false) {
  var charsetProblem = body.includes('�')

  if (trimBody) {
    body = body
      .replace(/&auml/g, 'ä')
      .replace(/&Auml/g, 'Ä')
      .replace(/&ouml/g, 'ö')
      .replace(/&Ouml/g, 'Ö')

    if (charsetProblem) {
      body = body.replace(/�/g, '')
    }
  }

  for (var pattern of patterns) {
    if (charsetProblem) {
      pattern = pattern
        .replace(/ä/g, '')
        .replace(/Ä/g, '')
        .replace(/ö/g, '')
        .replace(/Ö/g, '')
    }

    if ((new RegExp(pattern, 'i')).test(body)) {
      return true
    }
  }

  return false
}

function updateScrapedReviewToDB (movie, source, reviewResult) {
  var params = {
    TableName: process.env.MOVIES_TABLE,
    Key: {'id': movie.id},
    UpdateExpression: 'set scrapedReviews.#source = :review',
    ExpressionAttributeNames: {
      '#source': source.id
    },
    ExpressionAttributeValues: {
      ':review': reviewResult
    }
  }

  dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error(
        `Failed to update scraped stars to DB,
         movie ${movie.displayTitle},
         source ${source.id}`, err)
    } else {
      console.log(
        `Successfully updated stars to DB,
         movie ${movie.id} ${movie.title},
         source ${source.id}`, data)
    }
  })
}
