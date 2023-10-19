import { connect } from 'react-redux'
import { fetchMovies, fetchSchedule, changeScheduleParams } from '../actions'
import Schedule from '../components/Schedule'

function mapStateToProps (state) {
  return {
    movies: state.movies,
    schedule: state.schedule
  }
}

export default connect(mapStateToProps, { fetchMovies, fetchSchedule, changeScheduleParams })(Schedule)
