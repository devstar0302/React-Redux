import React from 'react'
import CredTypePickerView from './CredTypePickerView'

export default class CredTypePicker extends React.Component {
  componentWillMount () {
    this.props.fetchCredTypes()
    this.props.selectCredType(null)
  }
  onSelect (p) {
    this.props.selectCredType(p)
  }
  closeModal () {
    const {onClose} = this.props
    onClose && onClose()
  }
  onClickOK () {
    const {selectedCredType, onClose} = this.props
    if (selectedCredType) {
      onClose && onClose(selectedCredType)
    }
  }
  render () {
    const {credentialTypes, selectedCredType} = this.props
    return (
      <CredTypePickerView
        onSelect={this.onSelect.bind(this)}
        selectedCredType={selectedCredType}
        credentialTypes={credentialTypes}
        onClickOK={this.onClickOK.bind(this)}
        onHide={this.closeModal.bind(this)}
      />
    )
  }
}
