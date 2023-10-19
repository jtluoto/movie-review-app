import { connect } from 'react-redux'
import { fetchMoviesForEditing } from '../actions'
import MovieEditingList from '../components/MovieEditingList'

function mapStateToProps (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    moviesForEditing: state.moviesForEditing
  }
}

export default connect(mapStateToProps, { fetchMoviesForEditing })(MovieEditingList)
