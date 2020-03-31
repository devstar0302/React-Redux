import React, { Component } from 'react'

import {RaisedButton, MenuItem, SelectField, IconButton, Chip} from 'material-ui'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import Share from 'material-ui/svg-icons/social/share'
import CopyIcon from 'material-ui/svg-icons/content/content-copy'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import DeviceTplModal from './DeviceTplModal'
import MonitorTplModal from './MonitorTplModal'
import ImageUploaderModal from './ImageUploaderModal'
import DeviceTplView from './DeviceTplView'
import WorkflowSelectModal from './WorkflowSelectModal'

import { showConfirm, showAlert } from 'components/common/Alert'
import { errorStyle, underlineFocusStyle, inputStyle, selectedItemStyle, chipStyles } from 'style/common/materialStyles'

import { extImageBaseUrl } from 'shared/Global'
import WfTabs from '../rule/WorkflowTabs'

export default class Templates extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 'Device'
    }
  }

  componentWillMount () {
    this.props.selectDeviceTemplate(null)
    this.props.fetchDeviceTemplates()
    this.props.fetchMonitorTemplates()
  }

  componentWillUpdate (props) {
    const {shareMonitorTplResult} = props
    if (shareMonitorTplResult && this.props.shareMonitorTplResult !== shareMonitorTplResult) {
      if (shareMonitorTplResult === 'OK') showAlert('Shared successfully!')
      else showAlert('Share failed!')
    }
  }

  onClickRow (selected) {
    this.props.selectDeviceTemplate(selected)
  }

  onDblClickRow (selected) {
  }

  renderDeviceTemplates () {
    const {selectedDeviceTpl} = this.props
    return (
      <div>
        <table className="table table-hover dataTable">
          <tbody>
          {
            this.props.deviceTemplates.map((item, index) =>
              <tr key={item.id}
                className={selectedDeviceTpl && item.id === selectedDeviceTpl.id ? 'selected' : ''}
                onClick={this.onClickRow.bind(this, item)}
                onDoubleClick={this.onDblClickRow.bind(this, item)}>
                <td className="nowrap">
                  <img src={`${extImageBaseUrl}${item.image}`} width="32" height="32" className="icon-black valign-middle" alt=""/>
                  &nbsp;
                  {item.name}
                </td>
                <td className="valign-middle">{item.devicetemplategroup}</td>
                <td>
                  <div style={chipStyles.wrapper}>
                    {item.monitors.map(m =>
                      <Chip
                        key={m.id}
                        style={chipStyles.chip}
                        labelStyle={chipStyles.label}
                      >
                        {m.name}
                      </Chip>
                    )}
                  </div>
                </td>
                <td className="text-right fa-lg">
                  {item.origin === 'SYSTEM' && <IconButton
                    style={{padding: 0, width: 24, height: 24}}
                    onTouchTap={this.onClickCloneDeviceTpl.bind(this, item)}>
                    <CopyIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>}
                  {item.origin !== 'SYSTEM' && <IconButton
                    style={{padding: 0, width: 24, height: 24}}
                    onTouchTap={this.onClickDeleteDeviceTpl.bind(this, item)}>
                    <DeleteIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>}
                </td>
              </tr>
            )
          }
          </tbody>
        </table>

        {this.renderDeviceTplModal()}
        {this.renderMonitorTplModal()}
      </div>
    )
  }

  renderMonitorTemplates () {
    return (
      <div>
        <table className="table table-hover dataTable">
          <tbody>
          {
            this.props.monitorTemplates.map((item, index) =>
              <tr key={item.id}
                className={index === this.state.selected ? 'selected' : ''}
                onClick={() => console.log(item)}>
                <td>
                  <img src={`${extImageBaseUrl}${item.image}`} width="32" height="32" className="icon-black valign-middle" alt=""/>
                  &nbsp;
                  {item.name}
                </td>
                <td>{item.description}</td>
                <td>{item.enabled ? 'Enabled' : 'Disabled'}</td>
                <td className="text-right fa-lg">
                  {item.origin !== 'SYSTEM' && <IconButton
                    style={{padding: 0, width: 24, height: 24}}
                    onTouchTap={this.onClickShareMonitorTpl.bind(this, item)}>
                    <Share color="#545454" hoverColor="#f44336"/>
                  </IconButton>}
                  {item.origin !== 'SYSTEM' && <IconButton
                    style={{padding: 0, width: 24, height: 24}}
                    onTouchTap={this.onClickEditMonitorTpl.bind(this, item)}>
                    <EditIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>}
                  {item.origin !== 'SYSTEM' && <IconButton
                    style={{padding: 0, width: 24, height: 24}}
                    onTouchTap={this.onClickDeleteMonitorTpl.bind(this, item)}>
                    <DeleteIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>}
                </td>
              </tr>
            )
          }
          </tbody>
        </table>

        {this.renderMonitorTplModal()}
      </div>
    )
  }

  renderDeviceTplModal () {
    if (!this.props.deviceTplModalVisible) return null
    return (
      <DeviceTplModal {...this.props} />
    )
  }

  renderMonitorTplModal () {
    if (!this.props.monitorTplModalVisible) return null
    return (
      <MonitorTplModal {...this.props} />
    )
  }

  renderTplImageModal () {
    if (!this.props.tplImageModalVisible) return null
    return (
      <ImageUploaderModal {...this.props} />
    )
  }

  onClickAddDeviceTpl () {
    this.props.openDeviceTplModal()
  }

  onClickEditDeviceTpl (item) {
    this.props.openDeviceTplModal(item)
  }

  onClickDeleteDeviceTpl (item) {
    showConfirm('Click OK to remove.', btn => {
      if (btn !== 'ok') return
      this.props.deleteDeviceTemplate(item)
    })
  }

  onClickCloneDeviceTpl (item) {
    showConfirm('Click OK to clone.', btn => {
      if (btn !== 'ok') return
      this.props.cloneDeviceTemplate(item)
    })
  }

  onClickAddMonitorTpl () {
    this.props.openMonitorTplModal()
  }

  onClickEditMonitorTpl (item) {
    this.props.openMonitorTplModal(item)
  }

  onClickDeleteMonitorTpl (item) {
    showConfirm('Click OK to remove.', btn => {
      if (btn !== 'ok') return
      this.props.deleteMonitorTemplate(item)
    })
  }

  onClickShareMonitorTpl (item) {
    this.props.shareMonitorTemplate(item)
  }

  onChangeType (e, index, value) {
    this.setState({ type: value })
    this.props.selectDeviceTemplate(null)
  }

  onClickAdd () {
    if (this.state.type === 'Device') this.onClickAddDeviceTpl()
    else this.onClickAddMonitorTpl()
  }

  onClickEdit () {
    const { selectedDeviceTpl, type } = this.state
    if (!selectedDeviceTpl) return window.alert('Please select item.')
    if (type === 'Device') {
      this.onClickEditDeviceTpl(selectedDeviceTpl)
    } else {
      // this.onClickEditMonitorTpl(this.props.monitorTemplates[selected])
    }
  }

  renderDeviceTplView () {
    const {selectedDeviceTpl, selectedDeviceMonitors} = this.props
    if (!selectedDeviceTpl) return
    return (
      <DeviceTplView
        {...this.props}
        enableReinitialize
        deviceTpl={selectedDeviceTpl}
        monitors={selectedDeviceMonitors}
      />
    )
  }

  renderWorkflowSelectModal () {
    if (!this.props.wfSelectModalOpen) return null
    return (
      <WorkflowSelectModal {...this.props}/>
    )
  }

  render () {
    const {type} = this.state
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div className="pull-left text-left">
              <SelectField
                errorStyle={errorStyle}
                underlineStyle={underlineFocusStyle}
                selectedMenuItemStyle={selectedItemStyle}
                menuItemStyle={inputStyle}
                labelStyle={inputStyle}
                onChange={this.onChangeType.bind(this)}
                value={type}>
                <MenuItem value="Device" primaryText="Device"/>
                <MenuItem value="Monitor" primaryText="Monitor"/>
              </SelectField>
            </div>

            <div style={{position: 'absolute', right: '25px'}}>
              <RaisedButton label="Add" onTouchTap={this.onClickAdd.bind(this)}/>&nbsp;
              <WfTabs history={this.props.history}/>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={5} history={this.props.history} location={this.props.location}>
          <div style={{position: 'absolute', width: '100%', height: '100%'}}>
            <div className="flex-horizontal" style={{height: '100%'}}>
              <div className="flex-1 padding-md-right" style={{overflow: 'auto'}}>
                {type === 'Device' ? this.renderDeviceTemplates() : this.renderMonitorTemplates()}
              </div>
              <div className="flex-1 padding-md" style={{overflow: 'auto'}}>
                {this.renderDeviceTplView()}
              </div>
            </div>
          </div>
          {this.renderTplImageModal()}
          {this.renderWorkflowSelectModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
