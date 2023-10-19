import React from 'react'
import { Icon } from 'semantic-ui-react'
import { renderStars, getSources, getSourceStars, getSourceReview } from '../../utils'

const ReviewStars = ({ movie }) => {
  const starBlocks = getSources().map(s => {
    if (!getSourceStars(movie, s.id)) {
      return null
    }

    var review = getSourceReview(movie, s.id)

    return (
      <div className='sourceNameAndReviewStars' key={`${movie.id}_${s.id}`}>
        <div className='sourceNameOfTheReview'>{renderWithReviewLink(movie, s.id, s.name)}</div>
        <div className='starsOfOneReview'>{renderStars(review.stars)}</div>
      </div>
    )
  })

  return (
    <div>
      <div className='sourceNameAndReviewStars averageStarsBlock'>
        <div className='sourceNameOfTheReview'>Keskiarvo</div>
        <div className='starsOfOneReview average'>{renderStars(movie.average)}</div>
      </div>
      { starBlocks }
    </div>
  )
}

function renderWithReviewLink (movie, sourceId, content) {
  var review = getSourceReview(movie, sourceId)

  if (review.link) {
    return (
      <div className='reviewLink'>
        <a href={review.link} target='_blank'>
          { content } <Icon className='linkIcon' name='external' />
        </a>
      </div>
    )
  } else {
    return content
  }
}

export default ReviewStars
