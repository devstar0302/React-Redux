import React, { Component } from 'react'
import moment from 'moment'
import { debounce, findIndex } from 'lodash'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Switch } from 'react-router-dom'

import Main from 'components/Main'
import IncidentSocket from 'util/socket/IncidentSocket'

import MainDashboardContainer from 'containers/dashboard/MainDashboardContainer'
import SearchGeneric from 'containers/search/GenericSearchContainer'
import ChatContainer from 'containers/chat/ChatContainer'
import ThreatMapContainer from 'containers/threatmap/ThreatMapContainer'
import SignoutContainer from 'containers/auth/SignoutContainer'
import Settings from 'components/sidebar/settings/Settings'
import DeviceContainer from 'containers/device/DeviceContainer'
import LogView from 'containers/dashboard/LogViewContainer'

import {
  closeDevice,
  closeApiErrorModal,

  fetchEnvVars,
  activateUser,
  openActivationModal,
  closeActivationModal,

  updateDashboardStats,
  fetchIncidents,
  addDashboardIncident,
  updateNewIncidentMsg,
  updateMapDeviceStatus,
  updateDashboardMapDevices,

  fetchUserInfo,

  updateSearchParams,
  updateQueryChips,

  updateBigIncidentParams,
  fetchBigIncidents,

  fixIncident,
  ackIncident,

  fetchDeviceCategories,
  fetchDeviceTemplates,

  openDevice,
  addMapDevice,
  deleteMapDevice,
  updateMapDevice,
  addMapLine,
  deleteMapLine,
  updateMapLine,

  importMap,
  openMapImportModal,
  closeMapImportModal,
  showMapExportModal,

  addMap,
  updateMap,
  deleteMap,

  fetchMaps,
  changeMap,

  fetchAttackers,

  updateDashboard,
  requireFullScreen,

  openIncidentEventsModal,
  closeIncidentEventsModal,

  openDashboardNewIncidentModal,
  closeDashboardNewIncidentModal,

  showSidebarMessageMenu,

  fetchDashboardStats,
  updateDeviceIncident,
  showCommentsModal,

  showAttackerModal
} from 'actions'

class MainpageContainer extends Component {
  componentWillMount () {
    this.props.fetchUserInfo()

    this.deviceBuffer = []
    this.fnProcessBuffer = debounce(this.processBuffer.bind(this), 1000)
  }

  componentDidMount () {
    this.incidentSocket = new IncidentSocket({
      listeners: {
        'incidents': this.onReceiveIncidents.bind(this),
        'statuses': debounce(this.onReceiveStatus.bind(this), 500),
        'dashboard': this.onReceiveDashboard.bind(this),
        'refreshpage': this.onReceiveRefresh.bind(this),
        'updatedDevice': this.onDeviceUpdated.bind(this)
      }
    })
    this.incidentSocket.connect()
    this.clearNewincidentMsg = debounce(() => this.props.updateNewIncidentMsg(null), 8000)

    const { history } = this.props
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
  }

  componentWillUpdate (nextProps) {
    const {userInfo} = nextProps
    const oldInfo = this.props.userInfo
    if (oldInfo && oldInfo.keepIncidentAlert && userInfo && !userInfo.keepIncidentAlert) {
      this.props.updateNewIncidentMsg(null)
    }
  }

  componentWillUnmount () {
    this.incidentSocket.close()
    this.unsubscribeFromHistory()
  }

  processBuffer () {
    this.props.updateDashboardMapDevices(this.deviceBuffer)
    this.deviceBuffer = []
  }

  handleLocationChange (location) {
    if (location.pathname === '/') {
      setTimeout(() => {
        window.dispatchEvent(new window.Event('resize'))
      }, 100)
    }
  }

  onReceiveIncidents (msg) {
    // console.log(msg)
    if (msg && msg.length && (msg[0].severity === 'HIGH' || msg[0].severity === 'MEDIUM')) {
      this.props.addDashboardIncident(msg)
    }
  }

  onReceiveStatus (msg) {
    if (window && window.debugSocket) console.log(msg)
    this.props.updateMapDeviceStatus(msg)
  }

  onReceiveDashboard (msg) {
    // console.log(msg)
    this.props.updateDashboardStats({
      open: msg.openincidents || 0,
      today: msg.todayincidents || 0,
      month: msg.monthincidents || 0,
      attackers: msg.attackers || 0
    })

    const incident = msg.latestincident || {}

    const {lastIncidentMsg} = this.props
    if (lastIncidentMsg && lastIncidentMsg.incident.id === incident.id) return

    const device = incident.devicename
    const time = moment(incident.startTimestamp || new Date()).format('HH:mm:ss')
    this.props.updateNewIncidentMsg({
      message: `${time} - ${device} - ${incident.description || ''}`,
      incident
    })

    const {userInfo} = this.props
    const keep = userInfo && userInfo.keepIncidentAlert
    if (!keep) this.clearNewincidentMsg()
  }

