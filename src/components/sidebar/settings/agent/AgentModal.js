import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import AgentModalView from './AgentModalView'

class AgentModal extends React.Component {
  onClickClose () {
    this.props.showAgentModal(false)
  }
  handleFormSubmit (values) {
    const {editAgent} = this.props
    if (editAgent) {
      this.props.updateAgent({
        ...editAgent,
        ...values
      })
    } else {
      this.props.addAgent(values)
    }
  }
  render () {
    const {handleSubmit} = this.props
    return (
      <AgentModalView
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onHide={this.onClickClose.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.editAgent
  })
)(reduxForm({form: 'agentForm'})(AgentModal))
