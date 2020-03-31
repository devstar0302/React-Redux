import React from 'react'
import {concat} from 'lodash'

import SearchFieldsModalView from './SearchFieldsModalView'

class SearchFieldsModal extends React.Component {
  onClickOK () {
    const {selectedSearchFields} = this.props
    if (!selectedSearchFields.length) return
    this.props.updateRelDeviceFields(selectedSearchFields)
    this.onClickClose()
  }
  onClickClose () {
    this.props.showSearchFieldsModal(false)
  }
  onCheck (checked, item) {
    const {selectedSearchFields} = this.props
    const items = checked ? concat(selectedSearchFields, item) : selectedSearchFields.filter(p => p !== item)
    this.props.updateSelectedSearchFields(items)
  }
  render () {
    return (
      <SearchFieldsModalView
        {...this.props}
        onCheck={this.onCheck.bind(this)}
        onClickOK={this.onClickOK.bind(this)}
        onClickClose={this.onClickClose.bind(this)}
      />
    )
  }
}

export default SearchFieldsModal
