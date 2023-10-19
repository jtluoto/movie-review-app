import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import MoviesReducer from './MoviesReducer'
import MoviesForEditingReducer from './MoviesForEditingReducer'
import MovieForEditingReducer from './MovieForEditingReducer'
import SelectedMovieReducer from './SelectedMovieReducer'
import ModalWindowReducer from './ModalWindowReducer'
import AuthReducer from './AuthReducer'
import SaveMovieReducer from './SaveMovieReducer'
import ScheduleReducer from './ScheduleReducer'

const rootReducer = combineReducers({
  movies: MoviesReducer,
  moviesForEditing: MoviesForEditingReducer,
  movieForEditing: MovieForEditingReducer,
  form: formReducer,
  auth: AuthReducer,
  selectedMovie: SelectedMovieReducer,
  modalWindowOpen: ModalWindowReducer,
  saveMovieStatus: SaveMovieReducer,
  schedule: ScheduleReducer
})

export default rootReducer
