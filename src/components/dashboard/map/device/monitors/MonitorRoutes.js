import React from 'react'
import { Switch } from 'react-router'
import { Route } from 'react-router-dom'

import DeviceMonitorsContainer from 'containers/device/monitors/MonitorsContainer'
import DeviceEventLogs from 'containers/device/monitors/EventLogsContainer'
import DeviceApps from 'containers/device/monitors/AppsContainer'
import DeviceProcesses from 'containers/device/monitors/ProcessContainer'
import DeviceServices from 'containers/device/monitors/ServiceContainer'
import DeviceUsers from 'containers/device/monitors/UsersContainer'
import DeviceFirewall from 'containers/device/monitors/FirewallContainer'
import DeviceNetwork from 'containers/device/monitors/NetworkContainer'
import DeviceCommand from 'containers/device/monitors/CommandContainer'

export default class MonitorRoutes extends React.Component {
  render () {
    return (
      <Switch>
        <Route path="/device/:deviceId/monitor" exact component={DeviceMonitorsContainer}/>
        <Route path="/device/:deviceId/monitor/eventlog" component={DeviceEventLogs}/>
        <Route path="/device/:deviceId/monitor/app" component={DeviceApps}/>
        <Route path="/device/:deviceId/monitor/process" component={DeviceProcesses}/>
        <Route path="/device/:deviceId/monitor/service" component={DeviceServices}/>
        <Route path="/device/:deviceId/monitor/user" component={DeviceUsers}/>
        <Route path="/device/:deviceId/monitor/firewall" component={DeviceFirewall}/>
        <Route path="/device/:deviceId/monitor/network" component={DeviceNetwork}/>
        <Route path="/device/:deviceId/monitor/command" component={DeviceCommand}/>
      </Switch>
    )
  }
}