  onDeviceUpdated (msg) {
    // console.log(msg)
    const index = findIndex(this.deviceBuffer, {id: msg.id})
    if (index < 0) this.deviceBuffer.push(msg)
    else this.deviceBuffer[index] = msg
    this.fnProcessBuffer()
  }

  onReceiveRefresh () {
    document.location.reload(true)
  }

  render () {
    return (
      <Main {...this.props}>
        <Switch>
          <Route path="/dashboard" component={MainDashboardContainer} exact/>
          <Route path="/dashboard/:id" component={MainDashboardContainer} />
        </Switch>
        <Route path="/chat" component={ChatContainer}/>
        <Route path="/search" component={SearchGeneric}/>
        <Route path="/threatmap" component={ThreatMapContainer}/>
        <Route path="/signout" component={SignoutContainer} />
        <Route path="/settings" component={Settings}/>
        <Route path="/viewlog" component={LogView}/>

        <Route path="/device/:deviceId" component={DeviceContainer}/>
      </Main>
    )
  }
}

export default connect((state) => {
  return {
    device: state.dashboard.selectedDevice,
    apiErrorModalOpen: state.dashboard.apiErrorModalOpen,
    apiError: state.dashboard.apiError,

    newIncidentMsg: state.dashboard.newIncidentMsg,
    lastIncidentMsg: state.dashboard.lastIncidentMsg,

    activationModalOpen: state.auth.activationModalOpen,
    activationMsg: state.auth.activationMsg,
    envVarAvailable: state.settings.envVarAvailable,
    envVars: state.settings.envVars,

    searchParams: state.search.params,

    userInfo: state.dashboard.userInfo,

    // bigIncidents: state.dashboard.bigIncidents,
    // incidents: state.dashboard.incidents,
    bigIncidentParams: state.dashboard.bigIncidentParams,

    bigIncidents: state.dashboard.bigIncidents,
    incidents: state.dashboard.incidents,

    deviceCategories: state.settings.deviceCategories,
    deviceTemplates: state.settings.deviceTemplates,

    mapDevices: state.dashboard.mapDevices,
    mapLines: state.dashboard.mapLines,
    selectedMap: state.dashboard.selectedMap,
    showTraffic: state.settings.showTraffic,

    newIncidentModalOpen: state.dashboard.newIncidentModalOpen,

    isFullScreen: state.dashboard.isFullScreen,

    maps: state.dashboard.maps,
    mapImportModalVisible: state.dashboard.mapImportModalVisible,
    mapExportModalOpen: state.dashboard.mapExportModalOpen,

    countries: [],

    incidentEventsModalOpen: state.dashboard.incidentEventsModalOpen,
    selectedIncident: state.dashboard.selectedIncident,

    stats: state.dashboard.stats,

    sidebarProfileMenuOpen: state.dashboard.sidebarProfileMenuOpen,
    sidebarMessageMenuOpen: state.dashboard.sidebarMessageMenuOpen,

    mainIncidentDraw: state.dashboard.mainIncidentDraw,

    attackers: state.attackers.attackers,

    commentsModalVisible: state.dashboard.commentsModalVisible,
    commentsIncident: state.dashboard.commentsIncident,

    attackerModalOpen: state.dashboard.attackerModalOpen
  }
},
dispatch => bindActionCreators({
  closeDevice,
  closeApiErrorModal,

  fetchEnvVars,
  activateUser,
  openActivationModal,
  closeActivationModal,

  updateDashboardStats,
  fetchIncidents,
  addDashboardIncident,
  updateNewIncidentMsg,
  updateMapDeviceStatus,
  updateDashboardMapDevices,

  fetchUserInfo,

  updateSearchParams,
  updateQueryChips,

  updateBigIncidentParams,
  fetchBigIncidents,

  fixIncident,
  ackIncident,

  fetchDeviceCategories,
  fetchDeviceTemplates,

  openDevice,
  addMapDevice,
  deleteMapDevice,
  updateMapDevice,
  addMapLine,
  deleteMapLine,
  updateMapLine,

  importMap,
  openMapImportModal,
  closeMapImportModal,
  showMapExportModal,

  addMap,
  updateMap,
  deleteMap,

  fetchMaps,
  changeMap,

  fetchAttackers,

  updateDashboard,
  requireFullScreen,

  openIncidentEventsModal,
  closeIncidentEventsModal,

  openDashboardNewIncidentModal,
  closeDashboardNewIncidentModal,

  showSidebarMessageMenu,

  fetchDashboardStats,
  updateDeviceIncident,
  showCommentsModal,

  showAttackerModal
}, dispatch))(withRouter(MainpageContainer))
