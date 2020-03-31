import React from 'react'

const Messages = () => (
  <ul className="dropdown-menu dropdown-messages pull-right">
    <li className="dropdown-title bg-inverse">New Messages</li>
    <li className="unread">
      <a href="javascript:;" className="message">
        <img className="message-image img-circle"
          src="/images/avatars/1.jpg"/>
        <div className="message-body">
          <strong>Ernest Kerry</strong><br/> Hello, You there?<br/>
          <small className="text-muted">8 minutes ago</small>
        </div>
      </a>
    </li>
    <li className="unread"><a href="javascript:;" className="message">
      <img className="message-image img-circle" src="/images/avatars/3.jpg"/>
      <div className="message-body">
        <strong>Don Mark</strong><br/> I really appreciate your&hellip;
        <br/><small className="text-muted">21 hours</small>
      </div>
    </a></li>
    <li className="dropdown-footer"><a
      href="javascript:showMessages();">
      <i className="fa fa-share" />See all messages</a></li>
  </ul>
)

export default Messages
