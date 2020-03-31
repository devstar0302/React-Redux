import React from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'

import MonitorTplModalView from './MonitorTplModalView'
import { getCustomImageUrl, extImageBaseUrl } from 'shared/Global'
import TagPickerModal from 'containers/settings/tag/TagPickerModalContainer'
import CredTypePicker from 'containers/settings/credentials/CredTypePickerContainer'

class MonitorTplModal extends React.Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.state = {}
    this.getImageUrl = this.getImageUrl.bind(this)
    this.onClickChangeImage = this.onClickChangeImage.bind(this)
    console.log(props.selectedDeviceTpl)
  }

  onClickAddTag () {
    this.props.showMonitorTplTagModal(true)
  }
  onPickTag (tag) {
    const {monitorTplTags} = this.props
    this.props.updateMonitorTplTags([...monitorTplTags, tag.name])
  }
  onClickDeleteTag (index) {
    const {monitorTplTags} = this.props
    this.props.updateMonitorTplTags(monitorTplTags.filter((p, i) => i !== index))
  }

  handleFormSubmit (formProps) {
    const {
      monitorTpl, selectedTplImage, monitorTplTags, monitorTplCredTypes,
      selectedDeviceTpl, selectedDeviceMonitors
    } = this.props
    const tpl = assign({}, (monitorTpl || {}), formProps, {
      tags: monitorTplTags || [],
      credentialTypes: monitorTplCredTypes
    })
    if (selectedTplImage) tpl.image = selectedTplImage.uuid

    if (selectedDeviceTpl) {
      if (monitorTpl) {
        this.props.updateSelectedDeviceTplMonitors(
          selectedDeviceMonitors.map(p => p.uid === tpl.uid ? tpl : p)
        )
      } else {
        this.props.updateSelectedDeviceTplMonitors(
          [...selectedDeviceMonitors, tpl]
        )
      }
      this.props.closeMonitorTplModal()
    } else {
      if (monitorTpl) {
        this.props.updateMonitorTemplate(tpl)
      } else {
        this.props.addMonitorTemplate(tpl)
      }
    }

  }

  getImageUrl () {
    const {selectedTplImage, monitorTpl} = this.props
    let imgUrl = ''
    if (selectedTplImage) {
      imgUrl = getCustomImageUrl(selectedTplImage)
    } else if (monitorTpl && monitorTpl.image) {
      imgUrl = extImageBaseUrl + monitorTpl.image
    }
    return imgUrl
  }

  onClickClose () {
    this.props.closeMonitorTplModal()
  }

  onClickChangeImage () {
    this.props.openTplImageModal()
  }
  onClickAddCredType () {
    this.props.showMonitorTplCredTypesPicker(true)
  }
  onClickDeleteCredType (sel) {
    const {monitorTplCredTypes} = this.props
    this.props.updateMonitorTplCredTypes(monitorTplCredTypes.filter((p, i) => i !== sel))
  }
  onCloseCredTypePicker (sel) {
    this.props.showMonitorTplCredTypesPicker(false)
    if (sel) {
      const {monitorTplCredTypes} = this.props
      if (monitorTplCredTypes.indexOf(sel.name) >= 0) return
      this.props.updateMonitorTplCredTypes([...monitorTplCredTypes, sel.name])
    }
  }
  renderTagsModal () {
    if (!this.props.monitorTplTagModalOpen) return null
    return (
      <TagPickerModal
        onPick={this.onPickTag.bind(this)}
        onClickClose={() => this.props.showMonitorTplTagModal(false)}/>
    )
  }
  renderCredTypePicker () {
    if (!this.props.monitorTplCredTypePickerOpen) return null
    return (
      <CredTypePicker onClose={this.onCloseCredTypePicker.bind(this)} />
    )
  }
  render () {
    const { handleSubmit, monitorTplTags, monitorTplCredTypes } = this.props
    let header = 'Monitor Template'
    let imgUrl = this.getImageUrl()
    return (
      <MonitorTplModalView
        show
        header={header}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onHide={this.onClickClose.bind(this)}
        imgUrl={imgUrl}
        onChange={this.onClickChangeImage}

        tags={monitorTplTags}
        onClickAddTag={this.onClickAddTag.bind(this)}
        onClickDeleteTag={this.onClickDeleteTag.bind(this)}
        tagModal={this.renderTagsModal()}

        credTypeModal={this.renderCredTypePicker()}
        monitorTplCredTypes={monitorTplCredTypes}
        onClickAddCredType={this.onClickAddCredType.bind(this)}
        onClickDeleteCredType={this.onClickDeleteCredType.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.monitorTpl || {}
  })
)(reduxForm({form: 'monitorTplEdit'})(MonitorTplModal))
