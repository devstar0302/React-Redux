import React from 'react'
import { Field } from 'redux-form'
import { findIndex } from 'lodash'
import {FlatButton, SelectField, MenuItem, IconButton} from 'material-ui'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ToggleStar from 'material-ui/svg-icons/toggle/star-border'
import FilledStar from 'material-ui/svg-icons/toggle/star'
import LocalMovie from 'material-ui/svg-icons/maps/local-movies'
import Computer from 'material-ui/svg-icons/hardware/computer'
import NoSim from 'material-ui/svg-icons/communication/no-sim'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import ViewColumnIcon from 'material-ui/svg-icons/action/view-column'
// import {Toolbar} from 'material-ui/Toolbar'

import { FormInput } from 'components/modal/parts'
import DateRangePicker from 'components/common/DateRangePicker'

export default class SearchFormView extends React.Component {
  renderDateLabel (label) {
    return (
      <FlatButton label={label}/>
    )
  }
  severityRenderer (severities, values) {
    if (/*!values.length ||*/ values.length === severities.length) return 'All'
    return values.map(value => {
      const i = findIndex(severities, {value})
      return severities[i].label
    }).join(', ')
  }
  render () {
    const {
      onSearchKeyDown,
      onClickStar,
      starFilled,
      onSubmit,
      onClickWorkflow,

      severities,
      selectedSeverities,
      onChangeSeverity,

      collections,
      selectedCollections,
      onChangeCollection,

      startDate,
      endDate,
      onChangeDateRange,

      onClickIllustrate,
      onClickRelDevices,
      onClickIrrelDevices,

      monitorTemplates,
      selectedMonitorTypes,
      onChangeMonitorType,

      onClickViewFilter,
      onClickGraph,

      onClickTags,

      onClickClear,
      onClickSearch,

      onClickToggleFields,

      searchMonitor,
      onClickSearchMonitor
    } = this.props
    return (
      <form onSubmit={onSubmit}>
        <div style={{background: '#dadada', paddingLeft: 10}}>
          <div className="nowrap flex-horizontal">
            <div className="flex-1">
              <Field name="query" component={FormInput} label="Search" onKeyDown={onSearchKeyDown} style={{width: '100%'}} className="valign-top"/>
            </div>
            <div>
              <IconButton tooltip="Search" onTouchTap={onClickSearch} type="submit" className="valign-top"><ActionSearch /></IconButton>
            </div>
          </div>

          <div>
            <IconButton tooltip="Workflow" tooltipPosition="top-center" onTouchTap={onClickWorkflow} className="valign-top"><img src="/resources/images/sidebar/search/wf-icon.png" width="24" alt=""/></IconButton>
            <IconButton tooltip="Tags" tooltipPosition="top-center" onTouchTap={onClickTags} className="valign-top"><img src="/resources/images/sidebar/search/tag.png" width="24" alt=""/></IconButton>

            <IconButton tooltip="Favorite" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickStar}>{starFilled ? <FilledStar/> : <ToggleStar/>}</IconButton>
            <IconButton tooltip="Illustrate" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickIllustrate}><LocalMovie/></IconButton>
            <IconButton tooltip="Related devices" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickRelDevices}><Computer/></IconButton>
            <IconButton tooltip="Non-related devices" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickIrrelDevices}><NoSim/></IconButton>
            <IconButton tooltip="Views" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickViewFilter}><img src="/resources/images/sidebar/search/view-icon.png" width="24" alt=""/></IconButton>
            <IconButton tooltip="Graph" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickGraph}><img src="/resources/images/sidebar/search/graph-icon.png" width="24" alt=""/></IconButton>

            <IconButton tooltip="Clear" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickClear}><ClearIcon /></IconButton>

            <IconButton tooltip="Toggle Fields" tooltipPosition="top-center" className="valign-top" onTouchTap={onClickToggleFields}><ViewColumnIcon /></IconButton>


            <DateRangePicker
              className="valign-top"
              startDate={startDate}
              endDate={endDate}
              onApply={onChangeDateRange}
              renderer={this.renderDateLabel.bind(this)}
              style={{marginTop: '4px'}}/>
            <SelectField
              multiple
              hintText="Severity"
              value={selectedSeverities}
              onChange={onChangeSeverity}
              className="text-left valign-top"
              selectionRenderer={this.severityRenderer.bind(this, severities)}
            >
              {severities.map(option =>
                <MenuItem
                  key={option.value}
                  insetChildren
                  checked={selectedSeverities && selectedSeverities.includes(option.value)}
                  value={option.value}
                  primaryText={option.label}
                />
              )}
            </SelectField>
            <SelectField
              multiple
              hintText="Collection"
              value={selectedCollections}
              onChange={onChangeCollection}
              style={{width: '180px'}}
            >
              {collections.map(option =>
                <MenuItem
                  key={option.value}
                  insetChildren
                  checked={selectedCollections && selectedCollections.includes(option.value)}
                  value={option.value}
                  primaryText={option.label}
                />
              )}
            </SelectField>
            <SelectField
              menuStyle={{
                width: 220
              }}
              multiple
              hintText="MonitorType"
              value={selectedMonitorTypes}
              onChange={onChangeMonitorType}
              style={{width: '180px', overflow: 'hidden'}}
              className="valign-top"
            >
              {monitorTemplates.map(option =>
                <MenuItem
                  key={option.id}
                  insetChildren
                  checked={selectedMonitorTypes && selectedMonitorTypes.includes(option.monitortype)}
                  value={option.monitortype}
                  primaryText={option.name}
                />
              )}
            </SelectField>

            <FlatButton label={searchMonitor} onTouchTap={onClickSearchMonitor} className="valign-top margin-xs-top"/>
          </div>
        </div>
      </form>
    )
  }
}
