import React from 'react'

const MovieOriginalTitle = ({ movie, showTitle }) => {
  if (movie.displayTitle === movie.originalDisplayTitle) {
    return null
  }

  const title = showTitle
    ? `Alkuperäisnimi: ${movie.originalDisplayTitle}`
    : `(${movie.originalDisplayTitle})`

  return (
    <span className='movieTitle movieOriginalDisplayTitle'>
      {title}
    </span>
  )
}

export default MovieOriginalTitle
