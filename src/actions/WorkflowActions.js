import axios from 'axios'
import {
  FETCH_WORKFLOWS,
  ADD_WORKFLOW,
  UPDATE_WORKFLOW,
  REMOVE_WORKFLOW,
  OPEN_WORKFLOW_MODAL,
  CLOSE_WORKFLOW_MODAL,

  UPDATE_WORKFLOW_EDIT_TYPE,

  SHOW_WF_TAG_MODAL,
  ADD_WORKFLOW_TAG,
  REMOVE_WORKFLOW_TAG,

  NO_AUTH_ERROR
} from './types'

import { openDeviceWfDiagramModal } from './DeviceActions'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

export const fetchWorkflows = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/workflow?size=1000&sort=category&sort=severity`)
      .then(response => fetchWorkflowsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchWorkflowsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_WORKFLOWS,
    data: response.data._embedded.workflows
  })
}

export const addWorkflow = (props, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/workflow`, props)
      .then(response => addWorkflowSuccess(dispatch, response, cb))
      .catch(error => apiError(dispatch, error))
  }
}

const addWorkflowSuccess = (dispatch, response, cb) => {
  dispatch({
    type: ADD_WORKFLOW,
    data: response.data
  })
  dispatch(closeWorkflowModal())
  cb && cb(response.data)
}

export const updateWorkflow = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateWorkflowSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateWorkflowSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_WORKFLOW,
    data: response.data
  })
  dispatch(closeWorkflowModal())
}

export const removeWorkflow = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href)
      .then(() => removeWorkflowSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const removeWorkflowSuccess = (dispatch, entity) => {
  dispatch({
    type: REMOVE_WORKFLOW,
    data: entity
  })
}

export const openWorkflowModal = (entity) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_WORKFLOW_MODAL,
      data: entity
    })
    dispatch(openDeviceWfDiagramModal(entity ? entity.flowchart : null))
  }
}

export const closeWorkflowModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_WORKFLOW_MODAL
    })
  }
}

export const updateWorkflowEditType = (editType) => {
  return dispatch => {
    dispatch({
      type: UPDATE_WORKFLOW_EDIT_TYPE, editType
    })
  }
}

export const addWorkflowTag = (tag) => {
  return dispatch => {
    dispatch({type: ADD_WORKFLOW_TAG, tag})
  }
}

export const removeWorkflowTag = (index) => {
  return dispatch => {
    dispatch({type: REMOVE_WORKFLOW_TAG, index})
  }
}

export const showWorkflowTagModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_WF_TAG_MODAL, visible})
  }
}
