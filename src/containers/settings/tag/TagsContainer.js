import React from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router'

import Tags from 'components/sidebar/settings/tag/Tags'

import {
  showTagModal,
  addTag,
  updateTag,
  removeTag,
  fetchTags,
  multiSelectTag,
  fetchItemsByTags,

  fetchDevices
} from 'actions'

class TagsContainer extends React.Component {
  render () {
    return (
      <Tags {...this.props}/>
    )
  }
}

export default connect(
  state => ({
    tags: state.tag.tags,
    tagDraw: state.tag.tagDraw,
    tagModalOpen: state.tag.tagModalOpen,
    editTag: state.tag.editTag,
    multiSelTags: state.tag.multiSelTags,

    tagDevices: state.tag.tagDevices,
    tagWorkflows: state.tag.tagWorkflows,
    tagParserTypes: state.tag.tagParserTypes,
    tagDeviceTpls: state.tag.tagDeviceTpls,
    tagMonitorTpls: state.tag.tagMonitorTpls,
    tagMonitors: [],

    devices: state.devices.devices
  }), {
    showTagModal,
    addTag,
    updateTag,
    removeTag,
    fetchTags,
    multiSelectTag,
    fetchItemsByTags,

    fetchDevices
  }
)(withRouter(TagsContainer))
