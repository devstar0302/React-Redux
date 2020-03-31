import React from 'react'
import MainWorkflows from 'components/dashboard/map/device/main/workflows/MainWorkflows'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  openDeviceWorkflowModal,
  fetchDeviceWorkflows,
  removeDeviceWorkflow,

  addWorkflowTag,
  removeWorkflowTag,

  closeDeviceWorkflowModal,
  addDeviceWorkflow,
  updateDeviceWorkflow,
  fetchWorkflowCategories,
  openDeviceRuleModal,
  closeDeviceRuleModal,
  openWfCategoryModal,
  openWfActionModal,
  closeWfActionModal,
  openDeviceWfDiagramModal,

  addWfCategory,
  closeWfCategoryModal,

  fetchWorkflows,
  openSysWorkflowsModal,
  closeSysWorkflowsModal,
  selectSysWorkflow,
  deselectSysWorkflow,
  addDeviceWorkflows,
  selectSysWorkflowCategory,

  showWorkflowTagModal,

  addWorkflow
} from 'actions'

class MainRulesContainer extends React.Component {
  render () {
    return (
      <MainWorkflows {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    workflows: state.devices.workflows,
    workflowModalOpen: state.devices.workflowModalOpen,
    workflowListDraw: state.devices.workflowListDraw,

    editWorkflow: state.devices.editWorkflow,
    editWfAction: state.devices.editWfAction,
    editWfCategory: state.devices.editWfCategory,
    editRule: state.devices.editRule,

    workflowCategories: state.devices.workflowCategories,
    ruleModalOpen: state.devices.ruleModalOpen,
    wfCategoryModalOpen: state.devices.wfCategoryModalOpen,
    wfActionModalOpen: state.devices.wfActionModalOpen,
    wfDiagramModalOpen: state.devices.wfDiagramModalOpen,

    sysWorkflows: state.settings.workflows,
    sysWorkflowsModalOpen: state.devices.sysWorkflowsModalOpen,
    selectedSysWorkflows: state.devices.selectedSysWorkflows,
    selectedSysWorkflowCategory: state.devices.selectedSysWorkflowCategory,

    wfTagModalOpen: state.settings.wfTagModalOpen,
    editWorkflowTags: state.settings.editWorkflowTags
  }), {
    openDeviceWorkflowModal,
    fetchDeviceWorkflows,
    removeDeviceWorkflow,

    addWorkflowTag,
    removeWorkflowTag,

    closeDeviceWorkflowModal,
    addDeviceWorkflow,
    updateDeviceWorkflow,
    fetchWorkflowCategories,
    openDeviceRuleModal,
    closeDeviceRuleModal,
    openWfCategoryModal,
    openWfActionModal,
    closeWfActionModal,
    openDeviceWfDiagramModal,

    addWfCategory,
    closeWfCategoryModal,

    fetchWorkflows,
    openSysWorkflowsModal,
    closeSysWorkflowsModal,
    selectSysWorkflow,
    deselectSysWorkflow,
    addDeviceWorkflows,
    selectSysWorkflowCategory,

    showWorkflowTagModal,

    addWorkflow
  }
)(withRouter(MainRulesContainer))
