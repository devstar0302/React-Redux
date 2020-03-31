import axios from 'axios'
import {
  FETCH_MONITOR_TEMPLATES,
  ADD_MONITOR_TEMPLATE,
  UPDATE_MONITOR_TEMPLATE,
  DELETE_MONITOR_TEMPLATE,
  OPEN_MONITOR_TEMPLATE_MODAL,
  CLOSE_MONITOR_TEMPLATE_MODAL,

  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

export const fetchMonitorTemplates = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/monitortemplate`)
      .then(response => fetchMonitorTemplatesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchMonitorTemplatesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_MONITOR_TEMPLATES,
    data: response.data._embedded.monitorTemplates
  })
}

export const addMonitorTemplate = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/monitortemplate`, props)
      .then(response => addMonitorTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addMonitorTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_MONITOR_TEMPLATE,
    data: response.data
  })
  dispatch(closeMonitorTplModal())
}

export const updateMonitorTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateMonitorTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateMonitorTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_MONITOR_TEMPLATE,
    data: response.data
  })
  dispatch(closeMonitorTplModal())
}

export const deleteMonitorTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href, entity)
      .then(() => deleteMonitorTemplateSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteMonitorTemplateSuccess = (dispatch, entity) => {
  dispatch({
    type: DELETE_MONITOR_TEMPLATE,
    data: entity
  })
}

export const openMonitorTplModal = (tpl) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_MONITOR_TEMPLATE_MODAL,
      data: tpl
    })
  }
}

export const closeMonitorTplModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MONITOR_TEMPLATE_MODAL
    })
  }
}
