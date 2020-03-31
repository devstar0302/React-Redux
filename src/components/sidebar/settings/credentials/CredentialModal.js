import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { validate } from 'components/modal/validation/NameValidation'
import { SimpleModalForm } from 'components/modal'

class CredentialModal extends Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
  }

  closeModal () {
    this.props.closeCredentialsModal()
  }

  handleFormSubmit (values) {
    const { editCredentials } = this.props
    let props = assign({}, editCredentials, values)
    if (editCredentials) {
      this.props.updateCredentials(props)
    } else {
      this.props.addCredentials(props)
    }
  }

  render () {
    const { handleSubmit, credentialTypes } = this.props
    const content = [
      {name: 'Name'},
      {name: 'User Name'},
      {name: 'Password'},
      {name: 'Type', type: 'select', options: credentialTypes.map(t => ({label: t.name, value: t.name}))},
      {name: 'Description'},
      {name: 'Global', type: 'checkbox'}
    ]

    return (
      <SimpleModalForm
        show
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        content={content}
        header="Credentials"
        buttonText="Save"
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.editCredentials,
    validate: validate
  })
)(reduxForm({form: 'credentialsEditForm'})(CredentialModal))
