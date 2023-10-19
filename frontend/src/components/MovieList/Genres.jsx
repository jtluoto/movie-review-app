import React from 'react'

const Genres = ({movie}) => {
  // Every genre is capitalized in Finnkino's API
  var genres = onlyFirstLetterCapitalized(movie.genres)

  if (genres) {
    return (
      <div className='movieGenres'>
        { genres }
      </div>
    )
  } else {
    return null
  }
}

function onlyFirstLetterCapitalized (str) {
  if (str) {
    var lc = str.toLowerCase()
    return lc.charAt(0).toUpperCase() + lc.slice(1)
  } else {
    return ''
  }
}

export default Genres
