import React from 'react'
import CommentsModal from 'components/common/incident/CommentsModal'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class CommentsModalContainer extends React.Component {
  render () {
    return (
      <MuiThemeProvider>
        <CommentsModal {...this.props} />
      </MuiThemeProvider>
    )
  }
}

CommentsModal.defaultProps = {
  onClose: null,
  incident: {}
}
