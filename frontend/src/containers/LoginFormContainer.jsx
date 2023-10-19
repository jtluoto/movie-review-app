import { connect } from 'react-redux'
import { login, logout } from '../actions'
import LoginForm from '../components/LoginForm'

function mapStateToProps (state) {
  return {
    isAuthenticating: state.auth.isAuthenticating,
    isAuthenticated: state.auth.isAuthenticated,
    loginFailedMessage: state.auth.loginFailedMessage
  }
}

export default connect(mapStateToProps, { login, logout })(LoginForm)
