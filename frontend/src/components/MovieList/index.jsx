import React, { Component } from 'react'
import { removeDuplicates, calculateAverages, sortMoviesByAverage } from '../../utils'
import Loader from '../common/Loader'
import MovieListItem from './MovieListItem'
import MoreInfoModal from './MoreInfoModal'

class MovieList extends Component {
  componentDidMount () {
    this.props.fetchMovies()
  }

  render () {
    if (!this.props.movies) {
      return (
        <Loader />
      )
    }

    var movies = removeDuplicates(this.props.movies)
    movies = calculateAverages(movies)
    movies = sortMoviesByAverage(movies)

    const movieListItems = movies.map((movie, index) => {
      return (
        <MovieListItem
          key={movie.id}
          movie={movie}
          openModal={(movie) => this.props.openModal(movie)}
        />
      )
    })

    return (
      <div>
        {movieListItems}
        <MoreInfoModal
          movie={this.props.selectedMovie}
          modalWindowOpen={this.props.modalWindowOpen}
          closeModal={() => this.props.closeModal()}
        />
      </div>)
  }
}

export default MovieList
