import React from 'react'
import TextField from 'material-ui/TextField'
import { inputStyle, underlineStyle } from 'style/common/materialStyles'

const defaultStyle = {
  backgroundColor: 'inherit'
}

const activeStyle = {
  backgroundColor: '#eaeaea'
}

const SimpleSearchBar = ({onSearch, active, onFocus, onBlur, defaultKeyword, autoFocus}) => (
  <div className="searchbar-container" style={active ? activeStyle : defaultStyle}>
    <TextField hintText="Search..."
      inputStyle={inputStyle}
      underlineFocusStyle={underlineStyle}
      onFocus={onFocus}
      onBlur={onBlur}
      autoFocus={autoFocus}
      defaultValue={defaultKeyword}
      onChange={onSearch}
      id="searchInput"
    />
  </div>
)

export default SimpleSearchBar
