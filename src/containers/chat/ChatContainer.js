import React, { Component } from 'react'
import Chat from 'components/sidebar/chat/Chat'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import {
  loadIncidents,
  loadIncidentUsers,
  uploadChatImage,
  setIncidents,
  setRoomUsers,
  setRooms,
  selectIncident
} from 'actions'

class ChatContainer extends Component {
  render () {
    return (
      <Chat {...this.props} />
    )
  }
}
export default connect(
  state => ({
    incidents: state.chat.incidents,
    rooms: state.chat.rooms,
    image: state.chat.image,
    roomUsers: state.chat.roomUsers,
    selected: state.chat.selected
  }),
  dispatch => ({
    ...bindActionCreators({
      loadIncidents,
      loadIncidentUsers,
      uploadChatImage,
      setIncidents,
      setRoomUsers,
      setRooms,
      selectIncident
    }, dispatch)
  })
)(withRouter(ChatContainer))
