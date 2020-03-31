import {
  LOAD_CHAT_INCIDENTS,
  LOAD_CHAT_INCIDENT_USERS,
  UPLOAD_CHAT_IMAGE,
  SET_CHAT_INCIDENTS,
  SET_CHAT_ROOMS,
  SELECT_CHAT_INCIDENT
} from 'actions/types'

const INITIAL_STATE = {
  incidents: [],
  selected: null,
  rooms: {},
  roomUsers: [],
  image: null
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_CHAT_INCIDENTS:
      return { ...state, incidents: action.incidents, rooms: action.rooms }
    case SELECT_CHAT_INCIDENT:
      return { ...state, selected: action.selected, rooms: action.rooms }
    case LOAD_CHAT_INCIDENT_USERS:
      return { ...state, roomUsers: action.roomUsers }
    case UPLOAD_CHAT_IMAGE:
      return { ...state, image: action.image }
    case SET_CHAT_INCIDENTS:
      return { ...state, incidents: action.incidents }
    case SET_CHAT_ROOMS:
      return { ...state, rooms: action.rooms }
    default:
      return state
  }
}
