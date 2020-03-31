import React from 'react'
import InfiniteTable from 'components/common/InfiniteTable'
import {Toggle, RaisedButton} from 'material-ui'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import MonitorTabs from './MonitorTabs'
import MonitorSocket from 'util/socket/MonitorSocket'

import StatusImg from './StatusImg'
import FwRuleModal from './FwRuleModal'

import {showConfirm} from 'components/common/Alert'

export default class FirewallTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
    this.columns = [{
      'displayName': 'Name',
      'columnName': 'Name'
    }, {
      'displayName': 'Source',
      'columnName': 'LocalIP',
      'customComponent': p => {
        const data = p.rowData
        return <span>{data.Direction === 'In' ? data.RemoteIP : data.LocalIP}</span>
      }
    }, {
      'displayName': 'Destination',
      'columnName': 'RemoteIP',
      'customComponent': p => {
        const data = p.rowData
        return <span>{data.Direction === 'In' ? data.LocalIP : data.RemoteIP}</span>
      }
    }, {
      'displayName': 'Service',
      'columnName': 'RemotePort',
      'customComponent': p => {
        const data = p.rowData
        return <span>{data.Direction === 'In' ? data.LocalPort : data.RemotePort} / {data.Protocol}</span>
      }
    }, {
      'displayName': 'Action',
      'columnName': 'Action'
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
      monitors: 'firewall',
      deviceId: this.props.device.id
    })
  }
  sendCommandMessage (name, params) {
    this.monitorSocket.send({
      action: 'command',
      deviceId: this.props.device.id,
      data: {
        name,
        params
      }
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.props.updateMonitorRealTime(msg.data)
    }
  }

  onToggleStatus (e, checked) {
    this.sendCommandMessage('SetFirewallStatusCommand', {
      status: checked ? 'on' : 'off'
    })
  }
  onClickAdd () {
    this.props.showFwRuleModal(true)
  }
  onSaveRule (values) {
    console.log(values)
    this.sendCommandMessage('AddFirewallRuleCommand', values)
  }
  onClickDeleteAll () {
    showConfirm('Click OK to remove all rules.', btn => {
      if (btn !== 'ok') return
      this.sendCommandMessage('RemoveFirewallRuleCommand', {
        rule: 'all'
      })
    })
  }
  onClickDelete () {
    const sel = this.refs.table.getSelected()
    if (!sel) return
    showConfirm('Click OK to remove the rule.', btn => {
      if (btn !== 'ok') return
      this.sendCommandMessage('RemoveFirewallRuleCommand', {
        rule: sel.Name,
        action: sel.Action,
        protocol: sel.Protocol,
        localip: sel.LocalIP,
        remoteip: sel.RemoteIP,
        localport: sel.LocalPort,
        remoteport: sel.RemotePort
      })
    })
  }
  renderOptions () {
    return (
      <div>
        {this.props.monitorsUpdateTime > 0 && <Toggle toggled={this.props.monitorFwStatus} onToggle={this.onToggleStatus.bind(this)}/>}
        <div className="pull-right">
          <RaisedButton label="Add" onTouchTap={this.onClickAdd.bind(this)} className="valign-top"/>&nbsp;
          <RaisedButton label="Delete" onTouchTap={this.onClickDelete.bind(this)} className="valign-top"/>&nbsp;
          <RaisedButton label="Delete All" onTouchTap={this.onClickDeleteAll.bind(this)} className="valign-top"/>&nbsp;
        </div>
      </div>
    )
  }
  renderBody () {
    return (
      <InfiniteTable
        cells={this.columns}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        rowHeight={40}

        useExternal={false}
        data={this.props.monitorFwRules}
      />
    )
  }
  renderRuleModal () {
    if (!this.props.fwRuleModalOpen) return
    return (
      <FwRuleModal {...this.props} onSave={this.onSaveRule.bind(this)}/>
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title="Firewall" titleOptions={<StatusImg {...this.props}/>}>
          {this.renderOptions()}
        </TabPageHeader>
        <TabPageBody tabs={MonitorTabs(device.id, device.templateName)} history={this.props.history} location={this.props.location} transparent>
          {this.renderBody()}
          {this.renderRuleModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
