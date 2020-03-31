import React from 'react'

export class Panel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {className, bsStyle} = this.props

    return (
      <div className={`panel panel-${bsStyle || 'default'} ${className || ''}`} >
        {this.props.children}
      </div>
    )
  }
}

Panel.defaultProps = {
  bsStyle: 'default',
  className: ''
}

// /////////////////////////////////////////////////////////

export class PanelHeader extends React.Component { // eslint-disable-line react/no-multi-comp
  render () {
    const {className, title} = this.props

    return (
      <div className={`panel-heading ${className}`}>
        <span className="panel-title">{title}</span>
        {this.props.children}
      </div>
    )
  }
}
PanelHeader.defaultProps = {
  title: '',
  className: ''
}

// /////////////////////////////////////////////////////////

export class PanelOptions extends React.Component { // eslint-disable-line react/no-multi-comp
  render () {
    return (
            <div className="panel-options">
                {this.props.children}
            </div>
    )
  }
}

// /////////////////////////////////////////////////////////

export class PanelBody extends React.Component { // eslint-disable-line react/no-multi-comp
  render () {
    const className = this.props.className
    const style = this.props.style
    return (
            <div className={`panel-body ${className}`} style={style}>
                {this.props.children}
            </div>
    )
  }
}

PanelBody.defaultProps = {
  className: ''
}

// /////////////////////////////////////////////////////////
