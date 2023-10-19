import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { reduxForm, Field } from 'redux-form'
import { Input, Button, Form, Label, Message, Segment, Dimmer, Loader } from 'semantic-ui-react'

class LoginForm extends Component {
  renderField (field) {
    if (field.meta.touched && field.meta.error) {
      var errorLabel = <Label basic color='red' pointing>{ field.meta.error }</Label>
    } else {
      errorLabel = ''
    }

    return (
      <Form.Field>
        <label>{field.placeholder}</label>
        <Input
          type={field.type}
          placeholder={field.placeholder}
          {...field.input}
        />
        { errorLabel }
      </Form.Field>
    )
  }

  onSubmit (values) {
    const { username, password } = values
    this.props.login(username, password)
  }

  render () {
    const { handleSubmit } = this.props

    if (this.props.isAuthenticated) {
      // eslint-disable-next-line
      const user = sessionStorage.getItem('user')

      return (
        <Segment>
          <Message positive>
            <Message.Header>Sisäänkirjautuminen onnistui</Message.Header>
            <p>Olet kirjautunut sisään tunnuksella {user.username}.</p>
          </Message>

          <Button
            size='tiny'
            onClick={this.props.logout}
            primary>
              Kirjaudu ulos
          </Button>

          <Link to={`/`}>
            <Button size='tiny'>
              Etusivu
            </Button>
          </Link>

          <Link to={`/edit`}>
            <Button size='tiny'>
              Muokkaa elokuvia
            </Button>
          </Link>
        </Segment>
      )
    }

    return (
      <Segment>
        <Dimmer inverted active={this.props.isAuthenticating}>
          <Loader>Kirjaudutaan sisään...</Loader>
        </Dimmer>

        <Form size='big' key='big' onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Message negative hidden={!this.props.loginFailedMessage}>
            <Message.Header>{this.props.loginFailedMessage}</Message.Header>
            <p>Tarkista käyttäjätunnus ja salasana</p>
          </Message>

          <Field
            name='username'
            component={this.renderField}
            type='text'
            placeholder='Käyttäjätunnus'
          />

          <Field
            name='password'
            component={this.renderField}
            type='password'
            placeholder='Salasana'
          />
          <Button type='submit' primary>Kirjaudu</Button>
        </Form>
      </Segment>
    )
  }
}

function validate (values) {
  const errors = {}

  if (!values.username) {
    errors.username = 'Anna käyttäjätunnus'
  }

  if (!values.password) {
    errors.password = 'Anna salasana'
  }

  return errors
}

export default reduxForm({validate, form: 'login'})(LoginForm)
