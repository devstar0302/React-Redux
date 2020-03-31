import React from 'react'
import moment from 'moment'
import Dimen from 'react-dimensions'

const containerStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%'
}

class MonitorStatusView extends React.Component {
  getSizeInfo () {
    const w = this.props.containerWidth
    const h = this.props.containerHeight
    if (w >= 280 && h >= 170) {
      return {
        mt: 20,
        icon: 60,
        iconFont: '70px',
        text: '20px'
      }
    }
    return {
      mt: 5,
      icon: 20,
      iconFont: '20px',
      text: '12px'
    }
  }
  render () {
    const {isUp, lastUpdate, hideLabel, title, onClick} = this.props
    const imgName = `/resources/images/dashboard/map/triangle-${isUp ? 'up' : 'down'}.png`
    const size = this.getSizeInfo()
    return (
      <div className="text-center link" style={containerStyle} onClick={onClick}>
        <div className={`text-ellipsis ${isUp ? 'text-success' : 'text-danger'}`} style={{fontSize: size.iconFont}}>
          <img src={imgName} width={size.icon} alt="" className="valign-top" style={{marginTop: size.mt}}/>
          <span className="margin-md-left">{title || (isUp ? 'Up' : 'Down')}</span>
        </div>
        {!hideLabel && <div style={{fontSize: size.text}}>Last {isUp ? 'down' : 'up'} {lastUpdate ? moment(lastUpdate).fromNow() : 'never'}</div>}
      </div>
    )
  }
}

export default Dimen({
  elementResize: true
})(MonitorStatusView)