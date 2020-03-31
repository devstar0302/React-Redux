import React, { Component } from 'react'
import { assign } from 'lodash'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import {IconButton, RadioButtonGroup, RadioButton} from 'material-ui'
import {Field} from 'redux-form'

import { CardPanel, FormSelect, FormInput } from 'components/modal/parts'
import AppletCard from 'components/common/AppletCard'

import MonitorWizardContainer from 'containers/shared/wizard/MonitorWizardContainer'
import MonitorPickModal from './MonitorPickModal'

import { extImageBaseUrl, appletColors as colors } from 'shared/Global'
import DeviceTplPicker from "./DeviceTplPicker";

export default class MonitorTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: -1,

      monitorConfig: null,
      monitorWizardVisible: false,
      editMonitor: false,

      monitorPickerVisible: false,
      deviceTplPickerVisible: false
    }
  }

  renderTools () {
    return (
      <div>
        <IconButton onTouchTap={this.onClickAdd.bind(this)}>
          <AddCircleIcon size={32}/>
        </IconButton>
      </div>
    )
  }

  renderMonitorWizard () {
    if (!this.state.monitorWizardVisible) return

    const {monitorConfig} = this.state
    const type = 'monitor-custom'

    return (
      <MonitorWizardContainer
        deviceType={type}
        title={monitorConfig ? monitorConfig.name : ''}
        onClose={() => { this.setState({ monitorWizardVisible: false }) }}
        extraParams={{ monitortype: monitorConfig.monitortype }}
        configParams={{}}
        onFinish={this.onFinishMonitorWizard.bind(this)}
      />
    )
  }

  onClickItem (item) {
    this.setState({ editMonitor: null, monitorPickerVisible: false })
    this.addMonitor(assign({}, item, {enable: true}))
  }

  onClickAdd (e) {
    this.setState({ monitorPickerVisible: true })
  }

  onClickAddDevice () {
    this.setState({deviceTplPickerVisible: true})
  }

  onClickEditMonitor (monitor) {
    this.setState({ monitorWizardVisible: true, editMonitor: monitor, monitorConfig: monitor })
    this.props.openDeviceMonitorWizard(monitor)
  }

  onClickRemoveMonitor (monitor, e) {
    const {monitors, onChanged} = this.props
    const index = monitors.indexOf(monitor)
    if (index < 0) return
    monitors.splice(index, 1)
    onChanged && onChanged(monitors)
    e.stopPropagation && e.stopPropagation()
    e.preventDefault()
    return false
  }

  addMonitor (monitorConfig) {
    this.props.openDeviceMonitorWizard(monitorConfig)
    this.setState({ monitorWizardVisible: true, monitorConfig })
  }

  onFinishMonitorWizard (res, params) {
    let { monitors, onChanged } = this.props

    const {editMonitor} = this.state
    if (editMonitor) {
      const index = monitors.indexOf(editMonitor)
      if (index < 0) return
      monitors[index] = assign({}, editMonitor, params)
    } else {
      monitors = [ ...monitors, params ]
    }
    onChanged && onChanged(monitors)
  }

  onRowDblClick () {
    this.onClickEdit()
  }

  renderMonitorPicker () {
    if (!this.state.monitorPickerVisible) return null
    return (
      <MonitorPickModal
        {...this.props}
        onClick={this.onClickItem.bind(this)}
        onHide={() => this.setState({monitorPickerVisible: false})}
      />
    )
  }

  renderDeviceTplPicker () {
    if (!this.state.deviceTplPickerVisible) return null
    return (
      <DeviceTplPicker
        {...this.props}
        onHide={() => this.setState({deviceTplPickerVisible: false})}
      />
    )
  }

  render () {
    const {monitorGroups, onChangeMonitorGroupType} = this.props
    return (
      <div style={{marginTop: -22}}>
        <CardPanel title="Devices">
          <Field
            name="monitorDevice" label="Device" component={FormSelect} options={[]} className="valign-top"/>
          <IconButton onTouchTap={this.onClickAddDevice.bind(this)} className="valign-top">
            <AddCircleIcon size={32}/>
          </IconButton>
        </CardPanel>

        <CardPanel title="Monitor Group">
          <div className="flex-horizontal">
            <div style={{paddingTop: 12}}>
              <RadioButtonGroup
                name="monitorGroupType" defaultSelected="new" onChange={(e, value) => onChangeMonitorGroupType(value)}
                style={{marginTop: 10}}>
                <RadioButton value="new" label="New" className="pull-left"/>
                <RadioButton value="existing" label="Existing" className="pull-left" style={{width: 120, marginTop: 14}}/>
              </RadioButtonGroup>
            </div>
            <div className="flex-1" style={{paddingLeft: 12}}>
              <div>
                <Field name="monitorGroupName" component={FormInput} className="valign-top mr-dialog" floatingLabel="Name" style={{marginTop: -20}}/>
              </div>
              <div style={{marginTop: -4}}>
                <Field
                  name="monitorGroup" label="Monitor Group" component={FormSelect}
                  options={monitorGroups.map(p => ({label: p.name, value: p.id}))}/>
              </div>
            </div>
          </div>


        </CardPanel>
        <CardPanel title="Monitors" tools={this.renderTools()}>
          <div style={{height: 326, overflow: 'auto', padding: '3px'}}>
            <ul className="web-applet-cards">
              {
                this.props.monitors.map((item, index) =>
                  <AppletCard
                    key={index}
                    className="small"
                    color={colors[index % colors.length]}
                    name={item.name}
                    desc={item.monitortype}
                    img={`${extImageBaseUrl}${item.image}`}
                    onClick={this.onClickEditMonitor.bind(this, item)}
                    onClickDelete={this.onClickRemoveMonitor.bind(this, item)}
                  />
                )
              }
            </ul>


            <table className="table dataTable hover hidden">
              <thead>
              <tr>
                <th width="5%">Type</th>
                <th width="5%">Name</th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.monitors.map((item, index) =>
                  <tr key={index}
                    className={index === this.state.selected ? 'selected' : ''}
                    onClick={() => this.setState({selected: index})}
                    onDoubleClick={this.onRowDblClick.bind(this)}>
                    <td>{item.monitortype}</td>
                    <td>{item.name}</td>
                  </tr>
                )
              }
              </tbody>
            </table>

            {this.renderMonitorWizard()}
            {this.renderMonitorPicker()}
            {this.renderDeviceTplPicker()}
          </div>
        </CardPanel>
      </div>
    )
  }
}

MonitorTable.defaultProps = {
  config: {},
  values: {},
  monitors: [],
  templates: [],
  onChanged: null
}
