import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import SimulationModalView from './SimulationModalView'

class SimulationModal extends React.Component {
  onClickClose () {
    this.props.showSimulationModal(false)
  }
  handleFormSubmit (values) {
    this.props.postIncidentSimulation(values.text)
  }
  render () {
    const {handleSubmit} = this.props
    return (
      <SimulationModalView
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onHide={this.onClickClose.bind(this)}/>
    )
  }
}
export default connect(
  state => ({
    initialValues: {}
  })
)(reduxForm({form: 'incidentSimulationForm'})(SimulationModal))
