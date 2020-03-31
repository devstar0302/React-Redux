import React from 'react'

import MetricPanel from './top_metric/MetricPanel'
import Map from './map/Map'
import MainIncidentPanel from './incidents/MainIncidentPanel'

export default class Dashboard extends React.Component {
  componentWillMount () {
    this.props.fetchDashboardStats()
  }

  isHidden () {
    const {pathname, search} = this.props.location
    return (pathname !== '/' || !!search)
  }
  render () {
    const hidden = this.isHidden()
    return (
      <div className={`flex-vertical flex-1 ${hidden ? 'hidden' : ''}`} hidden={hidden}>
        <MetricPanel {...this.props}/>
        <Map {...this.props} hidden={hidden}/>
        <MainIncidentPanel {...this.props} hidden={hidden}/>
      </div>
    )
  }
}
