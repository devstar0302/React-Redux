import React from 'react'
import { assign } from 'lodash'

import SysWorkflowsModalView from './SysWorkflowsModalView'

class SysWorkflowsModal extends React.Component {
  componentWillMount () {
    this.props.fetchWorkflowCategories()
    this.props.fetchWorkflows()
  }

  onClickClose () {
    this.props.closeSysWorkflowsModal()
  }

  onChangeCategory (e, i, val) {
    this.props.selectSysWorkflowCategory(val)
  }

  getSysWorkflows () {
    const { selectedSysWorkflowCategory } = this.props
    return this.props.sysWorkflows.filter(m => m.origin === 'SYSTEM' && (!selectedSysWorkflowCategory || (m.tags || []).indexOf(selectedSysWorkflowCategory) >= 0))
  }

  onChangeCheck (workflow, e, checked) {
    if (checked) {
      this.props.selectSysWorkflow(workflow)
    } else {
      this.props.deselectSysWorkflow(workflow)
    }
  }

  onClickAdd () {
    const workflows = this.props.selectedSysWorkflows.map(workflow => assign({}, workflow, {id: null, isGlobal: false, origin: 'USER'}))
    this.props.addDeviceWorkflows(workflows, this.props.device)
  }

  render () {
    return (
      <SysWorkflowsModalView
        {...this.props}
        header="System Workflows"
        sysWorkflows={this.getSysWorkflows()}
        onChangeCategory={this.onChangeCategory.bind(this)}
        onChangeCheck={this.onChangeCheck.bind(this)}
        onClickClose={this.onClickClose.bind(this)}
        onClickAdd={this.onClickAdd.bind(this)}
      />
    )
  }
}

export default SysWorkflowsModal
