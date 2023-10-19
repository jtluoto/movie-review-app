import React from 'react'

export function removeDuplicates (movies) {
  var foundTitles = []
  var uniqueMovies = []

  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i]
    if (!foundTitles.includes(movie.displayTitle)) {
      foundTitles.push(movie.displayTitle)
      uniqueMovies.push(movie)
    }
  }

  return uniqueMovies
}

export function calculateAverages (movies) {
  const moviesWithAverages = JSON.parse(JSON.stringify(movies))

  for (var movie of moviesWithAverages) {
    movie.average = calculateAverage(movie)
  }

  return moviesWithAverages
}

export function sortMoviesByAverage (movies) {
  const sortedMovies = JSON.parse(JSON.stringify(movies))

  sortedMovies.sort(function compare (a, b) {
    var result = sortByAverage(a, b)

    if (result === 0) {
      result = sortByNumberOfReviews(a, b)
    }

    if (result === 0) {
      result = sortByTitle(a, b)
    }

    return result
  })

  return sortedMovies
}

function sortByAverage (a, b) {
  if (a.average < b.average) {
    return 1
  } else if (a.average > b.average) {
    return -1
  } else {
    return 0
  }
}

function sortByNumberOfReviews (a, b) {
  var reviewsForA = countNumberOfReviews(a)
  var reviewsForB = countNumberOfReviews(b)

  if (reviewsForA < reviewsForB) {
    return 1
  } else if (reviewsForA > reviewsForB) {
    return -1
  } else {
    return 0
  }
}

function sortByTitle (a, b) {
  return a.title.localeCompare(b.title)
}

function countNumberOfReviews (movie) {
  var count = 0

  for (var source of getSources()) {
    if (movie.reviews[source.id].stars ||
          movie.scrapedReviews[source.id].stars) {
      count++
    }
  }

  return count
}

export function calculateAverage (movie) {
  var combinedStars = []

  for (var source of getSources()) {
    var sourceStars = getSourceStars(movie, source.id)

    if (sourceStars) {
      combinedStars.push(sourceStars)
    }
  }

  var numberOfStars = combinedStars.length

  if (numberOfStars === 0) {
    return 0
  } else {
    var sum = combinedStars.reduce(function (a, b) { return a + b }, 0)
    return Math.round(10 * (sum / numberOfStars)) / 10
  }
}

export function getSources () {
  return [
    {id: 'hs', name: 'HS'},
    {id: 'al', name: 'Aamulehti'},
    {id: 'isa', name: 'Ilta-Sanomat'},
    {id: 'il', name: 'Iltalehti'}
  ]
}

export function renderStars (stars) {
  // The parameter can be either from a review
  // or the average of the review stars
  var closestHalf = Math.round(stars * 2) / 2
  var fullStars = Math.floor(closestHalf)
  var hasHalf = (closestHalf - fullStars) > 0

  var result = []

  for (var i = 0; i < fullStars; i++) {
    result.push(<span key={i} className='star-icon full'>☆</span>)
  }

  if (hasHalf) {
    result.push(<span key='half' className='star-icon half'>☆</span>)
  }

  if (result) {
    return result
  } else {
    return (<span>-</span>)
  }
}

export function getSourceStars (movie, sourceId) {
  return getSourceReview(movie, sourceId).stars
}

export function getSourceReview (movie, sourceId) {
  var review = movie.reviews[sourceId]
  var scrapedReview = movie.scrapedReviews[sourceId]

  if (review && review.hideReview) {
    return {stars: 0}
  }

  if (review && review.stars) {
    // The movie has manually defined stars for the source
    return review
  } else if (scrapedReview && scrapedReview.stars) {
    // The movie has scraped stars for this source
    return scrapedReview
  } else {
    return {stars: 0}
  }
}
