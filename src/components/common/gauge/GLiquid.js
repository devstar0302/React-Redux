import React from 'react'
// import moment from 'moment'
// import {findIndex} from 'lodash'
// import axios from 'axios'

// import { ROOT_URL } from 'actions/config'
// import { dateFormat } from 'shared/Global'

import FlipView from './FlipView'
import LiquidView from './display/LiquidView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'

export default class GLiquid extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      value: Math.ceil(Math.random() * 100)
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
    return (
      <div className="flex-vertical flex-1">
        <LiquidView value={this.state.value}/>
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

        hideHeader
        style={this.props.style}
        className={this.props.className}
        gauge={this.props.gauge}

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        hideContentPadding

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}
