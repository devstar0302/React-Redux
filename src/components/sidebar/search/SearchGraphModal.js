import React from 'react'
import {assign} from 'lodash'

import SearchGraphModalView from './SearchGraphModalView'

const sampleData = [{
  'date': '2017-05-16',
  'count': 156971
}, {
  'date': '2017-05-17',
  'count': 90002
}, {
  'date': '2017-05-18',
  'count': 107455
}, {
  'date': '2017-05-19',
  'count': 499531
}, {
  'date': '2017-05-20',
  'count': 495102
}, {
  'date': '2017-05-21',
  'count': 281301
}, {
  'date': '2017-05-22',
  'count': 99063
}]
export default class SearchGraphModal extends React.Component {
  componentWillMount () {
    const {params, updateGraphParams} = this.props
    updateGraphParams(params, {
      splitBy: 1,
      splitUnit: 'day'
    })
  }
  onClickClose () {
    this.props.showSearchGraphModal(false)
  }
  onClickMax () {
    this.props.maximizeSearchGraph(!this.props.graphMaximized)
  }
  onChangeSplitBy (e) {
    const {params, graphParams, updateGraphParams} = this.props
    updateGraphParams(params, assign({}, graphParams, {
      splitBy: e.target.value
    }))
  }

  onChangeSplitUnit (e) {
    const {params, graphParams, updateGraphParams} = this.props
    updateGraphParams(params, assign({}, graphParams, {
      splitUnit: e.target.value
    }))
  }

  render () {
    const {searchRecordCounts, queryChips, params, graphMaximized, graphParams} = this.props
    const chartData = {
      labels: (searchRecordCounts || sampleData).map(p => p.date),
      datasets: [{
        data: (searchRecordCounts || sampleData).map(p => p.count),
        borderWidth: 1,
        borderColor: '#269C8B',
        fill: false
      }]
    }
    const chartOptions = {
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0
        }
      }
    }
    return (

      <SearchGraphModalView
        params={params}
        queryChips={queryChips}
        loading={!searchRecordCounts}
        chartData={chartData}
        chartOptions={chartOptions}
        onHide={this.onClickClose.bind(this)}

        graphMaximized={graphMaximized}
        onMaximize={this.onClickMax.bind(this)}

        graphParams={graphParams}
        onChangeSplitBy={this.onChangeSplitBy.bind(this)}
        onChangeSplitUnit={this.onChangeSplitUnit.bind(this)}
      />
    )
  }
}
