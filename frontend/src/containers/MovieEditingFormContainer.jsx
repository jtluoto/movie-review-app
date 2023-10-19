import { connect } from 'react-redux'
import { fetchMovieForEditing, saveMovie } from '../actions'
import MovieEditingForm from '../components/MovieEditingForm'

function mapStateToProps (state, ownProps) {
  return {
    movieForEditing: state.movieForEditing,
    initialValues: state.movieForEditing,
    saveMovieStatus: state.saveMovieStatus
  }
}

export default connect(mapStateToProps, { fetchMovieForEditing, saveMovie })(MovieEditingForm)
