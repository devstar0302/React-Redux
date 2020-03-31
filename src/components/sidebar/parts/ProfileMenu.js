import React from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import AccoutCircleIcon from 'material-ui/svg-icons/action/account-circle'

import {iconStyle, iconButtonStyle} from 'style/common/materialStyles'

const ProfileMenu = ({open, user, onClickProfile, onClickMessages, onSignOut, showSidebarProfileMenu}) => (
  <div className="sidebar-item-container" onClick={() => showSidebarProfileMenu(true)}>
    <IconMenu
      open={open}
      onRequestChange={showSidebarProfileMenu}
      iconButtonElement={
        <IconButton
          style={iconButtonStyle}
          iconStyle={iconStyle}>
          <AccoutCircleIcon color="#777777"/>
        </IconButton>
      }
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
      <MenuItem primaryText="Profile" onTouchTap={onClickProfile}/>
      <MenuItem primaryText="Messages" onTouchTap={onClickMessages}/>
      <Divider />
      <MenuItem primaryText="Log out" onTouchTap={onSignOut}/>
    </IconMenu>
    <div className="sidebar-title">Profile</div>
  </div>
)

export default ProfileMenu
