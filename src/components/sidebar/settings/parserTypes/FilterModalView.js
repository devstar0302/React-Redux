import React from 'react'
import {Field} from 'redux-form'

import {FormInput, SubmitBlock, Modal, CardPanel} from 'components/modal/parts'

class FilterModalView extends React.Component {
  render () {
    const {onClickClose, onSubmit} = this.props
    return (
      <Modal title="Filter" onRequestClose={onClickClose}>
        <form onSubmit={onSubmit}>
          <CardPanel>
            <div className="form-column">
              <Field name="text" component={FormInput} type="text" label="Filter"/>
            </div>
          </CardPanel>
          <SubmitBlock name="Save" onClick={onClickClose}/>
        </form>
      </Modal>
    )
  }
}

export default FilterModalView
