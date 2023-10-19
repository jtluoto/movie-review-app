import React from 'react'

const MovieTitle = ({movie}) => {
  return (
    <span className='movieTitle movieDisplayTitle'>{movie.displayTitle}</span>
  )
}

export default MovieTitle
