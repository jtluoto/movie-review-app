import React, { Component } from 'react'
import Loader from '../common/Loader'
import { Link } from 'react-router-dom'

class MovieEditingList extends Component {
  componentDidMount () {
    this.props.fetchMoviesForEditing()
  }

  getEditableMovieList () {
    var movies = this.props.moviesForEditing.slice(0)
    movies.sort((a, b) => {
      if (a.displayTitle < b.displayTitle) {
        return -1
      } else if (b.displayTitle < a.displayTitle) {
        return 1
      } else {
        return 0
      }
    })

    return movies.map((movie) => {
      return (
        <div className='editMovieListItem' key={`movie_link_${movie.id}`}>
          <Link to={`/edit/${movie.id}`}>
            <h2>{`${movie.displayTitle} - ${movie.id}`}</h2>
          </Link>
        </div>
      )
    })
  }

  render () {
    if (!this.props.moviesForEditing) {
      return (
        <Loader />
      )
    } else {
      return (
        <div>
          <h1>Valitse muokattava elokuva</h1>
          { this.getEditableMovieList() }
        </div>
      )
    }
  }
}

export default MovieEditingList
