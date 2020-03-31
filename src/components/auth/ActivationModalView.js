import React from 'react'
import { Field } from 'redux-form'
import { FormInput, SubmitSingle, Modal, CardPanel } from 'components/modal/parts'

const ActivationModalView = ({onHide, onSignup}) => (
  <Modal title="License Activation">
      <form onSubmit={onSignup}>
        <CardPanel>
          <div className="form-column">
            <Field name="email" component={FormInput} autoComplete="off" label="Email"/>
            <Field name="license" component={FormInput} autoComplete="off" label="License"/>
          </div>
        </CardPanel>
        <SubmitSingle name="Activate"/>
      </form>
  </Modal>
)

export default ActivationModalView
