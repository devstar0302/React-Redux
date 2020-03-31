import React from 'react'
import {Field} from 'redux-form'

import {Modal, FormInput, SubmitBlock, CardPanel} from 'components/modal/parts'

export default class TagModalView extends React.Component {
  render () {
    const {onClickClose, onSubmit} = this.props
    return (
      <Modal title="Tag" onRequestClose={onClickClose}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Tag">
              <Field name="name" component={FormInput} type="text" floatingLabel="Name" className="mr-dialog"/>
              <Field name="desc" component={FormInput} type="text" floatingLabel="Description"/>
              <Field name="order" component={FormInput} type="text" floatingLabel="Order"/>
          </CardPanel>
          <SubmitBlock name="Save" onClick={onClickClose}/>
        </form>
      </Modal>
    )
  }
}
