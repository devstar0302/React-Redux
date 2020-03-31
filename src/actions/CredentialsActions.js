import axios from 'axios'
import {
  FETCH_CREDENTIALS,
  ADD_CREDENTIALS,
  UPDATE_CREDENTIALS,
  REMOVE_CREDENTIALS,
  OPEN_CREDENTIALS_MODAL,
  CLOSE_CREDENTIALS_MODAL,

  SELECT_CREDS,

  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

export const fetchCredentials = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/credential`)
      .then(response => fetchCredentialsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchCredentialsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_CREDENTIALS,
    data: response.data._embedded.credentials
  })
}

export const addCredentials = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/credential`, props)
      .then(response => addCredentialsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addCredentialsSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_CREDENTIALS,
    data: response.data
  })
  dispatch(closeCredentialsModal())
}

export const updateCredentials = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateCredentialsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateCredentialsSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_CREDENTIALS,
    data: response.data
  })
  dispatch(closeCredentialsModal())
}

export const removeCredentials = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href)
      .then(() => removeCredentialsSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const removeCredentialsSuccess = (dispatch, entity) => {
  dispatch({
    type: REMOVE_CREDENTIALS,
    data: entity
  })
}

export const openCredentialsModal = (entity) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_CREDENTIALS_MODAL,
      data: entity
    })
  }
}

export const closeCredentialsModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_CREDENTIALS_MODAL
    })
  }
}

export const selectCreds = (creds) => {
  return dispatch => {
    dispatch({type: SELECT_CREDS, creds})
  }
}

export const addDeviceCredential = (creds, deviceId) => {
  return dispatch => {
    if (!creds) return
    creds.deviceIds = creds.deviceIds || []
    if (creds.id) {
      dispatch(updateCredentials({
        ...creds,
        deviceIds: [...creds.deviceIds, deviceId]
      }))
    } else {
      dispatch(addCredentials({
        ...creds,
        deviceIds: [...creds.deviceIds, deviceId]
      }))
    }
  }
}
