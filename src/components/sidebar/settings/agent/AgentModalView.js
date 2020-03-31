import React from 'react'
import { Field } from 'redux-form'
import { SubmitBlock, FormInput, Modal, CardPanel } from 'components/modal/parts'

export default class AgentModalView extends React.Component {
  render () {
    const {onHide, onSubmit} = this.props
    return (
      <Modal title="Agent" onRequestClose={onHide} contentStyle={{width: 350}}>
        <form onSubmit={onSubmit}>
          <CardPanel>
            <div className="form-column">
              <Field name="name" component={FormInput} label="Name"/>
              <Field name="version" component={FormInput} label="Version"/>
            </div>
          </CardPanel>
          <SubmitBlock name="Save"/>
        </form>
      </Modal>
    )
  }
}
