import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import FilterModalView from './FilterModalView'

class FilterModal extends React.Component {
  onSubmit (props) {
    const {onSave} = this.props
    onSave && onSave(props.text)
  }

  render () {
    const {handleSubmit, onClose} = this.props
    return (
      <FilterModalView
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        onClickClose={onClose}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: {text: state.settings.editFilter >= 0 ? state.settings.editParserType.filterChips[state.settings.editFilter] : ''}
  })
)(reduxForm({form: 'filterForm'})(FilterModal))
