import React, { Component } from 'react'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'

export default class NewIncidentModal extends Component {
  doAction (values) {
    console.log('doing some action when form submitted')
    console.log(values)
  }

  render () {
    let header = 'New Incident'
    let options = [
      { value: 'High', label: 'High' },
      { value: 'Medium', label: 'Medium' },
      { value: 'Low', label: 'Low' },
      { value: 'Audit', label: 'Audit' }
    ]
    let content = [
      {name: 'Name'},
      {name: 'Description'},
      {type: 'select', name: 'Severity', options: options}
    ]
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.doAction.bind(this)}
        onClose={this.props.onClose}
        validate={validate}
        imageUpload
      />
    )
  }
}
