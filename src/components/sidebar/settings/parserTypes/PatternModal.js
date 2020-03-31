import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import PatternModalView from './PatternModalView'

class PatternModal extends React.Component {
  onSubmit (props) {
    const {onSave} = this.props
    onSave && onSave(props.text)
  }

  render () {
    const {handleSubmit, onClose} = this.props
    return (
      <PatternModalView
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        onClickClose={onClose}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: {text: state.settings.editPattern >= 0 ? state.settings.editParserType.patterns[state.settings.editPattern] : ''}
  })
)(reduxForm({form: 'patternForm'})(PatternModal))
