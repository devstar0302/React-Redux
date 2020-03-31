import React from 'react'
import { Switch } from 'react-router'
import { Route } from 'react-router-dom'

import DeviceDashboard from 'containers/device/dashboard/DeviceDashboardContainer'
import DeviceMain from 'components/dashboard/map/device/main/Main'
import DeviceConnectedContainer from 'containers/device/connected/ConnectedContainer'
import DeviceInfoContainer from 'containers/device/info/InfoContainer'
import DeviceTopology from 'containers/device/topology/TopologyContainer'
import GroupDevicesContainer from 'containers/device/devices/DevicesContainer'
import DeviceMonitor from 'components/dashboard/map/device/monitors/MonitorRoutes'

export default class Device extends React.Component {
  // componentWillMount () {
  //   if (!this.props.children) {
  //     this.props.router.replace('/device/main/incidents')
  //   }
  // }

  render () {
    const {deviceId} = this.props.match.params
    if (!this.props.selectedDevice) {
      if (!this.props.devices.length) {
        console.log('fetch devices')
        this.props.fetchDevice(deviceId)
      } else {
        console.log('no fetching')
        let found = false
        for (let device of this.props.devices) {
          if (device.id === deviceId) {
            console.log('open device')
            this.props.openDevice(device)
            found = true
          }
        }
        if (!found)
          this.props.fetchDevice(deviceId)
      }

      return null
    }

    if (!this.props.selectedDevice) return null
    return (
      <Switch>
        <Route path="/device/:deviceId/dashboard" component={DeviceDashboard}/>
        <Route path="/device/:deviceId/main" component={DeviceMain}/>
        <Route path="/device/:deviceId/topology" component={DeviceTopology}/>
        <Route path="/device/:deviceId/monitor" component={DeviceMonitor}/>
        <Route path="/device/:deviceId/connected" component={DeviceConnectedContainer}/>
        <Route path="/device/:deviceId/info" component={DeviceInfoContainer}/>
        <Route path="/device/:deviceId/list" component={GroupDevicesContainer}/>
      </Switch>
    )
  }
}
