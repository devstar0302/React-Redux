import React from 'react'
import { ChromePicker } from 'react-color'
import {TextField, SelectField, MenuItem, RaisedButton} from 'material-ui'

export default class Websocket extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      lineColor: 'red'
    }
  }

  onClickAddIncident () {
    // const refs = this.refs
    //
    // $.get(`${ROOT_URL}${Api.test.addIncident}`, { // eslint-disable-line no-undef
    //   name: refs.incidentName.value,
    //   description: refs.incidentDesc.value,
    //   severity: refs.incidentSeverity.value
    // }).done((res) => {
    //   showAlert(res.success ? 'Added successfully!' : 'Add failed!')
    // })
  }

  onClickUpdateOpenIncident () {
    // $.get(`${ROOT_URL}${Api.test.changeOpenIncidentCount}`, { // eslint-disable-line no-undef
    //   count: this.refs.openIncident.value || 0
    // }).done((res) => {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickUpdateTodayIncident () {
    // $.get(`${ROOT_URL}${Api.test.changeTodayIncidentCount}`, { // eslint-disable-line no-undef
    //   count: this.refs.todayIncident.value || 0
    // }).done((res) => {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickUpdateAttackerToday () {
    // $.get(`${ROOT_URL}${Api.test.changeAttackerTodayCount}`, { // eslint-disable-line no-undef
    //   count: this.refs.attackerToday.value || 0
    // }).done((res) => {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickUpdateMonthIncident () {
    // $.get(`${ROOT_URL}${Api.test.changeMonthIncidentCount}`, { // eslint-disable-line no-undef
    //   count: this.refs.monthIncident.value || 0
    // }).done((res) => {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickPushNews () {
    // $.get(`${ROOT_URL}${Api.test.pushNews}`, { // eslint-disable-line no-undef
    //   news: this.refs.news.value
    // }).done(function (res) {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickUpdateDeviceStatus () {
    // $.get(`${ROOT_URL}${Api.test.changeDeviceStatus}`, { // eslint-disable-line no-undef
    //   deviceId: this.refs.deviceId.value || 0,
    //   status: this.refs.deviceStatus.value
    // }).done(function (res) {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickUpdateColor () {
    // $.get(`${ROOT_URL}${Api.test.changeConnectorColor}`, { // eslint-disable-line no-undef
    //   connectorId: this.refs.connectorId.value || 0,
    //   color: this.state.lineColor
    // }).done(function (res) {
    //   showAlert(res.success ? 'Notified!' : 'Failed!')
    // })
  }

  onClickColorPicker () {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  onCloseColorPicker () {
    this.setState({ displayColorPicker: false })
  }

  onChangeColorPicker (color) {
    this.setState({ lineColor: color.hex })
  }

  render () {
    const popover = {
      position: 'absolute',
      zIndex: '2',
      left: '-40px',
      top: '-250px'

    }
    const cover = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }

    return (
      <div>
        <div className="padding-md form-mui-inline">
          <TextField floatingLabelText="Name"/>&nbsp;
          <TextField floatingLabelText="Description"/>&nbsp;
          <SelectField
            floatingLabelText="Severity"
            value="HIGH">
            <MenuItem value="HIGH" primaryText="High"/>
            <MenuItem value="MEDIUM" primaryText="Medium"/>
            <MenuItem value="LOW" primaryText="Low"/>
            <MenuItem value="AUDIT" primaryText="Audit"/>
          </SelectField>

          <RaisedButton label="Add Incident" onTouchTap={this.onClickAddIncident.bind(this)} primary className="margin-md-top"/>
        </div>

        <div className="header-red">BI</div>
        <div className="padding-md-left">
          <div className="form-mui-inline">
            <TextField floatingLabelText="Open Incidents"/>&nbsp;
            <RaisedButton label="Update" onTouchTap={this.onClickUpdateOpenIncident.bind(this)} primary className="margin-md-top"/>
          </div>

          <div className="form-mui-inline">
            <TextField floatingLabelText="Today Incidents"/>&nbsp;
            <RaisedButton label="Update" onTouchTap={this.onClickUpdateTodayIncident.bind(this)} primary className="margin-md-top"/>
          </div>

          <div className="form-mui-inline">
            <TextField floatingLabelText="Attackers Today"/>&nbsp;
            <RaisedButton label="Update" onTouchTap={this.onClickUpdateAttackerToday.bind(this)} primary className="margin-md-top"/>
          </div>

          <div className="form-mui-inline">
            <TextField floatingLabelText="Month Incidents"/>&nbsp;
            <RaisedButton label="Update" onTouchTap={this.onClickUpdateMonthIncident.bind(this)} primary className="margin-md-top"/>
          </div>

          <div className="form-mui-inline">
            <TextField floatingLabelText="Incident News"/>&nbsp;
            <RaisedButton label="Push" onTouchTap={this.onClickPushNews.bind(this)} primary className="margin-md-top"/>
          </div>
        </div>

        <div className="header-green">Device</div>
        <div className="padding-md-left">
          <div className="form-mui-inline">
            <TextField floatingLabelText="Device ID"/>&nbsp;
            <SelectField floatingLabelText="Status" value="up">
              <MenuItem value="up" primaryText="Up"/>
              <MenuItem value="down" primaryText="Down"/>
            </SelectField>

            <RaisedButton label="Update" onTouchTap={this.onClickUpdateDeviceStatus.bind(this)} primary className="margin-md-top"/>
          </div>
          <div className="form-mui-inline">
            <TextField floatingLabelText="Connection ID"/>&nbsp;
            <div className="inline-block margin-md-top margin-md-right">
              <div className="input-group colorpicker-element" onClick={this.onClickColorPicker.bind(this)}>
                <div className="input-group-addon">
                  <i className="color-preview" style={{background: this.state.lineColor}} />
                </div>
              </div>

              {
                this.state.displayColorPicker ? <div style={popover}>
                  <div style={cover} onClick={this.onCloseColorPicker.bind(this)}/>
                  <ChromePicker color={this.state.lineColor} onChangeComplete={this.onChangeColorPicker.bind(this)}/>
                </div> : null
              }
            </div>

            <RaisedButton label="Update" onTouchTap={this.onClickUpdateColor.bind(this)} primary className="margin-md-top"/>
          </div>
        </div>
      </div>
    )
  }
}
