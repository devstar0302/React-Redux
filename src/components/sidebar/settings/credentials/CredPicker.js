import React, { Component } from 'react'

import CredPickerView from './CredPickerView'

export default class CredPicker extends Component {
  componentWillMount () {
    this.props.fetchCredentials()
    this.props.selectCreds(null)
  }
  onSelect (p) {
    this.props.selectCreds(p)
  }
  closeModal () {
    const {onClose} = this.props
    onClose && onClose()
  }
  onClickOK () {
    const {selectedCreds, onClose} = this.props
    if (selectedCreds) {
      onClose && onClose(selectedCreds)
    }
  }
  render () {
    const {credentials, selectedCreds} = this.props
    return (
      <CredPickerView
        onSelect={this.onSelect.bind(this)}
        selectedCreds={selectedCreds}
        credentials={credentials}
        onClickOK={this.onClickOK.bind(this)}
        onHide={this.closeModal.bind(this)}
      />
    )
  }
}
