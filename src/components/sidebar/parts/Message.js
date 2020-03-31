import React from 'react'
import Avatar from 'material-ui/Avatar'

const Message = ({avatar, name, message, time}) => (
  <div className="topbar-message">
    <div className="message-avatar"><Avatar src={avatar} /></div>
    <div className="message-text">
      <div><strong>{name}</strong></div>
      <small className="inner-text text-muted">{message}</small>
    </div>
    <div className="message-time"><small className="text-muted">{time}</small></div>
  </div>
)

export default Message
