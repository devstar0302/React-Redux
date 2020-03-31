import React from 'react'
import DeviceEditWizard from 'components/common/wizard/DeviceEditWizard'
import { connect } from 'react-redux'
import {
  openTplImageModal,
  closeTplImageModal,
  fetchImages,
  uploadImage,

  showDeviceTagModal,
  updateDeviceTags,

  updateDeviceCreds,
  showDeviceCredsPicker,
  selectDeviceCreds,

  installAgent,
  uninstallAgent,

  fetchCredentials,
  addCredentials,
  removeCredentials,
  fetchCredTypes,

  fetchCollectors,
  showCollectorModal,
  addCollector
} from 'actions'

class DeviceEditWizardContainer extends React.Component {
  render () {
    return (
      <DeviceEditWizard {...this.props} />
    )
  }
}

DeviceEditWizard.defaultProps = {
  deviceType: '',

  extraParams: {},
  configParams: {},

  onSaved: null,
  onFinish: null,

  tabs: [{
    title: 'General',
    include: ['name', 'image', 'agentid', 'ipaddress', 'wanip', 'lanip', 'hostname', 'port', 'dbtype', 'sql', 'disabled', 'url'],
    width: 4
  }, {
    title: 'Info',
    include: ['info'],
    width: 4
  }, {
    title: 'Advanced',
    id: 'tab-devinfo-advanced',
    include: ['server_url', 'deviceid', 'devicetype', 'response', 'checkinterval', 'status', 'basicchecks', 'externalIP', 'tags'],
    extra: [{
      name: 'id',
      title: 'DeviceId'
    }, {
      name: 'templateName',
      title: 'Template Name'
    }],
    width: 4
  }/*, {
    title: 'Credentials',
    include: ['credentials'],
    width: 12
  }*/]
}

export default connect(
  state => ({
    initialValues: state.dashboard.selectedDevice,

    selectedDevice: state.dashboard.selectedDevice,

    tplImageModalVisible: state.settings.tplImageModalVisible,
    selectedTplImage: state.settings.selectedTplImage,

    images: state.dashboard.images,

    deviceTagModalOpen: state.devices.deviceTagModalOpen,
    deviceTags: state.devices.deviceTags,
    deviceCreds: state.devices.deviceCreds,
    deviceCredsPickerVisible: state.devices.deviceCredsPickerVisible,
    selectedDeviceCreds: state.devices.selectedDeviceCreds,

    credentials: state.settings.credentials,
    credentialTypes: state.settings.credentialTypes,

    collectors: state.settings.collectors,
    collectorModalOpen: state.settings.collectorModalOpen,

    installAgentMessage: state.devices.installAgentMessage
  }), {
    openTplImageModal,
    closeTplImageModal,
    fetchImages,
    uploadImage,

    showDeviceTagModal,
    updateDeviceTags,

    updateDeviceCreds,
    showDeviceCredsPicker,
    selectDeviceCreds,

    installAgent,
    uninstallAgent,

    fetchCredentials,
    addCredentials,
    removeCredentials,
    fetchCredTypes,

    fetchCollectors,
    showCollectorModal,
    addCollector
  }
)(DeviceEditWizardContainer)
