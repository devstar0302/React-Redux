import React from 'react'

const TextChange = ({ text, onChange, icon, title }) => (
  <li>
    <div className="option p-none link"
      style={{display: text ? 'block' : 'none'}}
      onClick={onChange}
    >
      <i className={icon} title={title} />
    </div>
  </li>
)

export default TextChange
