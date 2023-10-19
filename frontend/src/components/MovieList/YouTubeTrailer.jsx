import React from 'react'

const YouTubeTrailer = ({movie}) => {
  return (
    <div className='videoWrapper'>
      <iframe
        title='trailer_iframe'
        width='560'
        height='315'
        src={`https://www.youtube.com/embed/${movie.youtubeTrailer}`}
        frameBorder='0'
        gesture='media'
        allow='encrypted-media'
        allowFullScreen
      />
    </div>
  )
}

export default YouTubeTrailer
