import React from 'react'
import {Field} from 'redux-form'

import {FormInput, SubmitBlock, Modal, CardPanel} from 'components/modal/parts'

class PatternModalView extends React.Component {
  render () {
    const {onClickClose, onSubmit} = this.props
    return (
      <Modal title="Pattern" onRequestClose={onClickClose}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Pattern">
            <div className="form-column">
              <Field name="text" component={FormInput} type="text" label="Pattern" multiLine/>
            </div>
          </CardPanel>
          <SubmitBlock name="Save"/>
        </form>
      </Modal>
    )
  }
}

export default PatternModalView
