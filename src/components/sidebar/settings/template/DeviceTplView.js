import React from 'react'
import { reduxForm } from 'redux-form'
import { assign, concat } from 'lodash'
import { connect } from 'react-redux'
import { getCustomImageUrl, extImageBaseUrl } from 'shared/Global'
import DeviceTplModalView from './DeviceTplModalView'

import TagPickerModal from 'containers/settings/tag/TagPickerModalContainer'

class DeviceTplView extends React.Component {
  componentWillMount () {
    const {initialValues} = this.props
    const {workflowids} = initialValues
    if (workflowids && workflowids.length) {
      this.props.fetchDeviceTplWorkflows(workflowids)
    }
  }
  componentWillUpdate (nextProps) {
    const {initialValues} = nextProps
    const {workflowids} = initialValues || {}
    if (workflowids && (!this.props.initialValues || workflowids !== this.props.initialValues.workflowids)) {
      this.props.fetchDeviceTplWorkflows(workflowids)
    }
  }

  onClickAddTag () {
    this.props.showDeviceTplTagModal(true)
  }
  onPickTag (tag) {
    this.props.addDeviceTplTag(tag.name)
  }

  handleFormSubmit (formProps) {
    const {deviceTpl, selectedTplImage, editDeviceTplTags} = this.props
    const tpl = assign({}, (deviceTpl || {}), formProps, {
      monitors: this.props.monitors,
      workflowids: this.props.editTplWorkflows.map(u => u.uuid || ''),
      tags: editDeviceTplTags
    })
    if (selectedTplImage) tpl.image = selectedTplImage.uuid
    if (deviceTpl) { this.props.updateDeviceTemplate(tpl) } else {
      this.props.addDeviceTemplate(tpl)
    }
  }

  getImageUrl () {
    const {selectedTplImage, deviceTpl} = this.props
    let imgUrl = ''
    if (selectedTplImage) {
      imgUrl = getCustomImageUrl(selectedTplImage)
    } else if (deviceTpl && deviceTpl.image) {
      imgUrl = extImageBaseUrl + deviceTpl.image
    }
    return imgUrl
  }

  onClickAddMonitor (item) {
    const monitors = concat([], this.props.monitors, item)
    this.props.updateSelectedDeviceTplMonitors(monitors)
  }

  onClickEditMonitor (item) {
    this.props.openMonitorTplModal(item)
  }

  onClickRemoveMonitor (index) {
    const monitors = this.props.monitors.filter((m, i) => i !== index)
    this.props.updateSelectedDeviceTplMonitors(monitors)
  }

  onClickChangeImage () {
    this.props.openTplImageModal()
  }

  onClickDeleteWf (wf) {
    this.props.removeDeviceTplWf(wf)
  }

  renderOptions () {
    let categories = this.props.deviceCategories
    let options = categories.map(m => ({value: m.name, label: m.name}))
    return options
  }

  renderTagsModal () {
    if (!this.props.deviceTplTagModalOpen) return null
    return (
      <TagPickerModal
        onPick={this.onPickTag.bind(this)}
        onClickClose={() => this.props.showDeviceTplTagModal(false)}/>
    )
  }

  render () {
    const { handleSubmit, editDeviceTplTags, removeDeviceTplTag, deviceTpl } = this.props
    let header = 'Device Template'
    let imgUrl = this.getImageUrl()
    let options = this.renderOptions()
    return (
      <DeviceTplModalView
        show
        innerView
        header={header}
        monitors={this.props.monitors}
        monitorTemplates={this.props.monitorTemplates}
        workflows={this.props.editTplWorkflows}
        onSubmit={deviceTpl.origin === 'SYSTEM' ? null : handleSubmit(this.handleFormSubmit.bind(this))}
        options={options}
        imgUrl={imgUrl}
        onChange={this.onClickChangeImage.bind(this)}
        onAddMonitor={this.onClickAddMonitor.bind(this)}
        onRemoveMonitor={this.onClickRemoveMonitor.bind(this)}
        onEditMonitor={this.onClickEditMonitor.bind(this)}

        showWfSelectModal={this.props.showWfSelectModal}
        onClickDeleteWf={this.onClickDeleteWf.bind(this)}

        tags={editDeviceTplTags}
        onClickAddTag={this.onClickAddTag.bind(this)}
        onClickDeleteTag={removeDeviceTplTag}
        tagModal={this.renderTagsModal()}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.selectedDeviceTpl || {}
  })
)(reduxForm({form: 'deviceTplView'})(DeviceTplView))
