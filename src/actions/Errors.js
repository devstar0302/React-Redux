import {
  API_ERROR,
  UPDATE_DEVICE_ERROR,
  AUTH_ERROR,
  NO_AUTH_ERROR
} from './types'

export const apiError = (dispatch, error) => {
  dispatch({
    type: API_ERROR,
    msg: error
  })
}

export const updateDeviceError = (dispatch, error) => {
  dispatch({
    type: UPDATE_DEVICE_ERROR,
    msg: error
  })
}

export const authError = (dispatch) => {
  window.localStorage.removeItem('token')
  dispatch({
    type: AUTH_ERROR,
    msg: 'Wrong credentials.'
  })
}

export const noAuthError = (dispatch) => {
  window.localStorage.removeItem('token')
  dispatch({
    type: NO_AUTH_ERROR
  })
}
