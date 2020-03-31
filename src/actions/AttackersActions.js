import axios from 'axios'
import {
  FETCH_ATTACKERS,
  NO_AUTH_ERROR
} from './types'

import { apiError } from './Errors'
import { ROOT_URL } from './config'

export const fetchAttackers = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/incident/attackers`, {params: {}})
      .then(response => fetchAttackersSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchAttackersSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_ATTACKERS,
    data: response.data
  })
}
