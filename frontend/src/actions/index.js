import axios from 'axios'
import jwtDecode from 'jwt-decode'

export const LOGIN_USER = 'login_user'
export const LOGIN_USER_REQUEST = 'login_user_request'
export const LOGIN_USER_SUCCESS = 'login_user_success'
export const LOGIN_USER_FAILURE = 'login_user_failure'
export const LOGOUT_USER = 'logout_user'
export const OPEN_MODAL = 'open_modal'
export const CLOSE_MODAL = 'close_modal'
export const FETCH_MOVIES = 'fetch_movies'
export const FETCH_MOVIES_FOR_EDITING = 'fetch_movies_for_editing'
export const FETCH_MOVIE_FOR_EDITING = 'fetch_movie_for_editing'
export const SAVE_MOVIE = 'save_movie'
export const SAVE_MOVIE_REQUEST = 'save_movie_request'
export const SAVE_MOVIE_SUCCESS = 'save_movie_success'
export const SAVE_MOVIE_FAILURE = 'save_movie_failure'
export const SCHEDULE_FETCHED = 'schedule_fetched'
export const SCHEDULE_LOADING = 'schedule_loading'

export function loginUserRequest () {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function loginUserSuccess (token, user) {
  // eslint-disable-next-line
  sessionStorage.setItem('token', token)
  // eslint-disable-next-line
  sessionStorage.setItem('user', user)

  return {
    type: LOGIN_USER_SUCCESS
  }
}

export function loginUserFailure (response) {
  clearUserFromSessionStorage()

  return {
    type: LOGIN_USER_FAILURE,
    payload: response
  }
}

function clearUserFromSessionStorage () {
  // eslint-disable-next-line
  sessionStorage.removeItem('token')
  // eslint-disable-next-line
  sessionStorage.removeItem('user')
}

export function logout () {
  clearUserFromSessionStorage()

  return {
    type: LOGOUT_USER
  }
}

export function login (username, password) {
  return dispatch => {
    dispatch(loginUserRequest())

    const url = `${process.env.REACT_APP_API_BASE_URL}/jwt`
    const headers = {'x-api-key': `${process.env.REACT_APP_API_KEY}`}

    return axios.post(url, {username, password}, {headers})
      .then((response) => {
        const { token } = response.data
        const user = jwtDecode(token)
        dispatch(loginUserSuccess(token, JSON.stringify(user)))
      }).catch((e) => {
        dispatch(loginUserFailure({
          status: 403,
          statusText: 'Kirjautuminen epäonnistui'
        }))
      })
  }
}

export function openModal (movie) {
  return {
    type: OPEN_MODAL,
    payload: movie
  }
}

export function closeModal () {
  return {
    type: CLOSE_MODAL
  }
}

export function fetchSchedule (area, date) {
  return dispatch => {
    movieClient().get(`/schedule?area=${area}&date=${date}`)
      .then((schedule) => {
        dispatch(scheduleFetched(schedule.data))
      })
  }
}

function scheduleFetched (result) {
  return {
    type: SCHEDULE_FETCHED,
    payload: result
  }
}

export function changeScheduleParams (area, date) {
  return dispatch => {
    dispatch(scheduleLoading())
    dispatch(fetchSchedule(area, date))
  }
}

function scheduleLoading () {
  return {
    type: SCHEDULE_LOADING
  }
}

export function fetchMovies () {
  const request = movieClient().get('/movies')

  return {
    type: FETCH_MOVIES,
    payload: request
  }
}

export function fetchMoviesForEditing () {
  const request = movieClient().get('/movies?all=true')

  return {
    type: FETCH_MOVIES_FOR_EDITING,
    payload: request
  }
}

export function fetchMovieForEditing (id) {
  const request = movieClient().get(`/movies/${id}`)

  return {
    type: FETCH_MOVIE_FOR_EDITING,
    payload: request
  }
}

function saveMovieRequest () {
  return {
    type: SAVE_MOVIE_REQUEST
  }
}

function saveMovieSuccess (token) {
  return {
    type: SAVE_MOVIE_SUCCESS
  }
}

function saveMovieFailure (statusCode, error) {
  return {
    type: SAVE_MOVIE_FAILURE,
    statusCode: statusCode,
    error: error
  }
}

export function saveMovie (movie) {
  return dispatch => {
    dispatch(saveMovieRequest())

    return movieClient().put('/movies', {movies: [movie]})
      .then((response) => {
        dispatch(saveMovieSuccess())
      }).catch((e) => {
        if (e.response && e.response.data) {
          var {statusCode, error} = e.response.data
        }

        dispatch(saveMovieFailure(statusCode, error))
      })
  }
}

export function saveMovieOld (movie) {
  const request = movieClient().put('/movies', {movies: [movie]})

  return {
    type: SAVE_MOVIE,
    payload: request
  }
}

function movieClient () {
  // eslint-disable-next-line
  const token = sessionStorage.getItem('token')

  return axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': process.env.REACT_APP_API_KEY
    }
  })
}
