import React from 'react'

const ChangeLineType = ({ line, onChange, lineTypes }) => (
  <li>
    <div onClick={onChange} className="option p-none link" style={{display: line ? 'block' : 'none'}}>
      <i className="fa fa-reply" title="Change Type" />
    </div>
    {lineTypes}
  </li>
)

export default ChangeLineType
