import React from 'react'
import moment from 'moment'

export default class StatusImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hovered: false
    }
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }
  onMouseEnter () {
    this.setState({ hovered: true })
  }
  onMouseLeave () {
    this.setState({ hovered: false })
  }
  renderHoverLabel () {
    const {monitorsUpdateTime} = this.props
    if (!this.state.hovered || !monitorsUpdateTime) return null
    return (
      <div className="__react_component_tooltip show place-right type-dark" style={{position: 'absolute', top: -10, left: 25}}>
        <span className="valign-middle nowrap">Last Updated {moment(monitorsUpdateTime).fromNow()}</span>
      </div>
    )
  }
  render () {
    const {monitorsUpdateTime} = this.props
    const img = monitorsUpdateTime ? 'green_light.png' : 'yellow_light.png'
    return (
      <div className="inline-block" style={{position: 'relative'}}>
        <img alt="" src={`/resources/images/dashboard/map/device/monitors/${img}`} width="16" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
          style={{verticalAlign: 'top', marginTop: -1, marginLeft: 5}}/>
        {this.renderHoverLabel()}
      </div>
    )
  }
}
