import React from 'react'
import HomeIcon from 'material-ui/svg-icons/action/home'
import SearchIcon from 'material-ui/svg-icons/action/search'
import ChatIcon from 'material-ui/svg-icons/communication/chat'
import BugReportIcon from 'material-ui/svg-icons/action/bug-report'
import NotificationsNoneIcon from 'material-ui/svg-icons/social/notifications-none'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import DashboardIcon from 'material-ui/svg-icons/action/dashboard'
// import ExitIcon from 'material-ui/svg-icons/action/exit-to-app'
import PlaylistIcon from 'material-ui/svg-icons/av/playlist-add-check'
import { sidebarIconsColor } from 'style/common/materialStyles'

const home = <HomeIcon color={sidebarIconsColor}/>
const search = <SearchIcon color={sidebarIconsColor}/>
const chat = <ChatIcon color={sidebarIconsColor}/>
const threatmap = <BugReportIcon color={sidebarIconsColor}/>
const incidents = <NotificationsNoneIcon color={sidebarIconsColor}/>
const settings = <SettingsIcon color={sidebarIconsColor}/>
const back = <BackIcon color={sidebarIconsColor}/>
const monitors = <PlaylistIcon color={sidebarIconsColor}/>
const dashboard = <DashboardIcon color={sidebarIconsColor}/>
// const exit = <ExitIcon color={sidebarIconsColor}/>

export const mainMenu = [
  {id: 'home', title: 'Home', icon: home, path: '/'},
  {id: 'dashboard', title: 'Dashboard', icon: dashboard, path: '/dashboard'},
  {id: 'search', title: 'Search', icon: search, path: '/search'},
  {id: 'incidents', title: 'Incidents', icon: incidents, path: '/', search: '?bigincidents='},
  {id: 'chat', title: 'Chat', icon: chat, path: '/chat'},
  {id: 'threatmap', title: 'Threat Map', icon: threatmap, path: '/threatmap'},
  {id: 'settings', title: 'Settings', icon: settings, path: '/settings'}
  // {id: 'logout', title: 'Log Out', icon: exit, path: '/signout'}
]

export const deviceMenu = (deviceId) => {
  return [
    {id: 'home', title: 'Back', icon: back, path: '/'},
    {id: 'devicemain', title: 'Dashboard', icon: dashboard, path: `/device/${deviceId}/dashboard`},
    {id: 'topology', title: 'Topology', icon: threatmap, group: true, path: `/device/${deviceId}/topology`},
    {id: 'devices', title: 'Devices', icon: chat, group: true, path: `/device/${deviceId}/list`},
    {id: 'incidents', title: 'Incidents', icon: incidents, path: `/device/${deviceId}/main`},
    {id: 'monitors', title: 'Monitors', icon: monitors, path: `/device/${deviceId}/monitor`},
    {id: 'connected', title: 'Connected Devices', icon: search, path: `/device/${deviceId}/connected`},
    {id: 'deviceinfo', title: 'Device Info', icon: settings, path: `/device/${deviceId}/info`}
  ]
}

export const contentType = {
  Device: 'device',
  Main: 'main'
}
