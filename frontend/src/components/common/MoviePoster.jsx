import React from 'react'

const MoviePoster = ({url}) => {
  if (!url) {
    return null
  }

  return (
    <img
      alt='Poster'
      className='movieListItemPortrait'
      src={convertProtocolToHtpps(url)}
    />
  )
}

function convertProtocolToHtpps (url) {
  return url.replace('http', 'https')
}

export default MoviePoster
