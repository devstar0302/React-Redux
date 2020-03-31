import React from 'react'

import FlipView from './FlipView'
import PieChart from './display/PieChart'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'

export default class GAccelView extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  renderFrontView () {
    // const {gauge} = this.props

    return (
      <div className="flex-vertical flex-1">
        <div className="flex-1">
          <PieChart chartData={{labels: ['Count1', 'Count2'], datasets:[{data: [300, 50], backgroundColor:['#FF6384', '#36A2EB']}]}}/>
        </div>
      </div>
    )
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
          hideDuration
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

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}
