import React from 'react'
import IrrelDevicesModalView from './IrrelDevicesModalView'

export default class IrrelDevicesModal extends React.Component {
  onHide () {
    this.props.showIrrelDevicesModal(false)
  }
  render () {
    return (
      <IrrelDevicesModalView
        irrelDevices={this.props.irrelDevices}
        onHide={this.onHide.bind(this)}
      />
    )
  }
}
