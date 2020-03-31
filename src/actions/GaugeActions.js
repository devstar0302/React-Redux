import axios from 'axios'
import {findIndex} from 'lodash'
import {
  FETCH_GAUGES,
  FETCH_GAUGE_ITEMS,

  FETCH_GAUGE_BOARDS,
  ADD_GAUGE_BOARD,
  UPDATE_GAUGE_BOARD,
  REMOVE_GAUGE_BOARD,

  SELECT_GAUGE_BOARD,

  SHOW_GAUGE_BOARDS_MODAL,

  SHOW_GAUGE_MODAL,

  SHOW_GAUGE_PICKER
} from './types'

import { apiError } from './Errors'

import { ROOT_URL } from './config'

export const fetchGauges = (cb) => {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/gauge`).then(response => {
      dispatch({type: FETCH_GAUGES, data: response.data._embedded.gauges})
    }).catch(error => apiError(dispatch, error))
  }
}

export const fetchGaugeItems = () => {
  return dispatch => {
    axios.get(`${ROOT_URL}/gaugeitem`).then(res => {
      dispatch({type: FETCH_GAUGE_ITEMS, data: res.data._embedded.gaugeItems})
    })
  }
}

export const addGaugeItem = (props, board) => {
  return dispatch => {
    dispatch(updateGaugeBoard({
      ...board,
      gauges: [...(board.gauges || []), props]
    }))
  }
}

export const updateGaugeItem = (props, board) => {
  return dispatch => {
    const gauges = (board.gauges || []).map(p => {
      if (props.length) {
        const index = findIndex(props, {id: p.id})
        return index < 0 ? p : props[index]
      } else {
        return p.id === props.id ? props : p
      }
    })
    dispatch(updateGaugeBoard({
      ...board,
      gauges
    }))
  }
}

export const removeGaugeItem = (props, board) => {
  return dispatch => {
    dispatch(updateGaugeBoard({
      ...board,
      gauges: (board.gauges || []).filter(p => p.id !== props.id)
    }))
  }
}

export const fetchGaugeBoards = () => {
  return dispatch => {
    dispatch({type: FETCH_GAUGE_BOARDS, data: []})
    axios.get(`${ROOT_URL}/gaugeboard`).then(res => {
      const data = res.data._embedded.gaugeBoards
      data.sort((a, b) => {
        if (!a.defaultSetDate && !b.defaultSetDate) return 0
        if (!a.defaultSetDate || a.defaultSetDate > b.defaultSetDate ) return -1
        if (!b.defaultSetDate || a.defaultSetDate < b.defaultSetDate ) return 1
        return 0
      })
      dispatch({type: FETCH_GAUGE_BOARDS, data})
    })
  }
}

export const addGaugeBoard = (props) => {
  return dispatch => {
    axios.post(`${ROOT_URL}/gaugeboard`, props).then(res => {
      dispatch({type: ADD_GAUGE_BOARD, data: res.data})
    })
  }
}

export const updateGaugeBoard = (entity) => {
  return dispatch => {
    axios.put(entity._links.self.href, entity).then(res => {
      dispatch({type: UPDATE_GAUGE_BOARD, data: res.data})
    })
  }
}

export const removeGaugeBoard = (entity) => {
  return dispatch => {
    axios.delete(entity._links.self.href, entity).then(() => {
      dispatch({type: REMOVE_GAUGE_BOARD, data: entity})
    })
  }
}

export const selectGaugeBoard = (data, history, push) => {
  return dispatch => {
    dispatch({type: SELECT_GAUGE_BOARD, data})
    if (history) {
      if (push) history.push(`/dashboard/${data}`)
      else history.replace(`/dashboard/${data}`)
    }
  }
}

export const setDefaultGaugeBoard = (entity) => {
  return dispatch => {
    axios.put(entity._links.self.href, {
      ...entity,
      defaultSetDate: new Date().getTime()
    }).then(res => {
      dispatch({type: UPDATE_GAUGE_BOARD, data: res.data})
    })
  }
}

export const showGaugeBoardsModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_GAUGE_BOARDS_MODAL, visible})
  }
}

export const showGaugeModal = (visible, gauge) => {
  return dispatch => {
    dispatch({type: SHOW_GAUGE_MODAL, visible, gauge})
  }
}
export const showGaugePicker = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_GAUGE_PICKER, visible})
  }
}
