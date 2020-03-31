import React from 'react'
import MetricPanelView from './MetricPanelView'
import AttackersModal from './AttackersModal'

export default class MetricPanel extends React.Component {
  showOpenIncidentsDiv () {
    this.showIncidentSearch('open')
  }

  showTodayIncidentsDiv () {
    this.showIncidentSearch('today')
  }

  showIpIncidentsDiv () {
    this.props.showAttackerModal(true)
  }

  showMonthIncidentsDiv () {
    this.showIncidentSearch('month')
  }

  showIncidentSearch (filterType) {
    const {history} = this.props
    history.push({
      pathname: '/search',
      state: {
        filterType
      }
    })
  }

  renderAttackers () {
    if (!this.props.attackerModalOpen) return
    return (
      <AttackersModal {...this.props} onClose={() => this.props.showAttackerModal(false)} />
    )
  }

  render () {
    return (
      <MetricPanelView
        stats={this.props.stats}
        showOpen={this.showOpenIncidentsDiv.bind(this)}
        showToday={this.showTodayIncidentsDiv.bind(this)}
        showAttackers={this.showIpIncidentsDiv.bind(this)}
        showMonth={this.showMonthIncidentsDiv.bind(this)}
        attackers={this.renderAttackers()}
      />
    )
  }
}
