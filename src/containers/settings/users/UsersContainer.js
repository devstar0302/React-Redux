import React from 'react'
import Users from 'components/sidebar/settings/users/Users'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {withRouter} from 'react-router'

import {
  fetchSettingUsers,
  openSettingUserModal,
  deleteSettingUser,
  openUserPasswordModal,

  addSettingUser,
  updateSettingUser,
  closeSettingUserModal,

  closeUserPasswordModal,

  openProfileModal,
  closeProfileModal,
  changeProfileImg,
  fetchUserInfo,

  fetchSettingMaps,
  selectUserRoles
} from 'actions'

class UsersContainer extends React.Component {
  render () {
    return (
      <Users {...this.props} />
    )
  }
}
export default connect(
  state => ({
    users: state.settings.users,
    userModalVisible: state.settings.userModalVisible,
    userPasswordModalVisible: state.settings.userPasswordModalVisible,

    editUser: state.settings.editUser,
    selectedRoles: state.settings.selectedRoles,

    user: state.dashboard.userInfo || {},
    maps: state.dashboard.maps,
    profileModalVisible: state.dashboard.profileModalVisible,
    profileImg: state.dashboard.profileImg
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchSettingUsers,
      openSettingUserModal,
      deleteSettingUser,
      openUserPasswordModal,

      addSettingUser,
      updateSettingUser,
      closeSettingUserModal,

      closeUserPasswordModal,

      openProfileModal,
      closeProfileModal,
      changeProfileImg,
      fetchUserInfo,

      fetchSettingMaps,
      selectUserRoles
    }, dispatch)
  })
)(withRouter(UsersContainer))
