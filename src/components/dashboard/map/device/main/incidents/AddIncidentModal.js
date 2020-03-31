import React, { Component } from 'react'
import { validate } from 'components/modal/validation/NameValidation'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import {severities} from 'shared/Global'

export default class AddIncidentModal extends Component {

  onClickClose () {
    console.log('trying to close')
    this.props.closeAddDeviceIncident()
  }

  onClickSave ({name, description, severity}) {
    this.props.addDeviceIncident({
      deviceid: this.props.device.id,
      name: name,
      description: description,
      category: 'simulation',
      severity: severity,
      acknowledged: 0,
      startTimestamp: new Date().getTime(),
      fixed: 0
    })
  }

  render () {
    let header = 'Add incident'
    let content = [
      {name: 'Name'},
      {name: 'Description'},
      {type: 'select', name: 'Severity', options: severities}
    ]
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.onClickSave.bind(this)}
        onClose={this.onClickClose.bind(this)}
        validate={validate}
        buttonText="Add Incident"
      />
    )
  }
}
