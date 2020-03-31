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
} from 'actions/types'

const INITIAL_STATE = {
  gauges: [],
  gaugeItems: [],
  gaugeBoards: []
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_GAUGES:
      return { ...state, gauges: action.data }
    case FETCH_GAUGE_ITEMS:
      return { ...state, gaugeItems: action.data }

    case FETCH_GAUGE_BOARDS:
      return { ...state, gaugeBoards: action.data }
    case ADD_GAUGE_BOARD:
      return { ...state, gaugeBoards: [...state.gaugeBoards, action.data]}
    case UPDATE_GAUGE_BOARD:
      return { ...state, gaugeBoards: state.gaugeBoards.map(p => p.id === action.data.id ? action.data : p) }
    case REMOVE_GAUGE_BOARD:
      return { ...state, gaugeBoards: state.gaugeBoards.filter(p => p.id !== action.data.id) }
    case SELECT_GAUGE_BOARD:
      return { ...state, selectedGaugeBoard: action.data }
    case SHOW_GAUGE_BOARDS_MODAL:
      return { ...state, gaugeBoardsModalOpen: !!action.visible }
    case SHOW_GAUGE_MODAL:
      return { ...state, gaugeModalOpen: action.visible, editGauge: action.gauge }
    case SHOW_GAUGE_PICKER:
      return { ...state, gaugePickerOpen: action.visible }
    default:
      return state
  }
}
