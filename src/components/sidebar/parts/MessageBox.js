import React from 'react'
import Badge from 'material-ui/Badge'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import EmailIcon from 'material-ui/svg-icons/communication/email'
import InboxIcon from 'material-ui/svg-icons/content/inbox'
import Message from './Message'

import {badgeStyle, badgeRootStyle, iconStyle, iconButtonStyle} from 'style/common/materialStyles'

const iconMenuStyle = {
  paddingTop: '0px',
  paddingBottom: '0px'
}

const dividerStyle = {
  marginTop: '0px',
  marginBottom: '0px'
}

const newStyle = {
  backgroundColor: '#52a1bf',
  color: '#ffffff',
  paddingTop: '3px',
  paddingBottom: '3px'
}

const seeAllStyle = {
  backgroundColor: '#e8e6e6',
  paddingTop: '3px',
  paddingBottom: '3px'
}

const messageStyle = {
  paddingTop: '3px',
  paddingBottom: '3px'
}

const MessageBox = ({open, openSidebarMessageMenu, closeSidebarMessageMenu}) => (
  <div className="sidebar-item-container" onClick={openSidebarMessageMenu}>
    <Badge
      badgeContent={4}
      badgeStyle={badgeStyle}
      style={badgeRootStyle}
    >
      <IconMenu
        iconButtonElement={
          <IconButton
            style={iconButtonStyle}
            iconStyle={iconStyle}
            tooltip="Messages"
            tooltipPosition="top-right">
              <EmailIcon color="#777777"/>
          </IconButton>
        }
        open={open}
        onRequestChange={(value) => value ? openSidebarMessageMenu() : closeSidebarMessageMenu()}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        listStyle={iconMenuStyle}
      >
        <MenuItem style={newStyle} primaryText="New messages" />
        <Divider style={dividerStyle}/>
        <MenuItem style={messageStyle}>
          <Message
            avatar="/images/avatars/1.jpg"
            name="Ernest Kerry"
            message="Hello, You there?"
            time="8 minutes ago"
          />
        </MenuItem>
        <Divider style={dividerStyle}/>
        <MenuItem style={messageStyle}>
          <Message
            avatar="/images/avatars/3.jpg"
            name="Don Mark"
            message="Hello? How are you? Do you want to go to my birthday party?"
            time="21 hours"
          />
        </MenuItem>
        <Divider style={dividerStyle}/>
        <MenuItem
          className="see-all-messages"
          primaryText="See all messages"
          leftIcon={<InboxIcon/>}
          style={seeAllStyle}/>
      </IconMenu>
    </Badge>
    <div className="sidebar-title">Messages</div>
  </div>
)

export default MessageBox
