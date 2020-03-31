import React from 'react'
import InfoIcon from 'material-ui/svg-icons/action/info'
import DeleteIcon from 'material-ui/svg-icons/navigation/close'
import MinimizeIcon from 'material-ui/svg-icons/toggle/indeterminate-check-box'
import MaximizeIcon from 'material-ui/svg-icons/action/aspect-ratio'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import RefreshOverlay from 'components/common/RefreshOverlay'
import {Paper} from 'material-ui'

import {paperZDepth} from 'style/common/materialStyles'

export default class FlipView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      flip: false,
      clicked: false,
      hovered: false
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  getFlipClass () {
    var flippedCSS = this.state.flip ? " card-back-flip" : " card-front-flip";
    if (!this.state.clicked) flippedCSS =  "";
    return flippedCSS
  }

  onClickFlip (e) {
    const {onClickFlip} = this.props
    this.setState({flip: !this.state.flip, clicked: true})
    e && e.preventDefault()

    onClickFlip && onClickFlip()
  }

  onMouseEnter () {
    this.setState({
      hovered: true
    })
  }

  onMouseLeave () {
    this.setState({
      hovered: false
    })
  }

  renderInfoIcon () {
    const {hovered} = this.state
    const {onClickDelete, onClickMinimize, onClickMaximize, onClickRefresh, gauge} = this.props
    return (
      <div
        style={{position: 'absolute', right: 5, bottom: 5, zIndex: 1}}
        className={`link info-button ${hovered ? 'visible' : ''}`}>
        {onClickRefresh && <RefreshIcon onTouchTap={() => onClickRefresh(gauge)}/>}
        {
          gauge.minimized ? (
            <MaximizeIcon onTouchTap={() => onClickMaximize(gauge)}/>
          ) : (
            <MinimizeIcon onTouchTap={() => onClickMinimize(gauge)}/>
          )
        }
        <DeleteIcon onTouchTap={() => onClickDelete(gauge)}/>
        <InfoIcon size={24} onClick={this.onClickFlip.bind(this)}/>
      </div>
    )
  }

  renderFront () {
    const {renderFrontView} = this.props
    return (
      <div className="flex-vertical flex-1">
        {renderFrontView && renderFrontView()}
      </div>
    )
  }

  renderBack () {
    const {renderBackView} = this.props
    return renderBackView && renderBackView({
      onClickFlip: this.onClickFlip.bind(this)
    })
  }

  renderCard (cls, children, front) {
    const {gauge, loading, viewOnly, onClickModalView, paperStyle, hideTitle, hideContentPadding} = this.props
    return (
      <div className={`${cls} ${this.getFlipClass()}`}>
        <div className="flex-vertical" style={{height: '100%'}}>
          {
            front ? (
              gauge.minimized ? (
                <div
                  className="flex-1 text-center"
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onClick={() => onClickModalView(gauge)}>
                  <img src="/resources/images/dashboard/gauge.png" width="48" alt=""/><br/>
                  {gauge.name}
                  {!viewOnly && this.renderInfoIcon()}
                </div>
              ) : (
                <Paper className="flex-1 flex-vertical" style={paperStyle} zDepth={paperZDepth} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                  {!hideTitle && <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.54)', height: 48, paddingLeft: 20, paddingTop: 16}}>
                    {gauge.name}
                  </div>}
                  <div className="flex-1 flex-vertical" style={hideContentPadding ? {paddingBottom: 16} : {padding: '16px 20px 35px'}}>
                    {children}
                  </div>
                  {!viewOnly && this.renderInfoIcon()}
                  {loading && front && <RefreshOverlay />}
                </Paper>
              )
            ) : (
              <div className="flex-1">
                {children}
              </div>
            )
          }

        </div>
      </div>
    )
  }

  render () {
    const {className, style, modalView} = this.props
    // const {flip} = this.state

    if (modalView) {
      return this.props.renderFrontView()
    }

    return (
      <div className={`${className || ''} card`} style={style}>
        {this.renderCard('card-back', this.renderBack())}
        {this.renderCard('card-front', this.renderFront(), true)}
      </div>
    )
  }
}
