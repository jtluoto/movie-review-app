import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMovies, openModal, closeModal } from '../actions'
import MovieList from '../components/MovieList'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchMovies,
    openModal,
    closeModal
  }, dispatch)
}

function mapStateToProps (state) {
  return {
    movies: state.movies,
    selectedMovie: state.selectedMovie,
    modalWindowOpen: state.modalWindowOpen
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList)
