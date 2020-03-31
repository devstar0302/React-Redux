import React, { Component } from 'react'
import moment from 'moment'
import {MenuItem, SelectField, RaisedButton, CircularProgress} from 'material-ui'

import InfiniteTable from 'components/common/InfiniteTable'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import CollectorTabs from '../collector/CollectorTabs'
import AgentModal from './AgentModal'

import { errorStyle, inputStyle, selectedItemStyle } from 'style/common/materialStyles'
import {showAlert, showConfirm} from 'components/common/Alert'

import {isWindowsDevice} from 'shared/Global'

export default class Agents extends Component {
  constructor (props) {
    super(props)
    this.state = {
      install: 'all'
    }
    const me = this
    this.cells = [{
      'displayName': 'Device',
      'columnName': 'name'
    }, {
      'displayName': 'Version',
      'columnName': 'agent.version'
    }, {
      'displayName': 'Host',
      'columnName': 'agent.host'
    }, {
      'displayName': 'IP',
      'columnName': 'agent.ipaddress'
    }, {
      'displayName': 'Last Seen',
      'columnName': 'agent.lastSeen',
      'customComponent': p => {
        if (!p.data) {
          let installAgent = me.props.installAgents.filter(a => a.id === p.rowData.id)
          installAgent = installAgent.length ? installAgent[0] : null

          const installing = installAgent && installAgent.status === 'installing'
          return (
            <div>
              <RaisedButton
                label={installing ? 'Installing' : 'Install'}
                onTouchTap={this.onClickInstall.bind(this, p.rowData)}
                disabled={!!installAgent}
                className="valign-middle"
              />
              {installing ? <CircularProgress className="valign-middle margin-md-left" size={30}/> : null}
              {installAgent && installAgent.status === 'failed' ? 'Failed' : null}
            </div>
          )
        }
        return (
          <span>{moment(p.data).fromNow()}</span>
        )
      }
    }]
  }

  componentDidMount () {
    this.props.clearAgentInstall()
    this.props.fetchCollectors()

    this.timer = setInterval(() => {
      this.props.fetchAgents()
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  onChangeInstall (e, index, value) {
    this.setState({ install: value })
  }

  onRowDblClick () {
  }

  onClickAdd () {
    this.props.showAgentModal(true)
  }
  onClickEdit () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose agent.')
    this.props.showAgentModal(true, selected)
  }
  onClickRemove () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose agent.')
    showConfirm('Click OK to remove.', btn => {
      if (btn !== 'ok') return
      this.props.removeAgent(selected)
    })
  }
  onClickInstall (device) {
    if (isWindowsDevice(device)) {
      const exists = this.props.collectors.filter(p => p.ostype === 'WINDOWS').length > 0
      if (!exists) {
        return showAlert('Please install windows collector.')
      }
    }
    this.props.installAgent(device)
  }
  getTable () {
    return this.refs.table
  }

  renderSelect () {
    return (
      <SelectField
        errorStyle={errorStyle}
        selectedMenuItemStyle={selectedItemStyle}
        menuItemStyle={inputStyle}
        labelStyle={inputStyle}
        onChange={this.onChangeInstall.bind(this)}
        value={this.state.install}>
        <MenuItem value="all" primaryText="All"/>
        <MenuItem value="installed" primaryText="Installed"/>
        <MenuItem value="notinstalled" primaryText="Not Installed"/>
      </SelectField>
    )
  }

  renderAgentModal () {
    if (!this.props.agentModalOpen) return null
    return (
      <AgentModal {...this.props}/>
    )
  }

  renderContent () {
    let {agents} = this.props

    const {install} = this.state
    if (install === 'installed') agents = agents.filter(p => !!p.agent)
    else if (install === 'notinstalled') agents = agents.filter(p => !p.agent)

    return (
      <InfiniteTable
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onRowDblClick.bind(this)}
        useExternal={false}
        data={agents}
      />
    )
  }

  render () {
    return (
      <TabPage>
        <TabPageHeader title="Agents">
          <div className="text-center margin-md-top">
            <div className="pull-left form-inline text-left">
              {this.renderSelect()}
            </div>

            <div style={{position: 'absolute', right: '25px'}}>
              <CollectorTabs history={this.props.history}/>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={1} history={this.props.history} location={this.props.location} transparent>
          {this.renderContent()}
          {this.renderAgentModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
