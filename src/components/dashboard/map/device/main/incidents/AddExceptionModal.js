import React, { Component } from 'react'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/FilterValidation'

export default class AddExceptionModal extends Component {
  doAction (values) {
    console.log('doing some action when form submitted')
    console.log(values)
    // TODO
  }

  render () {
    let header = 'Add Exception'
    let subheader = (this.props.incident) ? (this.props.incident.rawtext) : ''
    let content = [
      {name: 'Filter'}
    ]
    return (
      <SimpleModalContainer
        header={header}
        subheader={subheader}
        content={content}
        doAction={this.doAction.bind(this)}
        onClose={this.props.onClose}
        validate={validate}
      />
    )
  }
}
