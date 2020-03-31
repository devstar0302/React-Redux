import React from 'react'
import Rules from 'components/sidebar/settings/rule/Rules'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {withRouter} from 'react-router'

import {
  fetchWorkflowCategories,
  fetchWorkflows,
  openWorkflowModal,
  removeWorkflow,
  selectWorkflowCategory,

  addWorkflow,
  updateWorkflow,
  closeWorkflowModal,

  shareWorkflow
} from 'actions'

class RulesContainer extends React.Component {
  render () {
    return (
      <Rules {...this.props} />
    )
  }
}
export default connect(
  state => ({
    workflows: state.settings.workflows,
    editWorkflow: state.settings.editWorkflow,
    workflowModalVisible: state.settings.workflowModalVisible,
    workflowCategories: state.devices.workflowCategories,
    selectedWorkflowCategory: state.devices.selectedWorkflowCategory,
    shareWorkflowResult: state.settings.shareWorkflowResult
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchWorkflowCategories,
      fetchWorkflows,
      openWorkflowModal,
      removeWorkflow,
      selectWorkflowCategory,

      addWorkflow,
      updateWorkflow,
      closeWorkflowModal,

      shareWorkflow
    }, dispatch)
  })
)(withRouter(RulesContainer))
