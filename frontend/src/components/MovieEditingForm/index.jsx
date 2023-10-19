import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Input, Select, Button, Form, Label, Divider, Segment, Dimmer, Message } from 'semantic-ui-react'
import { getSources } from '../../utils'
import Loader from '../common/Loader'

class MovieEditingForm extends Component {
  componentDidMount () {
    const { movieId } = this.props.match.params
    this.props.fetchMovieForEditing(movieId)
  }

  renderSelect (field) {
    return (
      <Select
        placeholder={field.placeholder}
        options={this.getStarOptions()}
      />
    )
  }

  renderTextField (field) {
    if (field.meta.touched && field.meta.error) {
      var errorLabel =
        <Label basic color='red' pointing>{ field.meta.error }</Label>
    } else {
      errorLabel = ''
    }

    if (field.url) {
      var label = <a href={field.url} target='_'>{field.label}</a>
    } else {
      label = field.label
    }

    return (
      <Form.Field>
        <label>{label}</label>
        <Input
          type={field.type}
          placeholder={field.placeholder}
          {...field.input}
        />
        { errorLabel }
      </Form.Field>
    )
  }

  renderComboBoxHtml (field) {
    return (
      <Form.Field
        className='selectStars'
        label={field.label}
        control='select' {...field.input}
        placeholder={field.placeholder}>
        <option value='null'>{field.placeholder}</option>
        <option value='1'>★</option>
        <option value='2'>★★</option>
        <option value='3'>★★★</option>
        <option value='4'>★★★★</option>
        <option value='5'>★★★★★</option>
      </Form.Field>
    )
  }

  getStarString (stars) {
    var result = ''

    for (var i = 0; i < stars; i++) {
      result += '★'
    }

    return result
  }

  getStarOptions () {
    var options = []
    options.push({key: 0, text: 'Ei valintaa', value: null})

    for (var i = 1; i <= 5; i++) {
      options.push({key: i, text: this.getStarString(i), value: i})
    }

    return options
  }

  renderCheckbox (field) {
    return (
      <div className='hideReviewCheckbox'>
        <Form.Field
          control='input'
          type='checkbox'
          label={field.label}
          {...field.input} />
      </div>
    )
  }

  toInteger (value) {
    return value === undefined ? undefined : parseInt(value, 10)
  }

  emptyStringToNull (value) {
    if (!value) {
      return null
    } else {
      return value
    }
  }

  render () {
    const { movieId } = this.props.match.params
    const movie = this.props.movieForEditing
    const movieNotLoadedYet = !movie || movie.id !== movieId

    if (movieNotLoadedYet) {
      return (<Loader />)
    }

    const { handleSubmit } = this.props

    const reviews = getSources().map(source => {
      const scrapedStars = movie.scrapedReviews[source.id].stars
      const starString = this.getStarString(scrapedStars)
      const starsPlaceholder = starString ? `Löydetyn tähdet: ${scrapedStars}` : ''

      return (
        <div key={source.id} className='editMovieReviewBox'>
          <h2>{source.name}</h2>
          <Field
            name={`reviews[${source.id}].hideReview`}
            component={this.renderCheckbox}
            type='checkbox'
            label='Piilota arvostelu'
          />

          <Form.Group widths='equal'>
            <Field
              name={`reviews[${source.id}].stars`}
              component={this.renderComboBoxHtml.bind(this)}
              parse={this.toInteger}
              type='select'
              label='Arvostelun tähdet'
              placeholder={starsPlaceholder}
            />

            <Field
              name={`reviews[${source.id}].link`}
              component={this.renderTextField}
              normalize={this.emptyStringToNull}
              type='text'
              label='Arvostelun URL'
              url={movie.scrapedReviews[source.id].link}
              placeholder={movie.scrapedReviews[source.id].link}
            />
          </Form.Group>

          <Divider className='editMovieDivider' />
        </div>
      )
    })

    const { savingMovie, savingErrorMessage, savingErrorStatusCode } = this.props.saveMovieStatus

    return (
      <div className='editMovieForm'>
        <h1>{this.props.movieForEditing.title}</h1>
        <Form size='large' onSubmit={handleSubmit(this.onSubmit.bind(this))}>

          <Segment>
            <Dimmer active={savingMovie} inverted />
            <Field
              name='displayTitle'
              component={this.renderTextField}
              type='text'
              label='Näytettävä nimi'
            />

            <Field
              name='originalDisplayTitle'
              component={this.renderTextField}
              type='text'
              label='Alkuperäisnimi'
            />
          </Segment>

          <Segment>
            <Dimmer className='customDimmer' active={savingMovie} inverted />
            { reviews }
          </Segment>

          <Message
            positive
            hidden={!this.props.saveMovieStatus.savedMovieSuccessfully}
            icon='check'
            header='Tallennus onnistui!'
            content='Elokuvan tiedot tallennettiin onnistuneesti'
          />

          <Message
            negative
            hidden={!this.props.saveMovieStatus.savedMovieFailed}
            icon='warning'
            header='Tallennus epäonnistui!'
            content={`Virhe: ${savingErrorStatusCode} ${savingErrorMessage}`}
          />

          <Button loading={savingMovie} disabled={savingMovie} type='submit' primary>Tallenna</Button>
        </Form>
      </div>
    )
  }

  onSubmit (movie) {
    this.props.saveMovie(movie)
  }
}

function validate (values) {
  var errors = {}

  if (!values.displayTitle) {
    errors.displayTitle = 'Anna näytettävä nimi!'
  }

  if (!values.originalDisplayTitle) {
    errors.originalDisplayTitle = 'Anna näytettävä alkuperäisnimi!'
  }

  return errors
}

export default reduxForm({validate, form: 'editMovie', enableReinitialize: true})(MovieEditingForm)
