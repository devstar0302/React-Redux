import axios from 'axios'
import {
  UPDATE_DASHBOARD,

  FETCH_DASHBOARD_INCIDENTS,
  ADD_DASHBOARD_INCIDENT,
  FETCH_DASHBOARD_BIGINCIDENTS,
  UPDATE_BIGINCIDENTS_PARAMS,

  CLOSE_API_ERROR_MODAL,

  REQUIRE_FULLSCREEN,

  OPEN_DASHBOARD_NEW_INCIDENT_MODAL,
  CLOSE_DASHBOARD_NEW_INCIDENT_MODAL,

  FIX_ALL_INCIDENTS_BY_TYPE,

  OPEN_INCIDENT_EVENTS_MODAL,
  CLOSE_INCIDENT_EVENTS_MODAL,

  UPDATE_DASHBOARD_STATS,
  UPDATE_NEW_INCIDENT_MSG,

  UPDATE_MAP_DEVICE_STATUS,
  UPDATE_MAP_DEVICES,

  SHOW_SIDEBAR_MESSAGE_MENU,

  SHOW_THREAT_ITEM_MODAL,
  UPDATE_SIDEBAR_SEARCH_ACTIVE,

  SHOW_COMMENTS_MODAL,
  SHOW_ATTACKER_MODAL,

  UPDATE_VIEWLOG_PARAMS,
  SHOW_DETAIL_LOG_MODAL,

  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

import { encodeUrlParams } from 'shared/Global'

export const updateDashboard = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_DASHBOARD,
      data
    })
  }
}

export const fetchIncidents = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/incident/search/findBySeverity?severity=HIGH&severity=MEDIUM&sort=startTimestamp,desc`, {params: {}})
      .then(response => fetchIncidentsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchIncidentsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DASHBOARD_INCIDENTS,
    data: response.data._embedded.incidents
  })
}

export const addDashboardIncident = incident => {
  return dispatch => {
    dispatch({type: ADD_DASHBOARD_INCIDENT, incident})
  }
}

export const fetchBigIncidents = (params) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/incident/search/findBy?${encodeUrlParams(params)}`)
      .then(response => fetchBigIncidentsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchBigIncidentsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DASHBOARD_BIGINCIDENTS,
    data: response.data._embedded.incidents
  })
}

export const updateBigIncidentParams = (params) => {
  return dispatch => {
    dispatch({type: UPDATE_BIGINCIDENTS_PARAMS, params})
    // dispatch(fetchBigIncidents(params))
  }
}

export const closeApiErrorModal = () => {
  return dispatch => {
    dispatch({
      type: CLOSE_API_ERROR_MODAL
    })
  }
}

export function requireFullScreen (enabled) {
  return dispatch => {
    dispatch({
      type: REQUIRE_FULLSCREEN,
      enabled
    })
  }
}

export const openDashboardNewIncidentModal = () => {
  return dispatch => {
    dispatch({
      type: OPEN_DASHBOARD_NEW_INCIDENT_MODAL
    })
  }
}

export const closeDashboardNewIncidentModal = () => {
  return dispatach => {
    dispatach({
      type: CLOSE_DASHBOARD_NEW_INCIDENT_MODAL
    })
  }
}

export function fixAllIncidentsByType (type) {
  return dispatch => {
    axios.get(`${ROOT_URL}/incident/fixall/${type}/deviceid`).then(res => {
      dispatch({ type: FIX_ALL_INCIDENTS_BY_TYPE })
    }).catch(error => apiError(dispatch, error))
  }
}

export function openIncidentEventsModal (incident) {
  return dispatch => {
    dispatch({type: OPEN_INCIDENT_EVENTS_MODAL, incident})
  }
}

export function closeIncidentEventsModal () {
  return dispatch => {
    dispatch({type: CLOSE_INCIDENT_EVENTS_MODAL})
  }
}

export function fetchDashboardStats () {
  return dispatch => {
    axios.get(`${ROOT_URL}/incident/dashboardinfo`).then(({data}) => {
      dispatch(updateDashboardStats({
        open: data.openincidents || 0,
        today: data.todayincidents || 0,
        month: data.monthincidents || 0
      }))
    }).catch(error => apiError(dispatch, error))
  }
}

export function updateDashboardStats (stats) {
  return dispatch => {
    dispatch({type: UPDATE_DASHBOARD_STATS, stats})
  }
}

export function updateNewIncidentMsg (msg) {
  return dispatch => {
    dispatch({type: UPDATE_NEW_INCIDENT_MSG, msg})
  }
}

export function updateMapDeviceStatus (data) {
  return dispatch => {
    dispatch({type: UPDATE_MAP_DEVICE_STATUS, data})
  }
}

export function updateDashboardMapDevices (data) {
  return dispatch => {
    dispatch({type: UPDATE_MAP_DEVICES, data})
  }
}

export function showSidebarMessageMenu (open) {
  return dispatch => {
    dispatch({type: SHOW_SIDEBAR_MESSAGE_MENU, open})
  }
}

export function showThreats (params) {
  return dispatch => {
    axios.get(`${ROOT_URL}/search/showThreats`, {params})
  }
}

export function showThreatItemModal (visible, threatItem) {
  return dispatch => {
    dispatch({type: SHOW_THREAT_ITEM_MODAL, visible, threatItem})
  }
}

export function updateSidebarSearchActive (active) {
  return dispatch => {
    dispatch({type: UPDATE_SIDEBAR_SEARCH_ACTIVE, active})
  }
}

export function showCommentsModal (visible, incident) {
  return dispatch => {
    dispatch({type: SHOW_COMMENTS_MODAL, visible, incident})
  }
}

export function showAttackerModal (visible) {
  return dispatch => {
    dispatch({type: SHOW_ATTACKER_MODAL, visible})
  }
}

///////////////////////////////////////////////////////////////////////////////////

export const updateViewLogParams = (params, history) => {
  return function (dispatch) {
    dispatch({
      type: UPDATE_VIEWLOG_PARAMS,
      params
    })
    history.replace({
      pathname: '/viewlog',
      search: `?q=${encodeURIComponent(JSON.stringify(params))}`
    })
  }
}

export const showDetailLogModal = (visible, params) => {
  return dispatch => {
    dispatch({type: SHOW_DETAIL_LOG_MODAL, visible, params})
  }
}
