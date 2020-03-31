import React, { Component } from 'react'
import {TextField, FlatButton, SelectField, MenuItem} from 'material-ui'
import ActionSearch from 'material-ui/svg-icons/action/search'
import moment from 'moment'
import {assign} from 'lodash'

import InfiniteTable from 'components/common/InfiniteTable'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import MonitorTabs from './MonitorTabs'
import StatusImg from './StatusImg'
import MonitorSocket from 'util/socket/MonitorSocket'

import { parseSearchQuery, dateFormat } from 'shared/Global'

export default class EventLogTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.columns = [{
      'displayName': 'Time',
      'columnName': 'LogTime',
      'cssClassName': 'nowrap width-140'
    }, {
      'displayName': 'LogName',
      'columnName': 'LogName',
      'cssClassName': 'width-100'
    }, {
      'displayName': 'EventID',
      'columnName': 'EventID',
      'cssClassName': 'width-80'
    }, {
      'displayName': 'User',
      'columnName': 'User',
      'cssClassName': 'width-160'
    }, {
      'displayName': 'Data',
      'columnName': 'Data'
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
      monitors: 'eventlog',
      deviceId: this.props.device.id,
      data: {
        name: this.props.selectedLogName
      }
    })
  }
  onMonitorMessage (msg) {
    console.log(msg)
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      this.props.updateMonitorRealTime(msg.data)
    }
  }
  onChangeQuery (e) {
    this.props.updateMonitorQuery(e.target.value)
  }
  onKeyupQuery (e) {
    if (e.keyCode === 13) {
      this.onClickSearch()
    }
  }
  onClickSearch () {
    const query = `deviceid=${this.props.device.id} and monitortype=log and eventType=AGENT and _all=${this.props.monitorQuery}`
    const queryChips = parseSearchQuery(query)
    this.props.history.push('/search')
    this.props.updateSearchParams(assign({}, this.props.params, {
      query,
      severity: 'HIGH,MEDIUM',
      collections: 'event',
      workflow: '',
      tag: '',
      dateFrom: moment().startOf('year').format(dateFormat),
      dateTo: moment().endOf('year').format(dateFormat)
    }), this.props.history)

    this.props.replaceSearchWfs([])
    this.props.updateQueryChips(queryChips)
  }
  onChangeLogName (e, index, value) {
    this.props.selectLogName(value)

    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'eventlog',
      deviceId: this.props.device.id,
      data: {
        name: value
      }
    })
  }
  renderOptions () {
    const {selectedLogName, monitorLogNames} = this.props
    return (
      <div className="text-center">
        <div className="pull-left text-left">
          <SelectField
            floatingLabelText="Log"
            onChange={this.onChangeLogName.bind(this)}
            value={selectedLogName}>
            {monitorLogNames.map((c, i) =>
              <MenuItem key={i} primaryText={c} value={c}/>
            )}
          </SelectField>
        </div>
        <div className="inline-block">
          <TextField name="query" value={this.props.monitorQuery} onChange={this.onChangeQuery.bind(this)} onKeyUp={this.onKeyupQuery.bind(this)}/>
          <FlatButton icon={<ActionSearch />} onTouchTap={this.onClickSearch.bind(this)}/>
        </div>
      </div>
    )
  }
  renderBody2 () {
    return (
      <InfiniteTable
        cells={this.columns}
        ref="table"
        rowMetadata={{'key': 'id'}}
        rowHeight={400}
        selectable
        url="/event/search/findAgentEvents"
        params={{
          deviceid: this.props.device.id,
          eventType: 'AGENT',
          monitortype: 'log',
          sort: 'timestamp,desc'
        }}
      />
    )
  }
  renderBody () {
    return (
      <InfiniteTable
        cells={this.columns}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        data={this.props.eventLogs}
        useExternal={false}
      />
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title="Event Log" titleOptions={<StatusImg {...this.props}/>}>
          {this.renderOptions()}
        </TabPageHeader>
        <TabPageBody tabs={MonitorTabs(device.id, device.templateName)} history={this.props.history} location={this.props.location} transparent>
          {this.renderBody()}
        </TabPageBody>
      </TabPage>
    )
  }
}
