import React from 'react'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'

export default class ImportSyncDataModal extends React.Component {
  doAction (values) {
    const formData = new window.FormData()
    formData.append('file', values.file[0], values.file[0].name)

    this.props.onSubmit(formData)
  }

  render () {
    return (
      <SimpleModalContainer
        header="Import Sync Data"
        content={[]}
        doAction={this.doAction.bind(this)}
        onClose={this.props.onClose}
        fileUpload
      />
    )
  }
}
