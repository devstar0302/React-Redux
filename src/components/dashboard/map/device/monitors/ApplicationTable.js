import React, { Component } from 'react'
import {TextField, FlatButton, RaisedButton, MenuItem} from 'material-ui'
import IconMenu from 'material-ui/IconMenu'
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

export default class ApplicationTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.columns = [{
      'displayName': 'Name',
      'columnName': 'Name',
      'cssClassName': 'nowrap'
    }, {
      'displayName': 'InstallDate',
      'columnName': 'InstallDate',
      'cssClassName': 'width-140',
      'customComponent': (props) => {
        let val = props.data
        if (!val) return <span />
        val = `${val.substring(0, 4)}-${
                    val.substring(4, 6)}-${
                    val.substring(6)}`

        return <span>{val}</span>
      }
    }, {
      'displayName': 'Version',
      'columnName': 'Version',
      'cssClassName': 'width-120'
    }, {
      'displayName': 'Publisher',
      'columnName': 'Publisher',
      'cssClassName': 'width-200'
    }, {
      'displayName': 'Size',
      'columnName': 'Size',
      'cssClassName': 'width-120'
    }]
    this.hotfixColumns = [{
      'displayName': 'Source',
      'columnName': 'Source',
      'cssClassName': 'width-180'
    }, {
      'displayName': 'HotFixID',
      'columnName': 'HotFixID',
      'cssClassName': 'width-160'
    }, {
      'displayName': 'Description',
      'columnName': 'Description',
      'cssClassName': 'width-200'
    }, {
      'displayName': 'InstalledBy',
      'columnName': 'InstalledBy',
      'cssClassName': 'width-200'
    }, {
      'displayName': 'InstalledOn',
      'columnName': 'InstalledOn',
      'cssClassName': 'width-180'
    }]
  }
  componentWillMount () {
    this.props.clearMonitors()
    this.props.updateMonitorQuery('')
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
    this.sendTabMessage(this.props.deviceAppTab)
  }
  sendTabMessage (tab) {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: tab,
      deviceId: this.props.device.id
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
    const query = `deviceid=${this.props.device.id} and monitortype=app and eventType=AGENT and _all=${this.props.monitorQuery}`
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
    this.props.updateSearchTags([])
    this.props.updateQueryChips(queryChips)
  }
  onClickGetHotfix () {
    this.props.updateDeviceAppTab('hotfix')
    this.props.clearMonitors()
    this.sendTabMessage('hotfix')
  }
  onClickGetApp () {
    this.props.updateDeviceAppTab('app')
    this.props.clearMonitors()
    this.sendTabMessage('app')
  }
  renderOptions () {
    const {monitorQuery} = this.props
    return (
      <div className="text-center">
        <div className="inline-block">
          <TextField name="query" value={monitorQuery} onChange={this.onChangeQuery.bind(this)} onKeyUp={this.onKeyupQuery.bind(this)}/>
          <FlatButton icon={<ActionSearch />} onTouchTap={this.onClickSearch.bind(this)}/>
        </div>
        <div className="pull-right">
          <IconMenu
            iconButtonElement={<RaisedButton label="More" primary/>}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem primaryText="Applications" onTouchTap={this.onClickGetApp.bind(this)}/>
            <MenuItem primaryText="Hotfix" onTouchTap={this.onClickGetHotfix.bind(this)}/>
          </IconMenu>
        </div>
      </div>
    )
  }
  renderBody () {
    return (
      <div style={{height: '100%'}}>
        {this.props.deviceAppTab === 'hotfix' &&
          <InfiniteTable
            cells={this.hotfixColumns}
            ref="table1"
            rowMetadata={{'key': 'HotFixID'}}
            selectable
            rowHeight={40}

            useExternal={false}
            data={this.props.monitorHotfixes}
          />
        }
        {this.props.deviceAppTab !== 'hotfix' &&
          <InfiniteTable
            cells={this.columns}
            ref="table2"
            rowMetadata={{'key': 'id'}}
            selectable
            data={this.props.apps}
            useExternal={false}
          />
        }
      </div>
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title="Applications" titleOptions={<StatusImg {...this.props}/>}>
          {this.renderOptions()}
        </TabPageHeader>
        <TabPageBody tabs={MonitorTabs(device.id, device.templateName)} history={this.props.history} location={this.props.location} transparent>
          {this.renderBody()}
        </TabPageBody>
      </TabPage>
    )
  }
}
