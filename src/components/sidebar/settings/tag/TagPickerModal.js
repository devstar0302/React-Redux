import React from 'react'
import {findIndex} from 'lodash'

import TagPickerModalView from './TagPickerModalView'

import {showPrompt, showAlert} from 'components/common/Alert'

export default class TagPickerModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }
  componentWillMount () {
    this.props.selectTag([])
    this.props.fetchTags()
  }
  onSelectTag (tag) {
    const {selectedTags, selectTag} = this.props
    if (!selectedTags.includes(tag)) selectTag([...selectedTags, tag])
  }
  onDeselectTag (tag) {
    const {selectedTags, selectTag} = this.props
    selectTag(selectedTags.filter(p => p !== tag.id))
  }
  onClickOK () {
    const {selectedTags, onPick, onPickMulti, onClickClose} = this.props
    if (!selectedTags.length) return showAlert('Please select tag.')
    if (onPickMulti) {
      onPickMulti(selectedTags.map(p => ({name: p})))
    } else if (onPick) {
      selectedTags.map(p => ({name: p})).forEach(onPick)
    }

    onClickClose()
  }
  onClickAdd () {
    showPrompt('Please type tag name.', '', tag => {
      if (!tag) return
      this.props.addTag({
        name: tag,
        desc: ''
      })
    })
  }
  onChangeValue (p) {
    const {tags} = this.props
    const index = findIndex(tags, {id: p.value})
    if (index < 0) return
    this.onSelectTag(tags[index].name)
  }
  render () {
    return (
      <TagPickerModalView
        {...this.props}
        value={null}
        onChangeValue={this.onChangeValue.bind(this)}
        onClickAdd={this.onClickAdd.bind(this)}
        onSelectTag={this.onSelectTag.bind(this)}
        onDeselectTag={this.onDeselectTag.bind(this)}
        onClickOK={this.onClickOK.bind(this)}
      />
    )
  }
}
