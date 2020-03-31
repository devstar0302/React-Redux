import axios from 'axios'
import {
  AUTH_USER,
  INVALIDATE_USER,
  FETCH_USER_INFO,
  UPDATE_USER_INFO,
  OPEN_PROFILE_MODAL,
  CLOSE_PROFILE_MODAL,
  CHANGE_PROFILE_IMG,
  OPEN_ACTIVATION_MODAL,
  CLOSE_ACTIVATION_MODAL,
  ACTIVATE_USER,
  ACTIVATE_MSG,
  FETCH_MESSAGE,
  NO_AUTH_ERROR
} from './types'

import { apiError, authError } from './Errors'

import { ROOT_URL } from './config'
import { getAuthConfig, getRequestConfig } from './util'

export const signUser = ({ email, password }, redirect, history) => {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/api/auth/login`,
      {
        username: email,
        password: password
      },
      getRequestConfig()
    )
    .then(response => signUserSuccess(dispatch, response, redirect, history))
    .catch(() => authError(dispatch))
  }
}

const signUserSuccess = (dispatch, response, redirect, history) => {
  dispatch({
    type: AUTH_USER
  })
  window.localStorage.setItem('token', response.data.token)
  if (redirect) {
    try {
      const loc = JSON.parse(redirect)
      history.push({
        pathname: loc.p,
        search: loc.q
      })
      return
    } catch (e) {

    }
  }
  history.push('/')
}

export const signOut = () => {
  window.localStorage.removeItem('token')
  return {
    type: INVALIDATE_USER
  }
}

export const signup = ({ email, password }) => {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, {email, password})
      .then(response => signupSuccess(dispatch, response))
      .catch(error => authError(dispatch, error))
  }
}

const signupSuccess = (dispatch, response) => {
  console.log(response)
  dispatch({
    type: AUTH_USER
  })
  window.localStorage.setItem('token', response.data.token)
  // browserHistory.push('/feature')
}

export const fetchUserInfo = () => {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/api/me`, getAuthConfig())
      .then(response => fetchUserInfoSuccess(dispatch, response))
      .catch(error => authError(dispatch, error))
  }
}

const fetchUserInfoSuccess = (dispatch, response) => {
  axios.get(`${ROOT_URL}/user/${response.data.id}`).then(res => {
    dispatch({
      type: FETCH_USER_INFO,
      data: res.data
    })
  }).catch(error => authError(dispatch, error))
}

export const updateUserProfile = (props) => {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/user/${props.id}`, props)
      .then(response => updateUserProfileSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateUserProfileSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_USER_INFO,
    data: response.data
  })
  dispatch(closeProfileModal())
}

export const openProfileModal = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_PROFILE_MODAL
    })
  }
}

export const closeProfileModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_PROFILE_MODAL
    })
  }
}

export function changeProfileImg (img) {
  return dispatch => {
    dispatch({type: CHANGE_PROFILE_IMG, img})
  }
}

export function activateUser (params) {
  return dispatch => {
    dispatch({type: ACTIVATE_MSG, msg: ''})
    axios.get(`${ROOT_URL}/activate`, {params}).then(response => {
      const res = response.data
      if (res.success) {
        dispatch({type: ACTIVATE_USER})
        dispatch(closeActivationModal())
      } else {
        dispatch({type: ACTIVATE_MSG, msg: res.info})
      }
    }).catch(e => {
      console.log(e)
      dispatch({type: ACTIVATE_MSG, msg: 'Server connection failed.'})
    })
  }
}

export function openActivationModal () {
  return dispatch => {
    dispatch({type: OPEN_ACTIVATION_MODAL})
  }
}

export function closeActivationModal () {
  return dispatch => {
    dispatch({type: CLOSE_ACTIVATION_MODAL})
  }
}

export const fetchMessage = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/api/me`, getAuthConfig())
      .then(response => fetchMessageSuccess(dispatch, response))
      .catch(error => authError(error)) // TODO: here may be another error action
  }
}

const fetchMessageSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_MESSAGE,
    payload: response.data.username
  })
}
