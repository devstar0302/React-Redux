import React from 'react'
import {RaisedButton} from 'material-ui'
import InfiniteTable from 'components/common/InfiniteTable'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import MonitorTabs from './MonitorTabs'
import MonitorSocket from 'util/socket/MonitorSocket'
import StatusImg from './StatusImg'

import LocalUserModal from './LocalUserModal'
import {showConfirm} from 'components/common/Alert'

export default class UserTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
    this.columns = [{
      'displayName': 'Name',
      'columnName': 'Name',
      'cssClassName': 'width-200'
    }, {
      'displayName': 'Domain',
      'columnName': 'Domain'
    }, {
      'displayName': 'Status',
      'columnName': 'Disabled',
      'customComponent': p => {
        return <span>{p.data ? 'Disabled' : 'Enabled'}</span>
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
      monitors: 'user',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.props.updateMonitorRealTime(msg.data)
    }
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
  onClickCreate () {
    this.props.showLocalUserModal(true)
  }
  onSaveUser (values) {
    this.sendCommandMessage('CreateUserCommand', values)
  }
  onClickDelete () {
    const sel = this.refs.table.getSelected()
    if (!sel) return
    showConfirm('Click OK to delete user.', btn => {
      if (btn !== 'ok') return
      this.sendCommandMessage('DeleteUserCommand', {
        username: sel.Name
      })
    })
  }
  onClickEnable () {
    const sel = this.refs.table.getSelected()
    if (!sel) return
    this.sendCommandMessage('EnableUserCommand', {
      username: sel.Name
    })
  }
  onClickDisable () {
    const sel = this.refs.table.getSelected()
    if (!sel) return
    this.sendCommandMessage('DisableUserCommand', {
      username: sel.Name
    })
  }

  renderOptions () {
    return (
      <div className="text-center">
        <div className="pull-right">
          <RaisedButton label="Create" onTouchTap={this.onClickCreate.bind(this)}/>&nbsp;
          <RaisedButton label="Enable" onTouchTap={this.onClickEnable.bind(this)}/>&nbsp;
          <RaisedButton label="Disable" onTouchTap={this.onClickDisable.bind(this)}/>&nbsp;
          <RaisedButton label="Delete" onTouchTap={this.onClickDelete.bind(this)}/>&nbsp;
        </div>
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
        data={this.props.monitorUsers}
      />
    )
  }
  renderLocalUserModal () {
    if (!this.props.localUserModalOpen) return
    return (
      <LocalUserModal {...this.props} onSave={this.onSaveUser.bind(this)}/>
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
          {this.renderLocalUserModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
