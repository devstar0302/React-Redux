import React, { Component } from 'react'
import InfiniteTable from 'components/common/InfiniteTable'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import CreateIcon from 'material-ui/svg-icons/content/create'
import { CloseButton, Modal, CardPanel } from 'components/modal/parts'
import { buttonStyle, iconStyle } from 'style/common/materialStyles'

export default class SegmentListModalView extends Component {
  render () {
    const {onHide, cells, onAdd, onEdit, onDelete} = this.props
    return (
      <Modal title="Segments" onRequestClose={onHide}>
        <CardPanel title="Segments" className="margin-md-bottom">
          <div className="panel panel-default">
            <div>
              <IconButton
                style={buttonStyle}
                iconStyle={iconStyle}
                onTouchTap={onAdd}>
                  <AddCircleIcon color="#545454"/>
              </IconButton>
              <IconButton
                style={buttonStyle}
                iconStyle={iconStyle}
                onTouchTap={onEdit}>
                  <CreateIcon color="#545454"/>
              </IconButton>
              <IconButton
                style={buttonStyle}
                iconStyle={iconStyle}
                onTouchTap={onDelete}>
                  <DeleteIcon color="#545454"/>
              </IconButton>
            </div>
            <div className="panel-body">
              <InfiniteTable
                url="/admin/getSegments"
                params={{}}
                cells={cells}
                rowMetadata={{'key': 'id'}}
                selectable
                bodyHeight={400}
              />
            </div>
          </div>
        </CardPanel>
        <CloseButton onClose={onHide}/>
      </Modal>
    )
  }
}
