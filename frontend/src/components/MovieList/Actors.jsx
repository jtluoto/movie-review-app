import React from 'react'

const Actors = ({movie}) => {
  if (movie.actors && movie.actors.length) {
    var returnValue = 'Rooleissa: '

    var directors = []
    for (var a of movie.actors) {
      var firstName = a.firstName || ''
      var lastName = a.lastName || ''
      directors.push(`${firstName} ${lastName}`.trim())
    }

    returnValue += directors.join(', ')
    return <span className='movieActors'>{returnValue}</span>
  } else {
    return null
  }
}

export default Actors
