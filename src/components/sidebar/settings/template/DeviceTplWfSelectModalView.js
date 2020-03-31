import React from 'react'

import { TwoButtonsBlockCustom, Modal, CardPanel } from 'components/modal/parts'

export default class DeviceTplWfSelectModalView extends React.Component {
  render () {
    const {
      onClickClose, onClickSave, onClickRow,
      workflows, selectedRowWf
    } = this.props
    return (
      <Modal title="Workflow" onRequestClose={onClickClose}>
        <CardPanel className="margin-md-bottom">
          <div style={{maxHeight: '400px', overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Severity</th>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
              </thead>
              <tbody>
              {
                workflows.map(w =>
                  <tr
                    key={w.id}
                    className={selectedRowWf && selectedRowWf.id === w.id ? 'selected' : ''}
                    onClick={() => onClickRow(w)}
                  >
                    <td>{w.severity}</td>
                    <td>{w.name}</td>
                    <td>{w.desc}</td>
                    <td>{w.version}</td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
        </CardPanel>
        <TwoButtonsBlockCustom name2="OK" action2={onClickSave}/>
      </Modal>
    )
  }
}
