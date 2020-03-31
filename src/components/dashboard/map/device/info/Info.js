import React from 'react'
import { assign } from 'lodash'

import DeviceEditWizardContainer from 'containers/shared/wizard/DeviceEditWizardContainer'
import { deviceTypeMap } from 'components/common/wizard/WizardConfig'

export default class Info extends React.Component {
  componentDidMount () {
    this.props.updateDeviceCreds(this.props.device.credentials || [])
  }
  onFinish (params) {
    const device = assign({}, this.props.device, params)
    this.props.updateMapDevice(device)
  }

  render () {
    const {device} = this.props

    let type = deviceTypeMap[device.type] || device.type || 'custom'
    let extraParams = {

    }

    return (
      <div>
        <div className="tab-header">
          <div><span className="tab-title">{device.name}</span></div>
        </div>
        <DeviceEditWizardContainer
          deviceType={type}
          values={device}
          extraParams={extraParams}
          onFinish={this.onFinish.bind(this)}
        />
      </div>

    )
  }
}
