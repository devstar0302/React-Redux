import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { validate } from 'components/modal/validation/NameValidation'
import { SimpleModalForm } from 'components/modal'

class IdentityModal extends Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      segments: [],
      loading: true
    }
  }

  closeModal (data) {
    this.props.closeIdentityModal()
  }

  handleFormSubmit (params) {
    const props = assign({ identities: {} }, this.props.editIdentity)
    assign(props.identities, params)
    props.envvars = {}
    if (this.props.editIdentity) {
      this.props.updateIdentity(props)
    } else {
      this.props.addIdentity(props)
    }
  }

  render () {
    const { handleSubmit } = this.props
    let header = 'Identity'
    let content = [
      {name: 'Name'},
      {name: 'Description'},
      {name: 'Ip'},
      {name: 'Segment'},
      {name: 'Country'}
    ]
    let buttonText = 'Save'
    return (
      <SimpleModalForm
        show={this.state.open}
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        content={content}
        header={header}
        buttonText={buttonText}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: (state.settings.editIdentity || {}).identities,
    validate: validate
  })
)(reduxForm({form: 'identityEditForm'})(IdentityModal))
