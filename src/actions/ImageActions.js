import axios from 'axios'
import {
  OPEN_TPL_IMAGE_MODAL,
  CLOSE_TPL_IMAGE_MODAL,

  FETCH_IMAGES,
  UPLOAD_IMAGE,

  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

export const openTplImageModal = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_TPL_IMAGE_MODAL
    })
  }
}

export const closeTplImageModal = (selectedImage) => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_TPL_IMAGE_MODAL,
      data: selectedImage
    })
  }
}

export const uploadImage = (formData, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/upload`, formData)
      .then(response => uploadImageSuccess(dispatch, response, cb))
      .catch(error => apiError(dispatch, error))
  }
}

const uploadImageSuccess = (dispatch, response, cb) => {
  dispatch({
    type: UPLOAD_IMAGE,
    data: response.data
  })
  cb && cb(response.data)
}

export const fetchImages = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/customImage?size=100`)
      .then(response => fetchImagesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchImagesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_IMAGES,
    data: response.data._embedded.customImages
  })
}
