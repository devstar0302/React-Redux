import React, { Component } from 'react'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'

import {ROOT_URL} from 'actions/config'

const header = 'Export map'
const content = [
  {name: 'Name'},
  {name: 'Description'}
]

export default class MapSaveModal extends Component {
  doAction (values) {
    document.location.href = `${ROOT_URL}/exportmap?mapid=${this.props.mapId}&name=${encodeURIComponent(values.name)}`
  }

  render () {
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.doAction.bind(this)}
        onClose={this.props.onClose}
        validate={validate}
      />
    )
  }
}
