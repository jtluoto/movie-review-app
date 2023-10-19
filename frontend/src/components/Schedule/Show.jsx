import React from 'react'
import ReviewStars from '../MovieList/ReviewStars'
import MoviePoster from '../common/MoviePoster'
import _ from 'lodash'

const Show = ({ show, movie }) => {
  const reviewStars = movie && movie.average
    ? <ReviewStars movie={movie} />
    : <span>Elokuvalle ei ole vielä löydetty arvosteluita.</span>

  return (
    <div className='showInfo'>
      <div className='showTime'>
        <span>{ getShowTimeString(show) }</span>
      </div>
      <div className='showPoster'>
        <MoviePoster url={show.imageSmallPortrait} />
      </div>
      <div className='showInfoRightColumn'>
        <span className='movieDisplayTitle'>{ show.title }</span>
        <span className='theatre'>{ show.venue }</span>
        { reviewStars }
      </div>
    </div>
  )
}

function getShowTimeString (show) {
  const date = new Date(show.time)
  const hours = _.padStart(date.getHours(), 2, '0')
  const mins = _.padStart(date.getMinutes(), 2, '0')
  return `${hours}:${mins}`
}

export default Show
