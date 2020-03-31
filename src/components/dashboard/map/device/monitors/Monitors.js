import React from 'react'
import {RaisedButton} from 'material-ui'

import MonitorTable from './MonitorTable'
import DiskTable from './DiskTable'
import CpuTable from './CpuTable'
import MemoryTable from './MemoryTable'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import MonitorTabs from './MonitorTabs'
import StatusImg from './StatusImg'

export default class Monitors extends React.Component {
  componentWillMount () {
    this.props.clearMonitors()
    this.props.fetchCollectors()
    this.props.fetchCredentials()
  }

  getMonitorTable () {
    return this.refs.monitor
  }

  onClickAddMonitor () {
    this.getMonitorTable().onClickAddMonitor()
  }

  onClickEditMonitor () {
    this.getMonitorTable().onClickEditMonitor()
  }

  onClickDeleteMonitor () {
    this.getMonitorTable().onClickDeleteMonitor()
  }
  renderOptions () {
    return (
      <div className="text-center">
        <div style={{position: 'absolute', right: '25px'}}>
          <RaisedButton label="Add" onTouchTap={this.onClickAddMonitor.bind(this)}/>&nbsp;
          <RaisedButton label="Edit" onTouchTap={this.onClickEditMonitor.bind(this)}/>&nbsp;
          <RaisedButton label="Delete" onTouchTap={this.onClickDeleteMonitor.bind(this)}/>&nbsp;
        </div>
        &nbsp;
      </div>
    )
  }
  renderOSInfo () {
    const {monitorOS, monitorCpu} = this.props
    const texts = []
    if (monitorOS) {
      texts.push(`${monitorOS.dataobj.Name || ''} ${monitorOS.dataobj.ServicePack || ''}`)
    }
    if (monitorCpu) {
      const cpus = monitorCpu.dataobj
      const list = cpus.length ? cpus : [cpus]
      list.forEach(c => {
        texts.push(`${c.Model}`)
      })
    }
    return (
      <div className="v-centered text-left" style={{fontSize: '11px', paddingLeft: '10px'}}>
        {texts.map((t, i) =>
          <div key={i}>{t}</div>
        )}
      </div>
    )
  }

  renderBody () {
    const {props} = this

    return (
      <div className="flex-vertical" style={{height: '100%'}}>
        <div className="padding-sm text-center" style={{position: 'relative'}}>
          {this.renderOSInfo()}
          <CpuTable {...this.props}/>
          <MemoryTable {...this.props}/>
          <DiskTable {...this.props}/>
        </div>
        <div className="flex-1 flex-vertical" style={{background: 'white'}}>
          <MonitorTable {...props} ref="monitor"/>
        </div>
      </div>
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title={device.name} titleOptions={<StatusImg {...this.props}/>}>
          {this.renderOptions()}
        </TabPageHeader>
        <TabPageBody tabs={MonitorTabs(device.id, device.templateName)} history={this.props.history} location={this.props.location}>
          {this.renderBody()}
        </TabPageBody>
      </TabPage>
    )
  }
}
