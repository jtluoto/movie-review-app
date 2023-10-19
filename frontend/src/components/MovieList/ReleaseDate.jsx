import React from 'react'

const ReleaseDate = ({movie}) => {
  if (movie.releaseDate) {
    var date = new Date(movie.releaseDate)
  }

  if (date) {
    var dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  return (
    <div className='movieReleaseDate'>
      Ensi-ilta { dateString }
    </div>
  )
}

export default ReleaseDate
