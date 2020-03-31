import {
  FETCH_ATTACKERS
} from 'actions/types'

const initialState = {
  attackers: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ATTACKERS:
      return { ...state, attackers: action.data }
    default:
      return state
  }
}
