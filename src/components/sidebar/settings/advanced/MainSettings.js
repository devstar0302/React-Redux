import React, { Component } from 'react'
import {assign} from 'lodash'
import {Checkbox, RaisedButton, SelectField, MenuItem} from 'material-ui'

import ImportSyncDataModal from './ImportSyncDataModal'
import SimulationModal from './SimulationModal'

const rowStyle = {
  float: 'left',
  width: '100%',
  height: 30
}

const logLevels = [{
  label: 'INFO', value: 'INFO'
}, {
  label: 'DEBUG', value: 'DEBUG'
}, {
  label: 'ERROR', value: 'ERROR'
}]
export default class MainSettings extends Component {
  getOption (key) {
    const list = (this.props.envVars || []).filter(u => u.envvars && u.envvars.key === key)
    if (list.length) return list[0]
    return null
  }

  getOptionValue (key, value = 'value1') {
    const option = this.getOption(key)
    if (!option) return ''
    return option.envvars[value]
  }

  updateOption (name, value1, value2 = '') {
    if (!name) return false

    let option = this.getOption(name)
    if (!option) {
      option = {
        envvars: {
          'key': name,
          'value1': value1,
          'value2': value2
        }
      }

      this.props.addEnvVar(option)
    } else {
      assign(option.envvars, { value1, value2 })

      this.props.updateEnvVar(option)
    }
  }

  onClickSync () {
    this.props.syncData(false)
  }

  onClickSyncAll () {
    this.props.syncData(true)
  }

  onClickImportSync () {
    this.props.showImportSyncModal(true)
  }
  onCloseImportModal () {
    this.props.showImportSyncModal(false)
  }
  onClickSimulate () {
    this.props.showSimulationModal(true)
  }

  onChangeSendLogOption (e) {
    const {checked} = e.target
    this.updateOption('SEND_LOGS', `${checked}`)
  }

  onChangeSendLogLevel (e, index, value) {
    this.updateOption('SEND_LOGS_LEVEL', value)
  }

  renderImportModal () {
    if (!this.props.importSyncModalOpen) return null
    return (
      <ImportSyncDataModal
        onSubmit={this.props.importSyncData}
        onClose={this.onCloseImportModal.bind(this)}/>
    )
  }

  renderSimulationModal () {
    if (!this.props.simulationModalOpen) return null
    return (
      <SimulationModal {...this.props}/>
    )
  }

  render () {
    return (
      <div className="padding-md">
        <div style={rowStyle} className="margin-md-bottom bt-gray">
          <div>
            <Checkbox
              label="Send IMP Logs to IMAdmin"
              checked={this.getOptionValue('SEND_LOGS') === 'true'}
              onCheck={this.onChangeSendLogOption.bind(this)}/>
          </div>
        </div>
        <div>
          <SelectField
            floatingLabelText="Send IMP Logs Level"
            value={this.getOptionValue('SEND_LOGS_LEVEL')}
            onChange={this.onChangeSendLogLevel.bind(this)}>
            {logLevels.map(option => <MenuItem key={option.value} value={option.value} primaryText={option.label}/>)}
          </SelectField>
        </div>
        <div className="padding-md-top">
          <label className="margin-sm-right">Update The System</label>
          <RaisedButton label="Update" onTouchTap={this.onClickSync.bind(this)}/>

          <RaisedButton label="Sync All" onTouchTap={this.onClickSyncAll.bind(this)} className="margin-lg-left"/>
        </div>

        <div className="padding-md-top">
          <RaisedButton label="Import From File SyncData" onTouchTap={this.onClickImportSync.bind(this)}/>
        </div>

        <div className="padding-md-top">
          <RaisedButton label="Simulate" onTouchTap={this.onClickSimulate.bind(this)}/>
        </div>

        {this.renderImportModal()}
        {this.renderSimulationModal()}
      </div>
    )
  }
}
