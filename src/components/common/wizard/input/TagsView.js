import React from 'react'
import {Chip} from 'material-ui'
import TagPickerModal from 'containers/settings/tag/TagPickerModalContainer'

import { chipStyles } from 'style/common/materialStyles'

export default class TagsView extends React.Component {
  onClickAddTag () {
    this.props.showMonitorTagModal(true)
  }
  onPickTag (tags) {
    const {monitorTags} = this.props
    const selected = tags.map(p => p.name).filter(p => monitorTags.indexOf(p) < 0)
    this.props.updateMonitorTags([...monitorTags, ...selected])
  }
  onClickDeleteTag (index) {
    const {monitorTags} = this.props
    this.props.updateMonitorTags(monitorTags.filter((p, i) => i !== index))
  }
  renderTagsModal () {
    if (!this.props.monitorTagModalOpen) return null
    return (
      <TagPickerModal
        onPickMulti={this.onPickTag.bind(this)}
        onClickClose={() => this.props.showMonitorTagModal(false)}/>
    )
  }
  render () {
    const {monitorTags} = this.props
    return (
      <div className="margin-md-top">
        <div style={chipStyles.wrapper}>
          <label className="padding-xs-top" style={{...chipStyles.chip, width: 80}}>Tags</label>
          {monitorTags.map((t, i) =>
            <Chip key={i} style={chipStyles.chip} onRequestDelete={() => this.onClickDeleteTag(i)}>{t}</Chip>
          )}
          <Chip style={chipStyles.chip} onTouchTap={() => this.onClickAddTag()}><b>&nbsp;&nbsp;+&nbsp;&nbsp;</b></Chip>
        </div>
        {this.renderTagsModal()}
      </div>
    )
  }
}
