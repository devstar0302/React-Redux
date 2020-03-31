import React from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'

import FwRuleModalView from './FwRuleModalView'

class FwRuleModal extends React.Component {
  onSubmit (values) {
    const {onSave} = this.props
    onSave && onSave(values)
    this.props.showFwRuleModal(false)
  }

  onHide () {
    this.props.showFwRuleModal(false)
  }

  render () {
    const {handleSubmit} = this.props
    return (
      <FwRuleModalView
        {...this.props}
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        onHide={this.onHide.bind(this)}
      />
    )
  }
}
export default connect(
  state => ({
    initialValues: {protocol: 'tcp', action: 'block'},
    formValues: formValueSelector('tabFirewallForm')(
      state, 'rule', 'program')
  })
)(reduxForm({form: 'firewallRuleForm'})(FwRuleModal))
