import axios from 'axios'
import { assign, concat } from 'lodash'
import {
  FETCH_MAPS,
  ADD_MAP,
  UPDATE_MAP,
  REMOVE_MAP,
  CHANGE_MAP,
  OPEN_MAP_IMPORT_MODAL,
  CLOSE_MAP_IMPORT_MODAL,
  IMPORT_MAP,
  SHOW_MAP_EXPORT_MODAL,

  OPEN_MAP_USERS_MODAL,
  CLOSE_MAP_USERS_MODAL,
  FETCH_MAP_USERS,
  ADD_MAP_USER,
  REMOVE_MAP_USER,

  ADD_MAP_DEVICE,
  UPDATE_MAP_DEVICE,
  DELETE_MAP_DEVICE,

  ADD_MAP_LINE,
  UPDATE_MAP_LINE,
  DELETE_MAP_LINE,

  FETCH_MAP_DEVICES_LINES,

  RELOAD_DEVICE,

  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'
import {encodeUrlParams} from 'shared/Global'

import {addDeviceCredential} from './CredentialsActions'

export const fetchMaps = (initial) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/map`)
      .then(response => fetchMapsSuccess(dispatch, response, initial))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchMapsSuccess = (dispatch, response, initial) => {
  const maps = response.data._embedded.maps
  dispatch({
    type: FETCH_MAPS,
    data: maps
  })
  if (initial && maps.length) {
    dispatch(changeMap(maps[0]))
  }
}

export const changeMap = (map) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_MAP,
      map
    })
    dispatch(fetchMapDevicesAndLines(map.id))
  }
}

export const addMap = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/map`, props)
      .then(response => addMapSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addMapSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_MAP,
    data: response.data
  })
  dispatch(changeMap(response.data))
}

export const updateMap = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateMapSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateMapSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_MAP,
    data: response.data
  })
}

export const deleteMap = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href)
      .then(() => deleteMapSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteMapSuccess = (dispatch, entity) => {
  dispatch(fetchMaps(true))
  dispatch({
    type: REMOVE_MAP, // TODO: check this action later
    data: entity
  })
}

export const openMapImportModal = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_MAP_IMPORT_MODAL
    })
  }
}

export const closeMapImportModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MAP_IMPORT_MODAL
    })
  }
}

export const importMap = (form) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/importmap`, form)
      .then(response => importMapSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const importMapSuccess = (dispatch, response) => {
  if (!response.data) return
  dispatch({
    type: IMPORT_MAP,
    data: response.data
  })
  dispatch(closeMapImportModal())
}

export const openMapUsersModal = (map) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_MAP_USERS_MODAL,
      data: map
    })
    dispatch(fetchMapUsers(map.id))
  }
}

export const closeMapUsersModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MAP_USERS_MODAL
    })
  }
}

export const fetchMapUsers = (mapId) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/user/search/findByMap?mapid=${mapId}`)
      .then(response => fetchMapUsersSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchMapUsersSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_MAP_USERS,
    data: response.data._embedded.users
  })
}

export const addMapUser = (map, user) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    const entity = assign({}, user)
    entity.mapids = concat(entity.mapids || [], map.id)

    axios.put(entity._links.self.href, entity)
      .then(response => addMapUserSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addMapUserSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_MAP_USER,
    data: response.data
  })
}

export const removeMapUser = (map, user) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    const entity = assign({mapids: []}, user)
    entity.mapids = (entity.mapids || []).filter(u => u !== map.id)

    axios.put(entity._links.self.href, entity)
      .then(() => removeMapUserSuccess(dispatch, user))
      .catch(error => apiError(dispatch, error))
  }
}

const removeMapUserSuccess = (dispatch, user) => {
  dispatch({
    type: REMOVE_MAP_USER,
    data: user
  })
}

export const fetchMapDevicesAndLines = (mapid) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    if (!mapid) {
      fetchMapId(dispatch)
      return
    }

    const req1 = axios.get(`${ROOT_URL}/device/search/findDevicesByMapid`, {params: {mapid}})
      .then(response => fetchDevicesByMapid(response))

    const req2 = axios.get(`${ROOT_URL}/device/search/findLinesByMapid`, {params: {mapid}})
      .then(response => fetchLinesByMapid(response))

    const req3 = axios.get(`${ROOT_URL}/group/search/findByMapid`, {params: {mapid}})
      .then(response => fetchGroupsByMapid(response))

    axios.all([req1, req2, req3])
      .then(response => fetchMapDevicesAndLinesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchMapId = (dispatch) => {
  dispatch({
    type: FETCH_MAP_DEVICES_LINES,
    maps: [],
    lines: []
  })
}

const fetchDevicesByMapid = (response) => {
  return response.data._embedded.devices
}

const fetchLinesByMapid = (response) => {
  return response.data._embedded.devices
}

const fetchGroupsByMapid = (response) => {
  return response.data._embedded.groups
}

const fetchMapDevicesAndLinesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_MAP_DEVICES_LINES,
    maps: concat([], response[0], response[2]),
    lines: response[1]
  })
}

const fetchWorkflowIds = (uuids, cb) => {
  if (!uuids || !uuids.length) {
    cb && cb([])
    return
  }
  axios.get(`${ROOT_URL}/workflow/search/findByUuidIn?size=1000&sort=name&${encodeUrlParams({uuid: uuids})}`).then(res => {
    cb(res.data._embedded.workflows.map(u => u.id))
  })
}

export const addMapDevice = (props, url) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    fetchWorkflowIds(props.workflowids, workflowids => {
      axios.post(`${ROOT_URL}${url || '/device'}`, assign({}, props, {workflowids})).then(response => {
        addMapDeviceSuccess(dispatch, response)
        dispatch(addDeviceCredential(props.credential, response.data.id))
      }).catch(error => apiError(dispatch, error))
    })
  }
}

const addMapDeviceSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_MAP_DEVICE,
    data: response.data
  })
}

export const updateMapDevice = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateMapDeviceSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateMapDeviceSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_MAP_DEVICE,
    data: response.data
  })
}

export const deleteMapDevice = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href)
      .then(() => deleteMapDeviceSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteMapDeviceSuccess = (dispatch, entity) => {
  dispatch({
    type: DELETE_MAP_DEVICE,
    data: entity
  })
}

export const addMapLine = (props, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/device`, props)
      .then(response => addMapLineSuccess(dispatch, response, cb))
      .catch(error => apiError(dispatch, error))
  }
}

const addMapLineSuccess = (dispatch, response, cb) => {
  dispatch({
    type: ADD_MAP_LINE,
    data: response.data
  })
  cb && cb(response.data)
}

export const updateMapLine = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateMapLineSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateMapLineSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_MAP_LINE,
    data: response.data
  })
}

export const deleteMapLine = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href)
      .then(() => deleteMapLineSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteMapLineSuccess = (dispatch, entity) => {
  dispatch({
    type: DELETE_MAP_LINE,
    data: entity
  })
}

export function reloadDevice (device) {
  return (dispatch) => {
    dispatch({
      type: RELOAD_DEVICE,
      data: device
    })
  }
}

export function showMapExportModal (visible) {
  return dispatch => {
    dispatch({type: SHOW_MAP_EXPORT_MODAL, visible})
  }
}
