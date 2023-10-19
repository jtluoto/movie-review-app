import { LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER } from '../actions'

const initialState = {
  isAuthenticating: false,
  // eslint-disable-next-line
  isAuthenticated: sessionStorage.getItem('token') !== null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        isAuthenticating: true,
        isAuthenticated: false
      }
    case LOGIN_USER_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: true
      }
    case LOGIN_USER_FAILURE:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        loginFailedMessage: action.payload.statusText
      }
    case LOGOUT_USER:
      return {
        isAuthenticating: false,
        isAuthenticated: false
      }
    default: return state
  }
}
