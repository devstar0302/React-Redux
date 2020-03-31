import React from 'react'
import { Form, Field } from 'redux-form'
import {FlatButton, IconButton} from 'material-ui'
import ActionSearch from 'material-ui/svg-icons/action/search'

import { FormInput } from 'components/modal/parts'
import DateRangePicker from 'components/common/DateRangePicker'

export default class LogSearchFormView extends React.Component {
  renderDateLabel (label) {
    return (
      <FlatButton label={label}/>
    )
  }
  render () {
    const {
      onSearchKeyDown,
      onSubmit,

      startDate,
      endDate,
      onChangeDateRange
    } = this.props
    return (
      <Form onSubmit={onSubmit}>
        <div style={{background: '#dadada', paddingLeft: 10}}>
          <div className="nowrap">
            <Field name="query" component={FormInput} label="Search" onKeyDown={onSearchKeyDown} style={{minWidth: 200}} className="valign-top"/>
            <IconButton tooltip="Search" type="submit" className="valign-top"><ActionSearch /></IconButton>
            <DateRangePicker
              className="valign-top"
              startDate={startDate}
              endDate={endDate}
              onApply={onChangeDateRange}
              renderer={this.renderDateLabel.bind(this)}
              style={{marginTop: '4px'}}/>
          </div>
        </div>
      </Form>
    )
  }
}
