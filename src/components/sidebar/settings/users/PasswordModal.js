import React, { Component } from 'react'
import { assign } from 'lodash'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/Password'

export default class PasswordModal extends Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
  }

  closeModal () {
    this.props.closeUserPasswordModal()
  }

  updatePassword (values) {
    const {editUser} = this.props
    const user = assign({}, editUser, {
      password: values.password
    })
    this.props.updateSettingUser(user)
  }

  render () {
    let header = 'User password'
    let content = [
      {type: 'password', name: 'Password'},
      {type: 'password', name: 'Confirm'}
    ]
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.updatePassword}
        onClose={this.closeModal}
        validate={validate}
      />
    )
  }
}
