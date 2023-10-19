import React, { Component } from 'react'
import { Form, Dropdown } from 'semantic-ui-react'

const AREAS = [
  { value: 1014, text: 'Pääkaupunkiseutu' },
  { value: 1012, text: 'Espoo' },
  { value: 1039, text: 'Espoo: Iso-Omena' },
  { value: 1038, text: 'Espoo: Sello' },
  { value: 1002, text: 'Helsinki' },
  { value: 1031, text: 'Helsinki: Kinopalatsi' },
  { value: 1032, text: 'Helsinki: Maxim' },
  { value: 1033, text: 'Helsinki: Tennispalatsi' },
  { value: 1013, text: 'Vantaa: Flamingo' },
  { value: 1015, text: 'Jyväskylä: Fantasia' },
  { value: 1016, text: 'Kuopio: Scala' },
  { value: 1017, text: 'Lahti: Kuvapalatsi' },
  { value: 1041, text: 'Lappeenranta: Strand' },
  { value: 1018, text: 'Oulu: Plaza' },
  { value: 1019, text: 'Pori: Promenadi' },
  { value: 1021, text: 'Tampere' },
  { value: 1034, text: 'Tampere: Cine Atlas' },
  { value: 1035, text: 'Tampere: Plevna' },
  { value: 1022, text: 'Turku: Kinopalatsi' }
]

class ScheduleForm extends Component {
  render () {
    return (
      <Form className='scheduleForm' inverted>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Alue</label>
            <Dropdown
              selection
              options={AREAS}
              defaultValue={this.props.scheduleArea}
              onChange={(e, { value }) => this.props.onChangeScheduleArea(value)} />
          </Form.Field>

          <Form.Field>
            <label>Päivämäärä</label>
            <Dropdown
              selection
              options={this.props.scheduleDateOptions}
              defaultValue={this.props.scheduleDate}
              onChange={(e, { value }) => this.props.onChangeScheduleDate(value)} />
          </Form.Field>
        </Form.Group>
      </Form>
    )
  }
}

export default ScheduleForm
