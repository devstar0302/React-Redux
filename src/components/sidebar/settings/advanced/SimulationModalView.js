import React from 'react'
import { Field } from 'redux-form'

import { SubmitBlock, FormInput, Modal, CardPanel } from 'components/modal/parts'

export default class SimulationModalView extends React.Component {
  render () {
    const {onHide, onSubmit} = this.props
    return (
      <Modal title="Simulation" onRequestClose={onHide}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Simulation">
            <div className="form-column">
              <Field name="text" component={FormInput} floatingLabel="Text"/>
            </div>
          </CardPanel>
          <SubmitBlock name="Send" onClick={onHide}/>
        </form>
      </Modal>
    )
  }
}
