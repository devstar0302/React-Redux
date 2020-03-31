import { SIDEBAR_ITEM_CLICKED } from 'actions/types'

export default function (state = {}, action) {
  switch (action.type) {
    case SIDEBAR_ITEM_CLICKED:
      return { ...state, sidebarIndex: action.index }
    default:
      return state
  }
}
