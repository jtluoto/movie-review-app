import React, { Component } from 'react'
import moment from 'moment'

import ScheduleForm from './ScheduleForm'
import ShowList from './ShowList'

const NUMBER_OF_DAYS_IN_DROPDOWN = 15

class Schedule extends Component {
  constructor (props) {
    super(props)

    moment.updateLocale('fi', {
      weekdays: [
        'Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
        'Torstai', 'Perjantai', 'Lauantai'
      ]
    })

    const dates = this.getScheduleDates()

    this.state = {
      scheduleDateOptions: dates,
      scheduleDate: dates[0].value,
      scheduleArea: 1002
    }
  }

  componentDidMount () {
    if (!this.props.movies) {
      this.props.fetchMovies()
    }

    if (!this.props.schedule) {
      this.props.fetchSchedule(this.state.scheduleArea, this.state.scheduleDate)
    }
  }

  render () {
    return (
      <div>
        <ScheduleForm
          onChangeScheduleArea={this.changeScheduleArea.bind(this)}
          scheduleArea={this.state.scheduleArea}
          onChangeScheduleDate={this.changeScheduleDate.bind(this)}
          scheduleDate={this.state.scheduleDate}
          scheduleDateOptions={this.state.scheduleDateOptions}
        />

        <ShowList
          movies={this.props.movies}
          schedule={this.props.schedule} />
      </div>
    )
  }

  getScheduleDates () {
    var scheduleDates = []

    const today = moment()

    for (var i = 0; i < NUMBER_OF_DAYS_IN_DROPDOWN; i++) {
      const day = moment(today).add(i, 'days')

      scheduleDates.push({
        text: day.format('dddd DD.MM.YYYY'),
        value: day.format('DD.MM.YYYY')
      })
    }

    return scheduleDates
  }

  changeScheduleDate (newDate) {
    if (newDate !== this.state.scheduleDate) {
      this.setState({ scheduleDate: newDate })
      this.props.changeScheduleParams(this.state.scheduleArea, newDate)
    }
  }

  changeScheduleArea (newArea) {
    if (newArea !== this.state.scheduleArea) {
      this.setState({ scheduleArea: newArea })
      this.props.changeScheduleParams(newArea, this.state.scheduleDate)
    }
  }
}

export default Schedule
