import React, { Component } from 'react'
import { assign, concat, findIndex } from 'lodash'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'

import CheckIcon from 'material-ui/svg-icons/toggle/check-box'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import HelpIcon from 'material-ui/svg-icons/action/help'
import CommentIcon from 'material-ui/svg-icons/action/description'
import DateRangeIcon from 'material-ui/svg-icons/action/date-range'

import MonitorWizardContainer from 'containers/shared/wizard/MonitorWizardContainer'
import InfiniteTable from 'components/common/InfiniteTable'

import { showAlert } from 'components/common/Alert'

import MonitorPicker from './MonitorPicker'
import MonitorHistoryModal from './MonitorHistoryModal'
import IncidentSocket from 'util/socket/IncidentSocket'
import MonitorSocket from 'util/socket/MonitorSocket'

export default class MonitorTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editMonitor: null,

      monitorConfig: null
    }
    this.columns = [{
      'displayName': 'Monitor Name',
      'columnName': 'name',
      'cssClassName': 'width-140'
    }, {
      'displayName': 'Type',
      'columnName': 'monitortype',
      'cssClassName': 'width-100'
    }, {
      'displayName': 'Result',
      'columnName': 'checkResult.resultdata',
      'cssClassName': 'text-ellipsis',
      'customComponent': (p) => {
        if (p.data && p.data.length > 200) return <span>{p.data.substring(0, 200)}...</span>
        return <span>{p.data}</span>
      }
    }, {
      'displayName': 'Status',
      'columnName': 'status',
      'cssClassName': 'width-60 text-center',
      'customComponent': (props) => {
        return this.healthFormatter(props.data)
      }
    }, {
      'displayName': 'Last Seen',
      'columnName': 'lastrun',
      'cssClassName': 'width-160',
      'customComponent': (props) => {
        if (!props.data) return <span />
        return <span>{moment(props.data).fromNow()}</span>
      }
    }, {
      'displayName': 'Last Failed',
      'columnName': 'lastfalure',
      'cssClassName': 'width-140',
      'customComponent': (props) => {
        if (!props.data) return <span />
        return <span>{moment(props.data).fromNow()}</span>
      }
    }, {
      'displayName': 'Last Success',
      'columnName': 'lastsuccess',
      'cssClassName': 'width-160',
      'customComponent': (props) => {
        if (!props.data) return <span />
        return <span>{moment(props.data).fromNow()}</span>
      }
    }, {
      'displayName': 'Actions',
      'columnName': 'action',
      'cssClassName': 'width-100',
      'customComponent': (props) => {
        const row = props.rowData

        const res = row.checkResult ? JSON.stringify(row.checkResult) : ''
        return (
          <div>
            <CommentIcon color="#545454" data-tip={res.length > 200 ? `${res.substring(0, 200)}...` : res}/>
            <DateRangeIcon color="#545454" data-tip="History" onClick={this.onClickCal.bind(this, props.rowData)}/>
          </div>
        )
      }
    }]
  }

  componentDidMount () {
    this.props.fetchMonitorTemplates()

    this.incidentSocket = new IncidentSocket({
      listeners: {
        'updatedDevice': this.onDeviceUpdated.bind(this)
      }
    })
    this.incidentSocket.connect(this.onSocketOpen.bind(this))

    this.monitorSocket = new MonitorSocket({
      listener: this.onMonitorMessage.bind(this)
    })
    this.monitorSocket.connect(this.onSocketOpen.bind(this))
  }

  componentWillUnmount () {
    this.incidentSocket.close()
    this.monitorSocket.close()
  }

  onSocketOpen () {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'basic',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.props.updateMonitorRealTime(msg.data)
    }
  }
  onDeviceUpdated (msg) {
    const {device} = this.props
    if (device.id !== msg.id) return
    this.props.reloadDevice(msg)
  }

  healthFormatter (val) {
    let cls = <HelpIcon color="#FDB422"/>
    if (val === 'UP') {
      cls = <CheckIcon color="green"/>
    } else if (val === 'DOWN') {
      cls = <CloseIcon color="red"/>
    }
    return (
      <div className="text-center">
        {cls}
      </div>
    )
  }

  onRowDblClick () {
    this.onClickEditMonitor()
  }

  onClickCal (row) {
    this.props.showMonitorHistoryModal(true, row)
  }

  onClickAddMonitor () {
    this.showMonitorAdd()
    console.log(this.props.device)
  }

  showMonitorAdd () {
    this.setState({ editMonitor: null }, () => {
      this.props.openDeviceMonitorPicker()
    })
  }

  addMonitor (monitorConfig) {
    this.props.openDeviceMonitorWizard(null, monitorConfig)
    return true
  }

  onFinishMonitorWizard (res, params) {
    let editMonitor = this.state.editMonitor
    let device = assign({}, this.props.device)
    let monitor = assign({}, editMonitor, params)

    if (editMonitor) {
      // Edit
      const index = findIndex(device.monitors, {uid: editMonitor.uid})
      if (index >= 0) device.monitors[index] = monitor
    } else {
      // Add

      const {monitorConfig} = this.state
      assign(monitor, {
        monitortype: monitorConfig.monitortype
      })

      device.monitors = concat(device.monitors || [], monitor)
    }

    this.props.updateMapDevice(device)
    this.props.closeDeviceMonitorWizard()
  }

  onStep0 () {
    this.onClickAddMonitor()
  }

  onClickEditMonitor () {
    const {monitorTemplates} = this.props
    let selected = this.getTable().getSelected()

    if (!selected) return showAlert('Please select monitor.')

    let monitorConfig = monitorTemplates.filter(p => p.monitortype === selected.monitortype)
    monitorConfig = monitorConfig.length ? monitorConfig[0] : null
    this.setState({
      editMonitor: selected
    }, () => {
      this.props.openDeviceMonitorWizard(selected, monitorConfig)
    })
  }

  onClickDeleteMonitor () {
    let data = this.getTable().getSelected()
    if (!data) return showAlert('Please choose monitor.')

    let device = assign({}, this.props.device)
    const index = findIndex(device.monitors, {uid: data.uid})
    if (index >= 0) device.monitors.splice(index, 1)

    this.props.updateMapDevice(device)
  }

  getTable () {
    return this.refs.table
  }

  renderMonitorPicker () {
    if (!this.props.monitorPickerVisible) return null

    return (
      <MonitorPicker
        {...this.props}
        onClickItem={monitorConfig => {
          this.setState({monitorConfig}, () => {
            this.addMonitor(monitorConfig)
          })
          return true
        }}
      />
    )
  }

  renderMonitorWizard () {
    if (!this.props.monitorWizardVisible) return null

    const {monitorConfig} = this.state
    const type = 'monitor-custom'
    return (
      <MonitorWizardContainer
        deviceType={type}
        title={`Add ${monitorConfig ? monitorConfig.name : ''} Monitor To ${this.props.device.name}`}
        onClose={() => {
          this.props.closeDeviceMonitorWizard()
        }}
        onStep0={this.onStep0.bind(this)}
        extraParams={{}}
        configParams={{}}
        onFinish={this.onFinishMonitorWizard.bind(this)}
      />
    )
  }

  renderHistoryModal () {
    if (!this.props.monitorHistoryModalOpen) return null
    return (
      <MonitorHistoryModal device={this.props.selectedMonitor} onClose={() => this.props.showMonitorHistoryModal(false)}/>
    )
  }

  render () {
    return (
      <div className="flex-1 flex-vertical">
        <InfiniteTable
          cells={this.columns}
          ref="table"
          rowMetadata={{'key': 'uid'}}
          selectable
          onRowDblClick={this.onRowDblClick.bind(this)}

          useExternal={false}
          data={this.props.device.monitors}
        />

        {this.renderMonitorPicker()}

        {this.renderMonitorWizard()}
        {this.renderHistoryModal()}
        <ReactTooltip/>
      </div>
    )
  }
}
