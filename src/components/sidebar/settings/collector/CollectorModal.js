import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import CollectorModalView from './CollectorModalView'

class CollectorModal extends React.Component {
  onClickClose () {
    this.props.showCollectorModal(false)
  }
  handleFormSubmit (values) {
    const {editCollector} = this.props
    if (editCollector) {
      this.props.updateCollector({
        ...editCollector,
        ...values
      })
    } else {
      this.props.addCollector(values)
    }
  }
  render () {
    const {handleSubmit} = this.props
    return (
      <CollectorModalView
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onHide={this.onClickClose.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: {ostype: 'WINDOWS', ...state.settings.editCollector}
  })
)(reduxForm({form: 'collectorForm'})(CollectorModal))
