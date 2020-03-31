import React from 'react'

const SelectRule = ({onChange, items, ref}) => (
  <div className="col-md-5">
    <select
      className="form-control"
      onChange={onChange}
      ref={ref}
    >
      {items.map(item =>
        <option key={item.id} value={item.id}>{item.name}</option>
      )}
    </select>
  </div>
)

export default SelectRule
