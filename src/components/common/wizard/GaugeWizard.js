import React from 'react'
import { reduxForm } from 'redux-form'
import {assign, concat, findIndex} from 'lodash'
import moment from 'moment'
import axios from 'axios'

import MonitorSocket from 'util/socket/MonitorSocket'
import GaugeWizardView from './GaugeWizardView'
import { ROOT_URL } from 'actions/config'
import {showAlert} from 'components/common/Alert'

class GaugeWizard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedSeverity: ['HIGH', 'MEDIUM'],
      dateFrom: moment().startOf('year').valueOf(),
      dateTo: moment().endOf('year').valueOf(),

      services: [],
      selectedMonitors: [],
      serviceNames: [],

      selectedDevice: null,
      selectedMonitor: null,
      selectedRight: null,
      selectedServers: [],

      selectedWorkflow: null,
      selectedWorkflows: []
    }
  }

  componentWillMount () {
    this.props.fetchSysSearchOptions()
    this.props.fetchWorkflows()
    // this.props.fetchMonitorGroups()
  }

  componentDidMount () {
    const {templateName, device} = this.props
    if (device && (templateName === 'Service' || templateName === 'Services')) {
      this.monitorSocket = new MonitorSocket({
        listener: this.onMonitorMessage.bind(this)
      })
      this.monitorSocket.connect(this.onSocketOpen.bind(this))
    }
  }

  componentWillUnmount () {
    if (this.monitorSocket) this.monitorSocket.close()
  }

  onSocketOpen () {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'service',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.setState({
        services: msg.data.service
      })
      setTimeout(() => {
        this.monitorSocket.close()
        this.monitorSocket = null
      }, 1)
    }
  }

  onChangeSeverity (e, index, values) {
    this.setState({
      selectedSeverity: values
    })
  }
  onChangeMonitors (e, index, values) {
    this.setState({
      selectedMonitors: values
    })
  }
  toggleMonitorId (id) {
    let {selectedMonitors} = this.state
    if (selectedMonitors.includes(id)) {
      selectedMonitors = selectedMonitors.filter(p => p !== id)
    } else {
      selectedMonitors = [ ...selectedMonitors, id ]
    }
    this.setState({ selectedMonitors })
  }
  onChangeServiceNames (e, index, values) {
    this.setState({
      serviceNames: values
    })
  }
  onChangeDateRange ({startDate, endDate}) {
    this.setState({
      dateFrom: startDate.valueOf(),
      dateTo: endDate.valueOf()
    })
  }

  onSelectDevice (item) {
    this.setState({
      selectedDevice: item,
      selectedMonitor: null
    })
  }
  onSelectMonitor (item) {
    this.setState({
      selectedMonitor: item
    })
  }
  onSelectRight (item) {
    this.setState({
      selectedRight: item
    })
  }
  onClickAddServer (monitorOnly) {
    let {selectedDevice, selectedServers, selectedMonitor} = this.state
    if (!selectedDevice) return

    if (selectedMonitor) {
      const index = findIndex(selectedServers,  {type: 'monitor', monitorId: selectedMonitor.uid})
      const item = {
        type: 'monitor',
        monitorId: selectedMonitor.uid,
        id: selectedDevice.id,
        name: selectedMonitor.name
      }
      if (index < 0) selectedServers = [...selectedServers, item]
    } else if (!monitorOnly) {
      const index = findIndex(selectedServers, {type: 'device', id: selectedDevice.id})
      const item = {
        type: 'device',
        id: selectedDevice.id,
        name: selectedDevice.name
      }
      if (index < 0) selectedServers = [...selectedServers, item]
    }
    this.setState({
      selectedServers
    })
  }

  onClickRemoveServer () {
    const {selectedRight, selectedServers} = this.state
    if (!selectedRight) return
    this.setState({
      selectedServers: selectedServers.filter(p => selectedRight.type !== p.type ||
        (p.type === 'monitor' ? p.monitorId !== selectedRight.monitorId : p.id !== selectedRight.id))
    })
  }

  onClickAddMonitor () {
    const {selectedMonitor, selectedMonitors} = this.state
    if (!selectedMonitor) return
    if (selectedMonitors.includes(selectedMonitor.uid)) return
    this.setState({
      selectedMonitors: [...selectedMonitors, selectedMonitor.uid],
      selectedMonitor: null
    })
  }

  onClickRemoveMonitor () {
    const {selectedRight, selectedMonitors} = this.state
    if (!selectedRight) return
    this.setState({
      selectedMonitors: selectedMonitors.filter(p => p !== selectedRight.uid),
      selectedRight: null
    })
  }

  onClickAddWorkflow () {
    const {selectedWorkflow, selectedWorkflows} = this.state
    if (!selectedWorkflow) return
    if (selectedWorkflows.includes(selectedWorkflow.id)) return
    this.setState({
      selectedWorkflows: [...selectedWorkflows, selectedWorkflow.id],
      selectedWorkflow: null
    })
  }

  onClickRemoveWorkflow () {
    const {selectedRight, selectedWorkflows} = this.state
    if (!selectedRight) return
    this.setState({
      selectedWorkflows: selectedWorkflows.filter(p => p !== selectedRight.id),
      selectedRight: null
    })
  }

  onSelectWorkflow (item) {
    this.setState({
      selectedWorkflow: item
    })
  }

  getSearchOptions () {
    const {userInfo} = this.props
    if (!userInfo) return []
    const {searchOptions} = userInfo
    if (!searchOptions) return []
    try {
      return JSON.parse(searchOptions)
    } catch (e) {
      console.log(e)
    }
    return []
  }
  handleFormSubmit (formProps) {
    const { selectedSeverity, selectedMonitors, serviceNames, dateFrom, dateTo, selectedServers, selectedWorkflows } = this.state
    const { extraParams, onFinish } = this.props

    const props = assign({
        severities: selectedSeverity,
        monitorIds: selectedMonitors,
        serviceNames: serviceNames,
        dateFrom,
        dateTo,
        servers: selectedServers,
        workflowIds: selectedWorkflows
      },
      formProps,
      extraParams
    )
    console.log(props)
    this.closeModal(true)

    if (props.resource === 'logicalgroup') {
      axios.post(`${ROOT_URL}/monitorgroup`, {
        monitorids: props.monitorIds
      }).then(res => {
        props.monitorIds = []
        props.monitorGroupId = res.data.id
        onFinish && onFinish(null, props)
      }).catch(() => {
        showAlert('Add logical group failed.')
      })
    } else {
      onFinish && onFinish(null, props)
    }
  }

  closeModal (data) {
    this.props.onClose && this.props.onClose(this, data)
  }
  render () {
    const {selectedDevice, selectedServers, selectedRight, selectedMonitor, selectedWorkflow, selectedWorkflows} = this.state
    const { handleSubmit, sysSearchOptions, monitors, title, formValues, workflows, templateName, devices, device, monitorGroups } = this.props

    const searchList = concat([], this.getSearchOptions().map(p => {
      return assign({}, p, {
        type: 'User'
      })
    }), sysSearchOptions.map(p => {
      return assign({}, p, {
        type: 'System'
      })
    })).map(p => ({
      label: p.name,
      value: p.id
    }))

    const durationVisible = templateName !== 'Up/Down'
    const splitVisible = templateName !== 'Table'

    const workflowOptions = workflows.map(p => ({label: p.name, value: p.id}))
    const serviceOptions = this.state.services.map(p => ({label: p.DisplayName || p.ServiceName, value: p.ServiceName}))
    const monitorGroupOptions = monitorGroups.map(p => ({label: p.name, value: p.id}))
    return (
      <GaugeWizardView
        title={title}
        templateName={templateName}
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        device={device}
        devices={devices}
        monitors={monitors}
        searchList={searchList}
        services={serviceOptions}
        workflows={workflows}
        workflowOptions={workflowOptions}

        formValues={formValues}
        durationVisible={durationVisible}
        splitVisible={splitVisible}

        selectedSeverity={this.state.selectedSeverity}
        onChangeSeverity={this.onChangeSeverity.bind(this)}

        selectedMonitors={this.state.selectedMonitors}
        onChangeMonitors={this.onChangeMonitors.bind(this)}
        toggleMonitorId={this.toggleMonitorId.bind(this)}

        serviceNames={this.state.serviceNames}
        onChangeServiceNames={this.onChangeServiceNames.bind(this)}

        dateFrom={this.state.dateFrom}
        dateTo={this.state.dateTo}
        onChangeDateRange={this.onChangeDateRange.bind(this)}

        monitorGroups={monitorGroupOptions}

        selectedDevice={selectedDevice}
        selectedMonitor={selectedMonitor}
        selectedRight={selectedRight}
        selectedServers={selectedServers}
        onSelectDevice={this.onSelectDevice.bind(this)}
        onSelectMonitor={this.onSelectMonitor.bind(this)}
        onSelectRight={this.onSelectRight.bind(this)}
        onClickAddServer={this.onClickAddServer.bind(this)}
        onClickRemoveServer={this.onClickRemoveServer.bind(this)}

        onClickAddMonitor={this.onClickAddMonitor.bind(this)}
        onClickRemoveMonitor={this.onClickRemoveMonitor.bind(this)}

        selectedWorkflow={selectedWorkflow}
        selectedWorkflows={selectedWorkflows}
        onSelectWorkflow={this.onSelectWorkflow.bind(this)}
        onClickAddWorkflow={this.onClickAddWorkflow.bind(this)}
        onClickRemoveWorkflow={this.onClickRemoveWorkflow.bind(this)}
      />
    )
  }
}
export default reduxForm({
  form: 'gaugeDeviceForm'
})(GaugeWizard)
