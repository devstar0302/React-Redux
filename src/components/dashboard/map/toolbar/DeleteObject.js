import React from 'react'
import {assign} from 'lodash'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const DeleteObject = ({ obj, onDelete }) => (
  <IconButton
    style={assign({}, buttonStyle, {display: obj ? 'block' : 'none'})}
    iconStyle={iconStyle}
    onTouchTap={onDelete}>
    <DeleteIcon color="#545454"/>
  </IconButton>
)

export default DeleteObject
