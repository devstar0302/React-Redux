import React, { Component } from 'react'
import { assign } from 'lodash'
import {reduxForm} from 'redux-form'
import { connect } from 'react-redux'
import { closeWfActionModal } from 'actions'
import { SimpleModalForm } from 'components/modal'
import { validate } from 'components/modal/validation/NameValidation'

import {WorkflowActionTypes} from 'shared/Global'

class ActionModal extends Component {
  handleFormSubmit (values) {
    const {editWfAction} = this.props
    let props = assign({}, editWfAction, values)
    this.props.onClose(props, editWfAction)
    this.onClickClose()
  }

  onClickClose () {
    this.props.closeWfActionModal()
  }

  render () {
    const {handleSubmit} = this.props
    let header = 'Action'
    let content = [
      {name: 'Name'},
      {type: 'select', name: 'Type', key: 'actionType', options: WorkflowActionTypes},
      {name: 'Command'},
      {name: 'Params'}
    ]
    let buttonText = 'Save'
    return (
      <SimpleModalForm
        show
        onHide={this.onClickClose.bind(this)}
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
    editWfAction: state.devices.editWfAction,
    validate: validate,
    initialValues: assign({
      actionType: 'OPEN_INCIDENT'
    }, state.devices.editWfAction)
  }), {
    closeWfActionModal
  }
)(reduxForm({form: 'workflowActionForm2'})(ActionModal))
