import React from 'react'
import { Link } from 'react-router-dom'
import MovieTitle from '../common/MovieTitle'
import MoviePoster from '../common/MoviePoster'
import MovieOriginalTitle from '../common/MovieOriginalTitle'
import ReviewStars from './ReviewStars'
import Directors from './Directors'

const MovieListItem = ({movie, openModal}) => {
  if (movie.average === 0) {
    return null
  }

  // eslint-disable-next-line
  const user = JSON.parse(sessionStorage.getItem('user'))
  const adminLoggedIn = (user && user.admin)

  if (adminLoggedIn) {
    var editButton = (
      <Link to={`/edit/${movie.id}`}>
        <button className='linkButton'>
          Muokkaa
        </button>
      </Link>
    )
  }

  return (
    <div className='movieListItem'>
      <div className='movieListItemLeftColumn'>
        <MoviePoster url={movie.imageSmallPortrait} />
        <button className='linkButton' onClick={() => openModal(movie)}>
          <span>Lisätietoja</span>
        </button>
        { editButton }
      </div>
      <div className='movieListItemRightColumn'>
        <div className='movieTitles'>
          <MovieTitle movie={movie} />
          <MovieOriginalTitle movie={movie} />
        </div>
        <Directors movie={movie} />
        <ReviewStars movie={movie} />
      </div>
    </div>
  )
}

export default MovieListItem
