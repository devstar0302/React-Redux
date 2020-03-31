import React from 'react'
import {IconButton} from 'material-ui'
import {Link} from 'react-router-dom'

import HistoryIcon from 'material-ui/svg-icons/action/history'
import AlarmIcon from 'material-ui/svg-icons/action/alarm'
import BugReportIcon from 'material-ui/svg-icons/action/bug-report'
import FlagIcon from 'material-ui/svg-icons/content/flag'
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app'

import Metric from 'components/common/Metric'

const logoutStyle = {
  position: 'absolute',
  right: 0,
  top: -6
}
const MetricPanelView = ({stats, showOpen, showToday, showAttackers, showMonth,
  attackers}) => (
  <div className="metric-panel">
    <div className="metric-container">
      <Metric icon={<FlagIcon/>} title="Open Incidents" value={stats.open}
        onClick={showOpen}/>
    </div>
    <div className="metric-container">
      <Metric icon={<AlarmIcon/>} title="Today's Incidents" value={stats.today}
        onClick={showToday}/>
    </div>
    <div className="metric-container">
      <Metric icon={<BugReportIcon/>} title="Attackers Today" value={stats.attackers || 0}
        onClick={showAttackers}/>
    </div>
    <div className="metric-container">
      <Metric icon={<HistoryIcon/>} title="Month Incidents" value={stats.month}
        onClick={showMonth}/>
    </div>
    <div style={logoutStyle}>
      <Link to="/signout"><IconButton><ExitIcon/></IconButton></Link>
    </div>
    {attackers}
  </div>
)

export default MetricPanelView
