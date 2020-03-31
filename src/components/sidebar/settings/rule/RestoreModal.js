import React, { Component } from 'react'
import { ROOT_URL } from 'actions/config'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'

export default class RestoreModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      files: []
    }
    this.closeModal = this.closeModal.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
  }

  componentWillMount () {
    $.get(`${ROOT_URL}${Api.rule.listOfBackupFiles}`, (res) => { // eslint-disable-line no-undef
      this.setState({ files: res.object })
    })
  }

  closeModal (data) {
    this.setState({ open: false }, () => {
      this.props.onClose && this.props.onClose(this, data)
    })
  }

  onClickSave ({name}) {
    $.get(`${ROOT_URL}${Api.rule.restoreRules}`, { // eslint-disable-line no-undef
      exportName: name
    }).done((res) => {
      showAlert('Restored successfully.')
      this.closeModal(true)
    }).fail(() => {
      showAlert('Restore failed!')
    })
  }

  renderOptions () {
    let files = this.state.files
    let options = files.map(item =>
      {
        value: item,
        label: item
      }
    )
  }

  render () {
    let header = 'Backup'
    let options = this.renderOptions()
    let content = [
      {type: 'select', name: 'Name', options: options}
    ]
    let buttonText = 'Restore'
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.onClickSave}
        onClose={this.closeModal}
        validate={validate}
        buttonText={buttonText}
      />
    )
  }
}
