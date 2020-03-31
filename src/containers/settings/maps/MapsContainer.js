import React from 'react'
import Maps from 'components/sidebar/settings/maps/Maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  fetchSettingMaps,
  openSettingMapModal,
  deleteSettingMap,
  openMapUsersModal,

  addSettingMap,
  updateSettingMap,
  closeSettingMapModal,

  closeMapUsersModal,
  addMapUser,
  removeMapUser,
  toggleMapUser,

  fetchSettingUsers
} from 'actions'

class MapsContainer extends React.Component {
  render () {
    return (
      <Maps {...this.props} />
    )
  }
}
export default connect(
  state => ({
    maps: state.settings.maps,
    mapModalVisible: state.settings.mapModalVisible,
    mapUsersModalVisible: state.settings.mapUsersModalVisible,

    editMap: state.settings.editMap,

    mapUsers: state.settings.mapUsers,
    users: state.settings.users
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchSettingMaps,
      openSettingMapModal,
      deleteSettingMap,
      openMapUsersModal,

      addSettingMap,
      updateSettingMap,
      closeSettingMapModal,

      closeMapUsersModal,
      addMapUser,
      removeMapUser,
      toggleMapUser,

      fetchSettingUsers
    }, dispatch)
  })
)(MapsContainer)
