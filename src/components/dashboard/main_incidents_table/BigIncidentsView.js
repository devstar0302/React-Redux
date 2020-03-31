import React from 'react'
import moment from 'moment'
import {FlatButton, MenuItem, SelectField, TextField} from 'material-ui'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ReactTooltip from 'react-tooltip'

import DateRangePicker from 'components/common/DateRangePicker'
import {
  errorStyle, underlineFocusStyle, inputStyle, selectedItemStyle, underlineStyle
} from 'style/common/materialStyles'

import {severities} from 'shared/Global'

const BigIncidentsView = ({onHide,
  selectedSeverity, onChangeSeverity,
  startDate, endDate, onChangeDateRange,
  fixedStatus, onChangeFixedStatus,
  keyword, onChangeKeyword,
  table, eventsModal}) => (
  <div className="flex-vertical flex-1" style={{background: 'white'}}>
    <div className="padding-md-left">
      <span style={{fontSize: '22px'}}><b>Incidents</b></span>
      <FlatButton label="Close" onTouchTap={onHide} className="pull-right hidden"/>
    </div>
    <div className="form-inline padding-md-left">
      <SelectField
        errorStyle={errorStyle}
        underlineStyle={underlineFocusStyle}
        selectedMenuItemStyle={selectedItemStyle}
        menuItemStyle={inputStyle}
        labelStyle={inputStyle}
        multiple
        hintText="Select severities"
        onChange={onChangeSeverity}
        value={selectedSeverity}
        style={{width: '160px'}}
        className="valign-top"
      >
        {severities.map(option =>
          <MenuItem
            key={option.value}
            insetChildren
            checked={selectedSeverity && selectedSeverity.includes(option.value)}
            value={option.value}
            primaryText={option.label}
          />
        )}
      </SelectField>

      <SelectField
        onChange={onChangeFixedStatus}
        value={fixedStatus || ''}
        className="margin-md-left valign-top"
        errorStyle={errorStyle}
        underlineStyle={underlineFocusStyle}
        selectedMenuItemStyle={selectedItemStyle}
        menuItemStyle={inputStyle}
        labelStyle={inputStyle}
        style={{width: '120px'}}>
        <MenuItem primaryText="Any" value=""/>
        <MenuItem primaryText="Unfixed" value="false"/>
        <MenuItem primaryText="Fixed" value="true"/>
      </SelectField>
        <DateRangePicker
          startDate={moment(startDate)}
          endDate={moment(endDate)}
          onApply={onChangeDateRange}
          renderer={label =>
            <FlatButton
              label={label} className="valign-top margin-md-left"
              style={{borderBottom: '1px solid lightgray', marginTop: 4}}/>
          }
        />

      <TextField
        hintText={<ActionSearch style={{bottom: '5px'}} color="#888888"/>}
        errorStyle={errorStyle}
        inputStyle={inputStyle}
        underlineFocusStyle={underlineStyle}
        onChange={onChangeKeyword}
        value={keyword}
        className="valign-top margin-md-left"
      />
    </div>
    <div className="flex-1 flex-vertical">
      {table}
      {eventsModal}
    </div>
    <ReactTooltip/>
  </div>
)

export default BigIncidentsView
