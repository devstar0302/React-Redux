import React from 'react'

const EditMapHeader = ({ isDevicesDisplayed, onClick }) => (
  <a
    href="javascript:"
    onClick={onClick}
    className={`option p-none ${isDevicesDisplayed ? 'option-active' : ''}`}
  >
    <i className="fa fa-plus-square" title="Add" />
    <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
  </a>
)

export default EditMapHeader
