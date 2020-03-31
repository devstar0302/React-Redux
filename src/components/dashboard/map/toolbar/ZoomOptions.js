import React from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const ZoomOptions = ({onZoomIn, onZoomOut, onZoomRect, onZoomReset}) => (
  <IconMenu
    iconButtonElement={
      <IconButton style={buttonStyle} iconStyle={iconStyle}>
        <ZoomInIcon color="#545454"/>
      </IconButton>
    }
    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
    targetOrigin={{horizontal: 'left', vertical: 'top'}}
  >
    <MenuItem onTouchTap={onZoomIn}>Zoom in</MenuItem>
    <MenuItem onTouchTap={onZoomOut}>Zoom Out</MenuItem>
    <MenuItem onTouchTap={onZoomRect}>Zoom Rect</MenuItem>
    <MenuItem onTouchTap={onZoomReset}>Reset</MenuItem>
  </IconMenu>
)
/* const ZoomOptions = ({maximized, zooming, onMaximize, onZoomIn, onZoomOut,
  onZoomRect, onZoomReset}) => (
  <li className="dropdown margin-sm-left">
    <a
      href="javascript:;"
      className="option maximize p-none"
      onClick={onMaximize}
      style={{display: maximized ? 'none' : 'block'}}
    >
      <i className="fa fa fa-arrows-alt" title="Maximize" />
      <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
    </a>
    <a
      href="javascript:;"
      className="option restore p-none"
      style={{display: maximized ? 'block' : 'none'}}
      onClick={onMaximize}
    >
      <i className="fa fa fa-compress" title="Restore" />
      <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
    </a>
    <ul className="dropdown-menu drop-right">
      <li>
        <a
          href="javascript:;"
          className={`option ${zooming ? 'option-active' : ''}`}
          onClick={onZoomRect}
        >
          <i className="fa fa-search margin-md-right" />Zoom Rect
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          className="option"
          onClick={onZoomIn}
        >
          <i className="fa fa-search-plus margin-md-right" />Zoom In
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          className="option"
          onClick={onZoomOut}
        >
          <i className="fa fa-search-minus margin-md-right" />Zoom Out
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          className="option"
          onClick={onZoomReset}
        >
          <i className="fa fa fa-square-o margin-md-right" />Reset
        </a>
      </li>
    </ul>
  </li>
) */

export default ZoomOptions
