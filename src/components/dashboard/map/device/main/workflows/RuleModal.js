import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { validate } from 'components/modal/validation/KeyValue'
import { SimpleModalForm } from 'components/modal'

class RuleModal extends Component {
  handleFormSubmit (values) {
    const {editRule} = this.props
    let props = assign({}, editRule, values)
    this.props.onClose(props, editRule)
    this.props.closeDeviceRuleModal()
  }

  onClickClose () {
    this.props.closeDeviceRuleModal()
  }

  render () {
    const {handleSubmit} = this.props
    let header = 'Rule'
    let content = [
      {name: 'Key'},
      {name: 'Value'}
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
    initialValues: state.devices.editRule,
    validate: validate
  })
)(reduxForm({form: 'workflowRuleForm'})(RuleModal))
