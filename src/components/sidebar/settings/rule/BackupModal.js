import React, { Component } from 'react'
import { showAlert } from 'components/common/Alert'
import { ROOT_URL } from 'actions/config'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'

export default class BackupModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
    this.onClickSave = this.onClickSave.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal (data) {
    this.setState({ open: false }, () => {
      this.props.onClose && this.props.onClose(this, data)
    })
  }

  onClickSave (values) {
    const name = values.name
    const desc = values.description

    if (!name) {
      showAlert('Please input backup name.')
      return
    }

    $.get(`${ROOT_URL}${Api.rule.backupRules}`, { // eslint-disable-line no-undef
      exportName: name,
      description: desc
    }).done((res) => {
      showAlert('Backup created successfully.')

      this.closeModal()
    }).fail(() => {
      showAlert('Backup failed!')
    })
  }

  render () {
    let header = 'Backup'
    let content = [
      {name: 'Name'},
      {name: 'Description'}
    ]
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.onClickSave}
        onClose={this.closeModal}
        validate={validate}
      />
    )
  }
}
