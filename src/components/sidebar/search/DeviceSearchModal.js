import React, { Component } from 'react'
import { findIndex, concat } from 'lodash'
import DeviceSearchModalView from './DeviceSearchModalView'

const styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },
  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },
  menu: {
    border: 'solid 1px #ccc'
  }
}

export default class DeviceSearchModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      value: '',
      loading: false,
      selected: props.devices || []
    }
    this.closeModal = this.closeModal.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClickRemove = this.onClickRemove.bind(this)
  }

  componentWillMount () {
    this.searchDevice('')
  }

  componentWillUpdate (nextProps, nextState) {
    const {incidentDevices} = this.props
    if (incidentDevices && incidentDevices !== nextProps.incidentDevices && nextState.selected.length === 0) {
      this.setState({
        selected: concat([], nextProps.incidentDevices)
      })
    }
  }

  closeModal () {
    let data = this.state.selected
    this.props.onClose &&
    this.props.onClose(this, data)
  }

  searchDevice (keyword) {
    this.props.searchIncidentDevices({
      name: keyword
    })
  }

  onClickRemove (device) {
    let {selected} = this.state
    const index = selected.indexOf(device)
    if (index < 0) return
    selected.splice(index, 1)
    this.setState({selected})
  }

  onSelect (value, item) {
    let {selected} = this.state
    const index = findIndex(selected, {id: value})
    if (index >= 0) return
    selected.push(item)
    this.setState({ value: '', selected })
  }

  onChange (event, value) {
    this.setState({ value, loading: true })
    this.searchDevice(value)
  }

  render () {
    return (
      <DeviceSearchModalView
        show
        onHide={this.closeModal}
        value={this.state.value}
        selected={this.state.selected}
        items={this.props.incidentDevices}
        onSelect={this.onSelect}
        onChange={this.onChange}
        onRemove={this.onClickRemove}
        styles={styles}
      />
    )
  }
}
