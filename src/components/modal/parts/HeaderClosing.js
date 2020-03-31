import React from 'react'
import { headerStyle } from 'style/common/materialStyles'

const HeaderClosing = ({name, onClose}) => (
  <div className="modal-header" style={headerStyle}>
    <h4 className="modal-title">{name}</h4>
    <div className="bootstrap-dialog-close-button">
      <button className="close" onClick={onClose}>×</button>
    </div>
  </div>
)

export default HeaderClosing
