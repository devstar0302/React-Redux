import React from 'react'
import moment from 'moment'
import {findIndex} from 'lodash'
import axios from 'axios'

import { ROOT_URL } from 'actions/config'
import { dateFormat, severities } from 'shared/Global'

import FlipView from './FlipView'
import BarChart from './display/BarChart'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'

const sampleData = []

const chartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  elements: {
    line: {
      tension: 0
    }
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: true,
      ticks: {
        min: 0,
        fontColor: '#9e9e9e',
        callback: function(value, index, values) {
          if (Math.floor(value) === value) return value
        }
      },
      gridLines: {
        display: true,
        drawBorder: false
      }
    }]
  }
}

export default class GBarChart extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      loading: true,
      searchRecordCounts: [],
      needRefresh: false
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
  }

  componentWillMount () {
    this.fetchRecordCount(this.props)
  }

  componentWillUpdate (nextProps, nextState) {
    const {gauge, searchList} = nextProps
    const {needRefresh} = nextState
    if (gauge && JSON.stringify(this.props.gauge) !== JSON.stringify(gauge)) {
      this.fetchRecordCount(nextProps)
    } else if (searchList && JSON.stringify(this.props.searchList) !== JSON.stringify(searchList)) {
      this.fetchRecordCount(nextProps)
    } else if (needRefresh && !this.state.needRefresh) {
      this.fetchRecordCount(nextProps)
    }
  }

  getParams () {
    const {gauge, searchList} = this.props
    const {savedSearchId, monitorId, resource, workflowId, workflowIds} = gauge

    if (resource === 'monitor') {
      return {
        query: `monitorid=${monitorId}`
      }
    } else if (resource === 'incident'){
      return {
        query: '',
        workflow: [workflowId, ...workflowIds].join(','),
        collections: 'incident',
        severity: severities.map(p => p.value).join(','),
        tag: '',
        monitorTypes: ''
      }
    } else {
      const index = findIndex(searchList, {id: savedSearchId})
      if (index < 0) {
        console.log('Saved search not found.')
        return null
      }
      const searchParams = JSON.parse(searchList[index].data)

      return searchParams
    }
  }

  fetchRecordCount (props) {
    const {gauge, searchList} = props
    const {savedSearchId, monitorId, resource, duration, durationUnit, splitBy, splitUnit,workflowId} = gauge

    this.setState({
      loading: true
    })

    let inc = 1
    if (durationUnit === 'month' && splitUnit === 'day') inc = 0
    const dateFrom = moment().add(-duration + inc, `${durationUnit}s`)
      .startOf(durationUnit === 'hour' || duration === 1 ? durationUnit : 'day')
    const dateTo = moment().endOf(durationUnit === 'hour' ? durationUnit : 'day')

    if (resource === 'monitor') {
      axios.get(`${ROOT_URL}/event/search/findByDate`, {
        params: {
          dateFrom: dateFrom.valueOf(),
          dateTo: dateTo.valueOf(),
          monitorId,
          sort: 'timestamp'
        }
      }).then(res => {
        this.setState({
          searchRecordCounts: res.data._embedded.events.map(p => ({
            date: moment(p.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            count: p.eventType === 'AGENT' || (p.lastResult && p.lastResult.status === 'UP') ? 1 : 0
          })),
          loading: false,
          needRefresh: false
        })
      }).catch(() => {
        setTimeout(() => {
          this.setState({needRefresh: true})
        }, 2000)
      })
    } else if (resource === 'incident'){
      const searchParams = {
        query: '',
        workflow: workflowId,
        collections: 'incident',
        severity: severities.map(p => p.value).join(','),
        tag: '',
        monitorTypes: ''
      }
      const params = { ...searchParams, splitBy, splitUnit,
        dateFrom: dateFrom.format(dateFormat),
        dateTo: dateTo.format(dateFormat)
      }
      axios.get(`${ROOT_URL}/search/getRecordCount`, {params}).then(res => {
        this.setState({
          searchRecordCounts: res.data,
          loading: false,
          needRefresh: false
        })
      }).catch(() => {
        setTimeout(() => {
          this.setState({needRefresh: true})
        }, 2000)
      })
    } else {
      const index = findIndex(searchList, {id: savedSearchId})
      if (index < 0) {
        console.log('Saved search not found.')
        return
      }
      const searchParams = JSON.parse(searchList[index].data)

      const params = { ...searchParams, splitBy, splitUnit,
        dateFrom: dateFrom.format(dateFormat),
        dateTo: dateTo.format(dateFormat)
      }
      axios.get(`${ROOT_URL}/search/getRecordCount`, {params}).then(res => {
        this.setState({
          searchRecordCounts: res.data,
          loading: false,
          needRefresh: false
        })
      }).catch(() => {
        setTimeout(() => {
          this.setState({needRefresh: true})
        }, 2000)
      })
    }
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

  onClickPoint (e, elements) {
    if (!elements.length) return
    const el = elements[0]

    const record = this.state.searchRecordCounts[el._index]
    if (!record) {
      console.log('Record not found')
      return
    }
    const params = this.getParams()
    if (record.dateFrom) params.dateFrom = record.dateFrom
    if (record.dateTo) params.dateTo = record.dateTo

    setTimeout(() => {
      this.props.history.push('/search')
      this.props.loadSearch(params, this.props.history)
    }, 1)
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  renderFrontView () {
    const {searchRecordCounts} = this.state

    const chartData = {
      labels: (searchRecordCounts || sampleData).map(p => p.date),
      datasets: [{
        data: (searchRecordCounts || sampleData).map(p => p.count),
        borderWidth: 1,
        borderColor: '#0288d1',
        backgroundColor: '#4dd8e9'
      }]
    }

    const options = {
      ...chartOptions,
      onClick: this.onClickPoint.bind(this)
    }

    return (
      <div className="flex-1" style={{overflow: 'hidden'}}>
        <BarChart chartData={chartData} chartOptions={options} />
      </div>
    )
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
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

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}
