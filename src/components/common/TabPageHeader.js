import React from 'react'

export default class TabPageHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className="tab-header">
        <div>
          <span className="tab-title">{this.props.title}</span>
          {this.props.titleOptions}
          <div className="pull-right">
            {this.props.headerOptions}
          </div>
        </div>
        <div className="margin-md-top" style={{...this.props.style, width: '100%'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

TabPageHeader.defaultProps = {
  title: ''
}
