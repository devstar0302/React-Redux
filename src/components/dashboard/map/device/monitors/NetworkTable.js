import React from 'react'
import InfiniteTable from 'components/common/InfiniteTable'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import MonitorTabs from './MonitorTabs'
import MonitorSocket from 'util/socket/MonitorSocket'

import StatusImg from './StatusImg'

export default class NetworkTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.columns = [{
      'displayName': 'Name',
      'columnName': 'Name'
    }, {
      'displayName': 'Address',
      'columnName': 'Address'
    }, {
      'displayName': 'MAC Address',
      'columnName': 'MAC'
    }, {
      'displayName': 'Speed',
      'columnName': 'Speed'
    }, {
      'displayName': 'Description',
      'columnName': 'Description'
    }, {
      'displayName': 'Enabled',
      'columnName': 'Enabled',
      'customComponent': p => {
        return <span>{p.data ? 'YES' : 'NO'}</span>
      }
    }]
  }
  componentWillMount () {
    this.props.clearMonitors()
  }
  componentDidMount () {
    this.monitorSocket = new MonitorSocket({
      listener: this.onMonitorMessage.bind(this)
    })
    this.monitorSocket.connect(this.onSocketOpen.bind(this))
  }

  componentWillUnmount () {
    this.monitorSocket.close()
  }

  onSocketOpen () {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'network',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.props.updateMonitorRealTime(msg.data)
    }
  }

  renderOptions () {
    return (
      <div className="text-center">
        <div className="inline-block"/>
      </div>
    )
  }
  renderBody () {
    return (
      <InfiniteTable
        cells={this.columns}
        ref="table"
        rowMetadata={{'key': 'Name'}}
        selectable
        rowHeight={40}

        useExternal={false}
        data={this.props.monitorNetworks}
      />
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title={device.name} titleOptions={<StatusImg {...this.props}/>}>
          {this.renderOptions()}
        </TabPageHeader>
        <TabPageBody tabs={MonitorTabs(device.id, device.templateName)} history={this.props.history} location={this.props.location} transparent>
          {this.renderBody()}
        </TabPageBody>
      </TabPage>
    )
  }
}
