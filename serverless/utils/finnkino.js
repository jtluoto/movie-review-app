var rp = require('request-promise')
var parseString = require('xml2js').parseString
var _ = require('underscore')

var API = 'http://www.finnkino.fi/xml/'
var API_AREAS = API + 'TheatreAreas'
var API_LANGUAGES = API + 'Languages'
var API_SCHEDULE_DATES = API + 'ScheduleDates'
var API_SCHEDULE = API + 'Schedule'
var API_EVENTS = API + 'Events'
var API_NEWS = API + 'News'
var API_NEWS_CATEGORIES = API + 'NewsCategories'

// Helper
var arrayAndObjectDestructor = function (array) {
  if (!array) {
    return []
  }

  if (array.length === 1 && typeof _.first(array) === 'string') {
    return _.first(array)
  }
  if (array.length === 1 && typeof _.first(array) === 'object') {
    return _.mapObject(_.first(array), function (val) {
      return arrayAndObjectDestructor(val)
    })
  }
  return _.map(array, function (elem) {
    if (Array.isArray(elem)) {
      return arrayAndObjectDestructor(elem)
    }
    return _.mapObject(elem, function (val) {
      return arrayAndObjectDestructor(val)
    })
  })
}
//

var setApiAddress = function (apiAddress) {
  // Should test if url is valid
  API = apiAddress
}

var areas = function (options, cb) {
  var areasOptions = {
    uri: API_AREAS,
    qs: options
  }

  rp(areasOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(_.map(result.TheatreAreas.TheatreArea, function (area) {
          return _.mapObject(area, function (val) {
            return val.join(', ')
          })
        }))
      }
    })
  })
}

var languages = function (options, cb) {
  var languagesOptions = {
    uri: API_LANGUAGES,
    qs: options
  }

  rp(languagesOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(_.map(result.Languages.Language, function (lang) {
          return _.mapObject(lang, function (val) {
            return val.join(', ')
          })
        }))
      }
    })
  })
}

var scheduleDates = function (options, cb) {
  var scheduleDatesOptions = {
    uri: API_SCHEDULE_DATES,
    qs: options
  }

  rp(scheduleDatesOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(result.Dates.dateTime)
      }
    })
  })
}

var schedule = function (options, cb) {
  var scheduleOptions = {
    uri: API_SCHEDULE,
    qs: options
  }

  rp(scheduleOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(arrayAndObjectDestructor(_.first(result.Schedule.Shows).Show))
      }
    })
  }).catch(function (err) {
    console.log(err)
  })
}

var events = function (options, cb) {
  var eventsOptions = {
    uri: API_EVENTS,
    qs: options
  }

  rp(eventsOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(arrayAndObjectDestructor(result.Events.Event))
      }
    })
  })
}

var news = function (options, cb) {
  var newsOptions = {
    uri: API_NEWS,
    qs: options
  }

  rp(newsOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(arrayAndObjectDestructor(result.News.NewsArticle))
      }
    })
  })
}

var newsCategories = function (options, cb) {
  var newsCategoriesOptions = {
    uri: API_NEWS_CATEGORIES,
    qs: options
  }

  rp(newsCategoriesOptions).then(function (response) {
    parseString(response, function (err, result) {
      if (err) {
        console.log('Error while parsing xml response')
      } else {
        cb(arrayAndObjectDestructor(result.NewsCategories.NewsArticleCategory))
      }
    })
  })
}

module.exports = {
  areas: areas,
  languages: languages,
  scheduleDates: scheduleDates,
  schedule: schedule,
  events: events,
  news: news,
  newsCategories: newsCategories,
  setApiAddress: setApiAddress
}
