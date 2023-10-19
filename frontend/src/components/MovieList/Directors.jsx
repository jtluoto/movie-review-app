import React from 'react'

const Directors = ({movie}) => {
  var returnValue = 'Ohjaus: '

  if (movie.directors) {
    var directors = []
    for (var d of movie.directors) {
      var firstName = d.firstName || ''
      var lastName = d.lastName || ''
      directors.push(`${firstName} ${lastName}`.trim())
    }

    returnValue += directors.join(', ')
  }

  return <span className='movieDirectors'>{returnValue}</span>
}

export default Directors
