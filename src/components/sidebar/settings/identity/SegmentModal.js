import React, { Component } from 'react'
import { showAlert } from 'components/common/Alert'
import { ROOT_URL } from 'actions/config'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class SegmentModal extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
    this.renderCountryOptions = this.renderCountryOptions.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
  }

  closeModal (data) {
    this.setState({ open: false }, () => {
      this.props.onClose && this.props.onClose(this, data)
    })
  }

  onClickSave (data) {
    const { segment } = this.props
    if (segment) data.id = segment.id
    const url = segment ? Api.admin.editSegment : Api.admin.addSegment // eslint-disable-line no-undef
    $.get(`${ROOT_URL}${url}`, data).done(res => { // eslint-disable-line no-undef
      if (!res.success) return showAlert('Save failed!')
      this.closeModal(res.object)
    }).fail(() => {
      showAlert('Save failed!')
    })
  }

  renderCountryOptions () {
    let options = [].map(item => ({value: item.name, label: item.name}))
    return options
  }

  render () {
    const { segment } = this.props
    let header = 'Segment'
    let countryOptions = this.renderCountryOptions()
    let locOptions = [
      {value: 'LAN', label: 'LAN'},
      {value: 'DMZ', label: 'DMZ'},
      {value: 'Branch', label: 'Branch'},
      {value: 'Internet', label: 'Internet'},
      {value: 'External', label: 'External'}
    ]
    let content = [
      {name: 'Name'},
      {name: 'Start IP'},
      {name: 'End IP'},
      {type: 'select', name: 'Location', options: locOptions},
      {type: 'select', name: 'Country', options: countryOptions}
    ]
    let initialValues = segment ? {
      name: segment.name,
      startip: segment.startip,
      endip: segment.endip,
      location: segment.location,
      country: segment.country
    } : null
    return (
      <MuiThemeProvider>
        <SimpleModalContainer
          header={header}
          content={content}
          doAction={this.onClickSave}
          onClose={this.closeModal}
          validate={validate}
          initialValues={initialValues}
        />
      </MuiThemeProvider>
    )
  }
}

SegmentModal.defaultProps = {
  segment: null
}
