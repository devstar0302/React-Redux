import React from 'react'
import { assign, keys } from 'lodash'
import { reduxForm } from 'redux-form'

import ParamEditModal from './input/ParamEditModal'
import TagsView from './input/TagsView'
import ParamList from './input/ParamList'

import CredPicker from 'containers/settings/credentials/CredsPickerContainer'
import MonitorWizardView from './MonitorWizardView'

import {showAlert} from 'components/common/Alert'

class MonitorWizard extends React.Component {
  componentDidMount () {
    // if (!this.hasCreds()) {
    //   this.props.showDeviceCredsPicker(true)
    // }
  }

  hasCreds () {
    if (this.showAgentType()) {
      const {selectedDevice, credentials, monitorConfig} = this.props
      const credTypes = monitorConfig.credentialTypes || []
      const creds = credentials.filter(p => !p.global && p.deviceIds && p.deviceIds.indexOf(selectedDevice.id) >= 0) || []
      let found = true
      credTypes.forEach(type => {
        if (!creds.filter(p => p.type === type).length)
          found = false
      })
      return found
    }
    return true
  }

  showAgentType (suppress) {
    const {monitorConfig, selectedDevice, collectors} = this.props
    const credTypes = monitorConfig.credentialTypes || []

    if (!selectedDevice) return true

    //Step 1
    if (selectedDevice.agent) return false

    //Step 2
    if (credTypes.length === 0) return false

    //Step 3
    if (monitorConfig.needWindowsAgentCollector) {
      // if (collectors.filter(p => p.ostype === 'WINDOWS').length) return false
    } else {
      if (collectors.filter(p => p.ostype === 'LINUX').length) return false
    }

    return true
  }

  handleFormSubmit (values) {
    const { extraParams, onFinish, editParams, canAddTags, monitorTags, selectedDevice } = this.props
    if (values.agentType === 'collector') {
      if (!values.collectorId) {
        showAlert('Please install collector.')
        return
      }
    } else if (values.agentType === 'agent') {
      if (selectedDevice && !selectedDevice.agent) {
        showAlert('Please install agent.')
        return
      }
    }


    const params = {}
    if (editParams) {
      editParams.forEach(p => {
        params[p.key] = p.value
      })
    }

    if (values.checkinterval !== null) {
      values.checkinterval = values.checkinterval * 1000
    }

    if (values.remove_after !== null) {
      switch (values.remove_after_unit) {
        case 'months':
          params.remove_after = values.remove_after * 30
          break
        case 'years':
          params.remove_after = values.remove_after * 365
          break
        default:
          params.remove_after = values.remove_after
      }
    }

    const props = assign(
      {},
      values,
      extraParams, {
        params
      }
    )

    //Merge required params
    this.getRequiredParamKeys().forEach(key => {
      props.params[key] = props[key]
    })

    if (canAddTags) props.tags = monitorTags || []
    console.log(props)
    this.closeModal(true)
    onFinish && onFinish(null, props)
  }

  closeModal (data) {
    this.props.onClose && this.props.onClose(this, data)
  }
  onCloseCredPicker (selected) {
    if (selected) {
      const {selectedDevice} = this.props
      const props = {
        ...selectedDevice,
        credentials: [selected]
      }
      this.props.updateMapDevice(props)
    }
    this.props.showDeviceCredsPicker(false)
  }
  getRequiredParamKeys() {
    return keys(this.props.monitorConfig.params || {})
  }
  getRelevantCreds() {
    const {monitorConfig, credentials, selectedDevice} = this.props
    const credentialTypes = monitorConfig.credentialTypes || []
    return (credentials || []).filter(p =>
      (p.global || !selectedDevice || (p.deviceIds || []).indexOf(selectedDevice.id) >= 0) &&
      credentialTypes.indexOf(p.type) >= 0
    ).map(p => ({
      label: p.name,
      value: p.id
    }))
  }
  getCollectors () {
    const {monitorConfig, collectors} = this.props
    if (monitorConfig.needWindowsAgentCollector) {
      return collectors.filter(p => p.ostype === 'WINDOWS')
    }
    return collectors.filter(p => p.ostype === 'LINUX')
  }
  renderParamEditModal () {
    if (!this.props.paramEditModalOpen) return null
    return (
      <ParamEditModal/>
    )
  }

  renderTags () {
    if (!this.props.canAddTags) return null
    return (
      <TagsView {...this.props}/>
    )
  }

  renderCredPicker () {
    if (!this.props.deviceCredsPickerVisible) return null
    return (
      <CredPicker onClose={this.onCloseCredPicker.bind(this)}/>
    )
  }
  renderParamList () {
    return (
      <ParamList
        editParams={this.props.editParams}
        openParamEditModal={this.props.openParamEditModal}
        closeParamsModal={this.props.closeParamsModal}
        removeParam={this.props.removeParam}
        updateMonitorParams={this.props.updateMonitorParams}
        monitorConfig={this.props.monitorConfig}
      />
    )
  }
  render () {
    const { title, handleSubmit, monitorConfig, selectedDevice, initialValues } = this.props
    const header = title || `${monitorConfig ? monitorConfig.name : ''} Monitor`
    const paramEditModal = this.renderParamEditModal()

    return (
      <MonitorWizardView
        header={header}
        paramEditModal={paramEditModal}
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        tagsView={this.renderTags()}

        requiredParamKeys={this.getRequiredParamKeys()}
        paramsView={this.renderParamList()}

        credPicker={this.renderCredPicker()}
        credentials={this.getRelevantCreds()}

        showAgentType={this.showAgentType(true)}
        collectors={this.getCollectors()}

        agent={selectedDevice && !!selectedDevice.agent}

        isEdit={!!initialValues.uid}
      />
    )
  }
}

export default reduxForm({
  form: 'monitorWizardForm'
})(MonitorWizard)
