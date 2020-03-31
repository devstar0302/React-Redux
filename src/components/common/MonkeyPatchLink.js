import React, { Component, PropTypes } from 'react'
const ReactRouter = require('react-router-dom')
const { Link } = ReactRouter

class MonkeyPatchLink extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    onTouchTap: PropTypes.func,
    onClick: PropTypes.func
  }

  constructor (...args) {
    super(...args)
    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleTouchTap (e) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(e)
    }
    if ('button' in e.nativeEvent === false) {
      // If touch event
      e.nativeEvent.button = 0
    }
    Link.prototype.handleClick.call(this, e.nativeEvent)
  }

  handleClick (e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
    e.preventDefault()
  }

  render () {
    return (
      <Link {...this.props} onClick={this.handleClick} onTouchTap={this.handleTouchTap} />
    )
  }
}

ReactRouter.Link = MonkeyPatchLink
export default MonkeyPatchLink
