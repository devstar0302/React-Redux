import React from 'react'
import CredentialModal from './CredentialModal'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {IconButton} from 'material-ui'

import {showConfirm} from 'components/common/Alert'

export default class Credentials extends React.Component {
  componentDidMount () {
    this.props.selectDeviceCreds(-1)
  }
  onClickAdd () {
    this.props.showDeviceCredsPicker(true)
  }
  onClickRemove (selected) {
    showConfirm('Are you sure?', btn => {
      if (btn !== 'ok') return
      this.props.removeCredentials(selected)
    })

  }
  onCloseCredPicker (props) {
    if (props) {
      const {selectedDevice} = this.props
      this.props.addCredentials({
        ...props,
        global: false,
        deviceIds: [selectedDevice.id]
      })
    }
    this.props.showDeviceCredsPicker(false)
  }
  renderPicker () {
    if (!this.props.deviceCredsPickerVisible) return null

    return (
      <CredentialModal
        addCredentials={this.onCloseCredPicker.bind(this)}
        credentialTypes={this.props.credentialTypes}
        onClose={this.onCloseCredPicker.bind(this)}/>
    )
  }
  getDeviceCreds () {
    const { selectedDevice, credentials } = this.props
    return credentials.filter(p => !p.global && p.deviceIds && p.deviceIds.indexOf(selectedDevice.id) >= 0)
  }
  render () {
    const { selectedDeviceCreds, selectDeviceCreds } = this.props

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>User</th>
              <th />
            </tr>
          </thead>
          <tbody>
          {this.getDeviceCreds().map((p, i) =>
            <tr
              key={i}
              className={selectedDeviceCreds === i ? 'selected' : ''}
              onClick={() => selectDeviceCreds(i)}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.type}</td>
              <td>{p.username}</td>
              <td>
                <IconButton style={{padding: 0, width: 24, height: 24}}
                  onTouchTap={this.onClickRemove.bind(this, p)}>
                  <DeleteIcon color="#545454" hoverColor="#f44336"/>
                </IconButton>
              </td>
            </tr>
          )}
          </tbody>
        </table>
        {this.renderPicker()}
      </div>
    )
  }
}
