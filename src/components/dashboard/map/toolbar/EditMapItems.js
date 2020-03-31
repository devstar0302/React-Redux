import React from 'react'

const EditMapItems = ({ onClick, editable }) => (
  <ul className="dropdown-menu drop-right">
    <li>
      <a href="javascript:;" onClick={onClick}
        className={`option ${editable ? 'option-active' : ''}`}
      >
        <i className="fa fa-edit margin-md-right" />Edit
      </a>
    </li>
    <li>
      <a
        href="javascript:;"
        className="option edit-undo"
      >
        <i className="fa fa-undo margin-md-right" />Undo
      </a>
    </li>
  </ul>
)

export default EditMapItems
