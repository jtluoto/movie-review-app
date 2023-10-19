import React from 'react'
import { Modal } from 'semantic-ui-react'
import MovieTitle from '../common/MovieTitle'
import MovieOriginalTitle from '../common/MovieOriginalTitle'
import ReviewStars from './ReviewStars'
import Directors from './Directors'
import Actors from './Actors'
import ReleaseDate from './ReleaseDate'
import Genres from './Genres'
import Synopsis from './Synopsis'
import YouTubeTrailer from './YouTubeTrailer'

const MoreInfoModal = (props) => {
  const movie = props.movie

  if (!movie) {
    return null
  }

  return (
    <Modal className='moreInfoModal' closeIcon open={props.modalWindowOpen}
      onClose={() => props.closeModal(movie)}>
      <Modal.Content>
        <MovieTitle movie={movie} />
        <MovieOriginalTitle movie={movie} showTitle />
        <Directors movie={movie} />
        <Genres movie={movie} />
        <ReleaseDate movie={movie} />
        <YouTubeTrailer movie={movie} />
        <Synopsis movie={movie} />
        <Actors movie={movie} />
        <ReviewStars movie={movie} />
      </Modal.Content>
    </Modal>
  )
}

export default MoreInfoModal
