import { SAVE_MOVIE_REQUEST, SAVE_MOVIE_SUCCESS, SAVE_MOVIE_FAILURE } from '../actions'

const initialState = {
  savingMovie: false,
  savedMovieSuccessfully: false,
  savedMovieFailed: false,
  savingErrorStatusCode: null,
  savingErrorMessage: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_MOVIE_REQUEST:
      return {
        savingMovie: true,
        savedMovieSuccessfully: false,
        savedMovieFailed: false,
        savingErrorStatusCode: null,
        savingErrorMessage: null
      }
    case SAVE_MOVIE_SUCCESS:
      return {
        savingMovie: false,
        savedMovieSuccessfully: true,
        savedMovieFailed: false,
        savingErrorStatusCode: null,
        savingErrorMessage: null
      }
    case SAVE_MOVIE_FAILURE:
      return {
        savingMovie: false,
        savedMovieSuccessfully: false,
        savedMovieFailed: true,
        savingErrorStatusCode: action.statusCode,
        savingErrorMessage: action.error
      }
    default: return state
  }
}
