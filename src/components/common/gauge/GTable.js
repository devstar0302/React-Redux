import React from 'react'
import moment from 'moment'
import {findIndex} from 'lodash'
import {IconButton} from 'material-ui'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

import FlipView from './FlipView'
import NormalTable from './display/NormalTable'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'
import { dateFormat, severities, viewFilters } from 'shared/Global'

export default class GTable extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      value: parseInt(Math.random() * 100, 10),
      draw: 1,
      hover: false
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  onSubmit (options, values) {
    console.log(values)

    if (!values.name) {
      showAlert('Please type name.')
      return
    }
    const gauge = {
      ...this.props.gauge,
      ...values
    }

    this.props.updateDeviceGauge(gauge, this.props.device)
    options.onClickFlip()
  }

  onClickDelete () {
    this.props.removeDeviceGauge(this.props.gauge, this.props.device)
  }

  getSearchData () {
    const {searchList, gauge} = this.props
    const {resource, duration, durationUnit, workflowId, workflowIds, savedSearchId} = gauge

    const dateFrom = moment().add(-duration, `${durationUnit}s`).startOf(durationUnit).format(dateFormat)
    const dateTo = moment().endOf(durationUnit).format(dateFormat)

    if (resource === 'incident')  {
      const searchParams = {
        draw: this.state.draw,
        query: '',
        workflow: [workflowId, ...workflowIds].join(','),
        collections: 'incident,event',
        dateFrom,
        dateTo,
        severity: severities.map(p => p.value).join(','),
        tag: '',
        monitorTypes: ''
      }
      return {
        searchParams
      }
    }

    const index = findIndex(searchList, {id: savedSearchId})
    if (index < 0) {
      console.log('Saved search not found.')
      return {
        searchParams: {
          draw: this.state.draw,
          dateFrom,
          dateTo,
          query: '',
          workflow: '',
          collections: 'incident',
          severity: 'HIGH,MEDIUM,LOW,AUDIT',
          tag: '',
          monitorTypes: ''
        }
      }
    }
    const savedSearch = searchList[index]
    const searchParams = JSON.parse(savedSearch.data)

    return {
      searchParams: {
        ...searchParams,
        draw: this.state.draw,
        dateFrom,
        dateTo
      },
      viewFilter: savedSearch.viewFilter,
      viewCols: savedSearch.viewCols,
      viewMode: gauge.tableViewMode
    }
  }

  onClickRefresh () {
    this.setState({
      draw: this.state.draw + 1
    })
  }

  onMouseEnter () {
    this.setState({hover: true})
  }

  onMouseOut () {
    this.setState({hover: false})
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderRefresh (data) {
    const {hover} = this.state
    if (data.viewFilter !== viewFilters.log.name || !hover) return null

    return (
      <div style={{zIndex: 3}}>
        <div style={{position: 'absolute', right: 10, top: 4}}>
          <IconButton onTouchTap={this.onClickRefresh.bind(this)}>
            <RefreshIcon size={32}/>
          </IconButton>
        </div>
      </div>
    )
  }
  renderFrontView () {
    const data = this.getSearchData()

    return (
      <div className="flex-vertical flex-1" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseOut}>
        {this.renderRefresh(data)}
        <NormalTable
          {...this.props}
          params={data.searchParams}
          viewFilter={data.viewFilter || ''}
          viewCols={data.viewCols || []}
          viewMode={data.viewMode || 'json'}
        />
      </div>
    )
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
          hideSplit
        />
      </div>
    )
  }
  render () {
    return (
      <FlipView
        {...this.props}

        style={this.props.style}
        className={this.props.className}
        gauge={this.props.gauge}

        paperStyle={{}}

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}
