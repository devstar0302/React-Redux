import React from 'react'

import SearchMonitorModalView from './SearchMonitorModalView'
import { showAlert } from 'components/common/Alert'

export default class SearchMonitorModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null
    }
  }

  onClickRow (selected) {
    this.setState({selected})
  }

  onClickOK () {
    const {selected} = this.state
    if (!selected) {
      showAlert('Please select monitor')
      return
    }
    this.props.onClickOK(selected)
  }

  onClickClose () {
    this.props.showSearchMonitorModal(false)
  }

  onClickShowAny () {
    this.props.onClickOK('')
  }

  render () {
    return (
      <SearchMonitorModalView
        allDevices={this.props.allDevices}
        selected={this.state.selected}
        onClickOK={this.onClickOK.bind(this)}
        onClickClose={this.onClickClose.bind(this)}
        onClickRow={this.onClickRow.bind(this)}
        onClickShowAny={this.onClickShowAny.bind(this)}
      />
    )
  }
}
