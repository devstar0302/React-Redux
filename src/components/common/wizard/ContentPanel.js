import React from 'react'

const style = {
  header: {
    background: '#c5c5c5',
    color: 'white'
  },
  body: {
    minHeight: '280px',
    paddingTop: 0,
    background: '#f8f8f8'
  }
}
export default class ContentPanel extends React.Component {
  render () {
    const {width, title} = this.props
    return (
      <div className={`col-md-${width} margin-md-top`}>
        <div className="panel panel-gray">
          <div className="panel-heading" style={style.header}>
            {title}
          </div>
          <div className="panel-body" style={style.body}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
