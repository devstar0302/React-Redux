import React from 'react'
import { CloseButton, Modal, CardPanel } from 'components/modal/parts'

export default class IrrelDevicesModalView extends React.Component {
  renderItems () {
    const {irrelDevices} = this.props
    return irrelDevices.map(d =>
      <tr key={d}>
        <td>{d}</td>
      </tr>
    )
  }
  render () {
    const {onHide} = this.props
    return (
      <Modal title="Not Relevant Devices" onRequestClose={onHide}>
        <CardPanel title="Not Relevant Devices">
          <div style={{height: '500px', overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {this.renderItems()}
              </tbody>
            </table>
          </div>
        </CardPanel>
        <CloseButton onClose={onHide} />
      </Modal>
    )
  }
}
