import React from 'react'

export default class CardLegend extends React.Component {
  render () {
    return (
      <div className="margin-lg-top margin-sm-bottom">{this.props.children}</div>
    )
  }
}
