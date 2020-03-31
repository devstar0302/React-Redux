import React from 'react'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import CreateIcon from 'material-ui/svg-icons/content/create'
import { buttonStyle, iconStyle } from 'style/common/materialStyles'

const CrudButtons = ({onAdd, onEdit, onDelete}) => (
  <div className="crud-buttons">
    {onAdd && <div className="add-button">
      <IconButton
        style={buttonStyle}
        iconStyle={iconStyle}
        onTouchTap={onAdd}>
          <AddCircleIcon color="#545454"/>
      </IconButton>
    </div>}
    <div className="edit-button">
      <IconButton
        style={buttonStyle}
        iconStyle={iconStyle}
        onTouchTap={onEdit}>
          <CreateIcon color="#545454"/>
      </IconButton>
    </div>
    <div className="remove-button">
      <IconButton
        style={buttonStyle}
        iconStyle={iconStyle}
        onTouchTap={onDelete}>
          <DeleteIcon color="#545454"/>
      </IconButton>
    </div>
  </div>
)

export default CrudButtons
