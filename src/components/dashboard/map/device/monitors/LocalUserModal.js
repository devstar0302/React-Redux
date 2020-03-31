import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

import LocalUserModalView from './LocalUserModalView'

class LocalUserModal extends React.Component {
  onSubmit (values) {
    const {onSave} = this.props
    onSave && onSave(values)
    this.onClickClose()
  }
  onClickClose () {
    this.props.showLocalUserModal(false)
  }
  render () {
    const {handleSubmit} = this.props
    return (
      <LocalUserModalView
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        onClickClose={this.onClickClose.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: {}
  })
)(reduxForm({form: 'localUserForm'})(LocalUserModal))
