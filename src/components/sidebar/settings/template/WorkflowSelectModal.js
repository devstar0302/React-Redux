import React from 'react'

import DeviceTplWfSelectModalView from './DeviceTplWfSelectModalView'

export default class WorkflowSelectModal extends React.Component {
  componentWillMount () {
    this.props.fetchWorkflows()
  }

  onHide () {
  }

  onClickClose () {
    this.props.showWfSelectModal(false)
  }

  onClickSave () {
    const {selectedRowWf} = this.props
    if (!selectedRowWf) return
    this.props.addDeviceTplWf(selectedRowWf)
    this.onClickClose()
  }

  onClickRow (wf) {
    this.props.selectTplWfRow(wf)
  }

  render () {
    return (
      <DeviceTplWfSelectModalView
        {...this.props}
        onClickRow={this.onClickRow.bind(this)}
        onClickSave={this.onClickSave.bind(this)}
        onClickClose={this.onClickClose.bind(this)}
      />
    )
  }
}
