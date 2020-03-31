import React from 'react'
import WorkflowModal from 'components/sidebar/settings/rule/WorkflowModal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { assign } from 'lodash'

import {
  fetchWorkflows,
  addWorkflow,
  updateWorkflow,
  closeWorkflowModal,
  fetchWorkflowCategories,

  openWfCategoryModal,
  closeWfCategoryModal,

  openWfActionModal,
  openDeviceWfDiagramModal,
  updateWorkflowEditType,

  showWorkflowTagModal,
  addWorkflowTag,
  removeWorkflowTag
} from 'actions'

class WorkflowModalContainer extends React.Component {
  render () {
    return (
      <WorkflowModal {...this.props} />
    )
  }
}
export default connect(
  state => ({
    editWorkflow: state.settings.editWorkflow,
    workflowEditType: state.settings.workflowEditType,

    workflowCategories: state.devices.workflowCategories,
    wfCategoryModalOpen: state.devices.wfCategoryModalOpen,
    wfActionModalOpen: state.devices.wfActionModalOpen,
    wfDiagramModalOpen: state.devices.wfDiagramModalOpen,

    wfTagModalOpen: state.settings.wfTagModalOpen,
    editWorkflowTags: state.settings.editWorkflowTags,

    initialValues: assign({
      enable: true,
      severity: 'HIGH'
    }, state.settings.editWorkflow)
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchWorkflows,
      addWorkflow,
      updateWorkflow,
      closeWorkflowModal,
      fetchWorkflowCategories,

      openWfCategoryModal,
      closeWfCategoryModal,

      openWfActionModal,
      openDeviceWfDiagramModal,
      updateWorkflowEditType,

      showWorkflowTagModal,
      addWorkflowTag,
      removeWorkflowTag
    }, dispatch)
  })
)(WorkflowModalContainer)
