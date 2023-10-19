import React, { Component } from 'react'
import Loader from '../common/Loader'
import Show from './Show'
import { calculateAverages } from '../../utils'

const MOVIE_TITLE_CLEANUP_REGEX = /\((dub|3D|2D|orig|svensk|väliajalla ja tarjoiluilla|suom|pohjoissaam|kansainvälinen versio|erikoisnäytös|\s|\.)*\)|( 3D$)|( 2D$)/gi

class ScheduleForm extends Component {
  render () {
    if (!this.props.movies || !this.props.schedule) {
      return <Loader />
    }

    const shows = this.renderShows()

    if (shows.length) {
      return (
        <div>
          { shows }
        </div>
      )
    } else {
      return (
        <h1>Valitulle päivälle ja alueelle ei löytynyt näytöksiä.</h1>
      )
    }
  }

  renderShows () {
    const movies = calculateAverages(this.props.movies)

    const shows = this.props.schedule.filter(show => {
      return this.notStartedYet(show)
    }).map(show => {
      const movie = this.findMovieByShowTitle(show.title, movies)

      return (
        <Show key={show.id} show={show} movie={movie} />
      )
    })

    return shows
  }

  notStartedYet (show) {
    const now = new Date()
    const showTime = new Date(show.time)
    return now < showTime
  }

  getDisplayTitle (title) {
    var displayTitle = title.replace(MOVIE_TITLE_CLEANUP_REGEX, '')
    return displayTitle.trim()
  }

  findMovieByShowTitle (title, movies) {
    const displayTitle = this.getDisplayTitle(title)

    for (var m of movies) {
      if (m.average === 0) {
        continue
      }

      if (m.displayTitle === displayTitle) {
        return m
      }
    }

    return null
  }
}

export default ScheduleForm
