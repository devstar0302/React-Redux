import React from 'react'
import {IconButton} from 'material-ui'
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward'
import BackwardIcon from 'material-ui/svg-icons/navigation/arrow-back'
import {findIndex} from 'lodash'

export default class GaugeWorkflowPicker extends React.Component {
  renderRight () {
    const {tableClass, height, workflows, selectedWorkflows, selectedRight, onSelectRight} = this.props

    const wfs = []
    selectedWorkflows.forEach(id => {
      const index = findIndex(workflows, {id})
      if (index >= 0) wfs.push(workflows[index])
    })

    return (
      <div style={{height: height || 300, overflow: 'auto', border: '1px solid gray'}}>
        <table className={`table table-hover ${tableClass}`}>
          <tbody>
          <tr>
            <td><b>Selected</b></td>
          </tr>
          {wfs.map(p => {
            let isSel = selectedRight && p.id === selectedRight.id
            return (
              <tr
                key={p.id} className={isSel  ? 'selected' : ''}
                onClick={() => onSelectRight(p)}>
                <td>{p.name}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    )
  }

  render () {
    const {devices, selectedDevice, selectedWorkflow,
      onSelectDevice, onSelectWorkflow, onClickAddWorkflow, onClickRemoveWorkflow,
      workflows,
      tableClass, height
    } = this.props
    const wfs = []
    selectedDevice && (selectedDevice.workflowids || []).forEach(id => {
      const index = findIndex(workflows, {id})
      if (index >= 0) wfs.push(workflows[index])
    })
    return (
      <div className="padding-md-left padding-md-right">
        <div className="row">
          <div className="col-md-6 p-none">
            <div style={{height: height || 300, overflow: 'auto', border: '1px solid gray'}}>
              <table className={`table table-hover ${tableClass}`}>
                <tbody>
                <tr>
                  <td><b>Device</b></td>
                  <td><b>Workflow</b></td>
                </tr>
                {(devices || []).map((p, i) =>
                  <tr key={p.id}>
                    <td
                      width="50%"
                      className={selectedDevice && selectedDevice.id === p.id ? 'selected' : ''}
                      onClick={() => onSelectDevice(p)}>{p.name}</td>
                    <td
                      width="50%"
                      className={i < wfs.length && selectedWorkflow && selectedWorkflow.id === wfs[i].id ? 'selected' : ''}
                      onClick={i < wfs.length ? () => onSelectWorkflow(wfs[i]) : null}>
                      {i < wfs.length ? wfs[i].name : ''}
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-1 p-none">
            <IconButton onTouchTap={onClickAddWorkflow}>
              <ForwardIcon />
            </IconButton>
            <IconButton onTouchTap={onClickRemoveWorkflow}>
              <BackwardIcon />
            </IconButton>
          </div>
          <div className="col-md-5 p-none">
            {this.renderRight()}
          </div>
        </div>
      </div>
    )
  }
}
