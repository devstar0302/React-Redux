import React from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { getCustomImageUrl, extImageBaseUrl } from 'shared/Global'
import DeviceTplModalView from './DeviceTplModalView'

import TagPickerModal from 'containers/settings/tag/TagPickerModalContainer'

class DeviceTplModal extends React.Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.state = {
      monitors: props.deviceTpl ? props.deviceTpl.monitors : []
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
      monitors: this.state.monitors,
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

  onClickClose () {
    this.props.closeDeviceTplModal()
  }

  onClickAddMonitor (item) {
    let {monitors} = this.state
    monitors.push(item)
    this.setState({monitors})
  }

  onClickEditMonitor (item) {
    this.props.openMonitorTplModal(item)
  }

  onClickRemoveMonitor (index) {
    let {monitors} = this.state
    monitors.splice(index, 1)
    this.setState({monitors})
  }

  onClickChangeImage () {
    this.props.openTplImageModal()
  }

  onClickDeleteWf () {

  }

  renderTagsModal () {
    if (!this.props.deviceTplTagModalOpen) return null
    return (
      <TagPickerModal
        onPick={this.onPickTag.bind(this)}
        onClickClose={() => this.props.showDeviceTplTagModal(false)}/>
    )
  }

  renderOptions () {
    let categories = this.props.deviceCategories
    let options = categories.map(m => ({value: m.name, label: m.name}))
    return options
  }

  render () {
    const { handleSubmit, editDeviceTplTags, removeDeviceTplTag, editTplWorkflows, showWfSelectModal, removeDeviceTplWf } = this.props
    let header = 'Device Template'
    let imgUrl = this.getImageUrl()
    let options = this.renderOptions()
    return (
      <DeviceTplModalView
        header={header}

        workflows={editTplWorkflows}
        showWfSelectModal={showWfSelectModal}
        onClickDeleteWf={removeDeviceTplWf}

        monitors={this.state.monitors}
        monitorTemplates={this.props.monitorTemplates}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onHide={this.onClickClose.bind(this)}
        options={options}
        imgUrl={imgUrl}
        onChange={this.onClickChangeImage.bind(this)}
        onAddMonitor={this.onClickAddMonitor.bind(this)}
        onRemoveMonitor={this.onClickRemoveMonitor.bind(this)}
        onEditMonitor={this.onClickEditMonitor.bind(this)}

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
    initialValues: state.settings.deviceTpl || {}
  })
)(reduxForm({form: 'deviceTplEdit'})(DeviceTplModal))
